import { router, useForm } from '@inertiajs/react';
import { useMemo, useState, useCallback } from 'react';
import axios from 'axios';
import * as tus from 'tus-js-client';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Box, Typography, Button, Paper, Stack, Chip, Divider, IconButton,
    Accordion, AccordionSummary, AccordionDetails,
    useMediaQuery, useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import MentorStorageUsage from '@/Components/Mentor/Courses/MediaContents/MentorStorageUsage';
import MentorMaterialItem from '@/Components/Mentor/Courses/MediaContents/MentorMaterialItem';
import MentorAddMaterialDialog from '@/Components/Mentor/Courses/MediaContents/MentorAddMaterialDialog';
import MentorAddVideoDialog from '@/Components/Mentor/Courses/MediaContents/MentorAddVideoDialog';
import MentorAddMaterialMenu from '@/Components/Mentor/Courses/MediaContents/MentorAddMaterialMenu';
import ContentRemovalWarningModal from '@/Components/Mentor/Courses/ContentRemovalWarningModal';

const getVideoDuration = (file) =>
    new Promise((resolve) => {
        const el = document.createElement('video');
        el.preload = 'metadata';
        el.onloadedmetadata = () => { window.URL.revokeObjectURL(el.src); resolve(Math.round(el.duration)); };
        el.src = URL.createObjectURL(file);
    });

export default function EditMediaContentModal({ open, onClose, course }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const [selectedVideoLesson, setSelectedVideoLesson] = useState(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [menuLesson, setMenuLesson] = useState(null);

    // Video upload state (mirrors MediaContent.jsx)
    const [uploadProgress, setUploadProgress] = useState(null);
    const [videoUploadError, setVideoUploadError] = useState(null);
    const [isVideoUploading, setIsVideoUploading] = useState(false);

    // Deletion Modal State
    const [pendingRemoval, setPendingRemoval] = useState(null);

    const { data, setData, post, processing, reset } = useForm({
        title: '', file: null, duration_seconds: '', from_edit: true,
    });
    const { data: videoData, setData: setVideoData, reset: resetVideo } = useForm({ video: null, thumbnailBlob: null, });

    const modules = useMemo(() => {
        return (course?.syllabuses ?? []).map((s) => ({
            id: s.id,
            title: s.title,
            status: s.draft_status || 'draft',
            lessons: (s.lessons ?? []).map((l) => ({
                id: l.id,
                title: l.title,
                description: l.description || '',
                materials: (l.materials ?? []).map((m) => ({
                    id: m.id, type: m.type, title: m.title, url: m.url,
                    size_bytes: m.size_bytes, mime_type: m.mime_type,
                    original_name: m.original_name, duration_seconds: m.duration_seconds,
                })),
                videos: (l.videos ?? []).map((v) => ({
                    id: v.id, type: 'video', title: v.title ?? 'Video Lesson',
                    vimeo_id: v.vimeo_id, duration: v.duration,
                    thumbnail_url: v.thumbnail_url,
                    resolved_thumbnail_url: v.resolved_thumbnail_url ?? v.thumbnail_url ?? null,
                })),
            })),
        }));
    }, [course]);

    const totalBytes = useMemo(() => {
        let sum = 0;
        modules.forEach((mod) => mod.lessons.forEach((les) => les.materials.forEach((m) => { sum += Number(m.size_bytes ?? 0); })));
        return sum;
    }, [modules]);

    const formatBytes = (bytes) => {
        const b = Number(bytes ?? 0);
        if (!b) return '--';
        const units = ['B', 'KB', 'MB', 'GB'];
        let v = b, i = 0;
        while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
        return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
    };

    const formatDuration = (seconds) => {
        if (!seconds) return 'Video';
        const m = Math.floor(seconds / 60), s = seconds % 60;
        return `Video • ${m}:${String(s).padStart(2, '0')}`;
    };

    const getModuleSummary = (module) => {
        const lessonCount = module.lessons.length;
        const fileCount = module.lessons.reduce((acc, l) => acc + l.materials.length, 0);
        const videoCount = module.lessons.reduce((acc, l) => acc + l.videos.length, 0);
        const parts = [];
        if (videoCount > 0) parts.push(`${videoCount} Video${videoCount !== 1 ? 's' : ''}`);
        if (fileCount > 0) parts.push(`${fileCount} Material${fileCount !== 1 ? 's' : ''}`);
        return `${lessonCount} Lesson${lessonCount !== 1 ? 's' : ''}${parts.length ? ' • ' + parts.join(' • ') : ''}`;
    };

    const lessonIsEmpty = (lesson) => lesson.materials.length === 0 && lesson.videos.length === 0;

    // // Material handlers //////////////////////////////////////////////////////

    const openAddMaterial = (lesson) => { setSelectedLesson(lesson); setIsAddOpen(true); reset(); };
    const closeAddMaterial = () => { setIsAddOpen(false); setSelectedLesson(null); reset(); };

    const handleUpload = (e) => {
        e.preventDefault();
        if (!selectedLesson) return;
        post(route('mentor.courses.lesson-materials.store', { course: course.id, lesson: selectedLesson.id }), {
            forceFormData: true,
            data: { ...data, from_edit: true },
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => closeAddMaterial(),
        });
    };

    const requestDeleteMaterial = (material) =>
        setPendingRemoval({ type: 'material', id: material.id, name: material.title ?? material.original_name });

    // // Video handlers (tus -> Vimeo flow, same as MediaContent.jsx) //////////

    const openVideoUpload = (lesson) => {
        setSelectedVideoLesson(lesson);
        setIsVideoOpen(true);
        setUploadProgress(null);
        setVideoUploadError(null);
        resetVideo();
    };

    const closeVideoUpload = () => {
        setIsVideoOpen(false);
        setSelectedVideoLesson(null);
        setUploadProgress(null);
        setVideoUploadError(null);
        resetVideo();
    };

    const handleVideoUpload = useCallback(async (e) => {
        e.preventDefault();
        if (!selectedVideoLesson || !videoData.video) return;

        setVideoUploadError(null);
        setUploadProgress(0);
        setIsVideoUploading(true);

        try {
            // 1. Get duration locally
            const durationInSeconds = await getVideoDuration(videoData.video);

            // 2. Get Vimeo upload ticket
            const { data: ticket } = await axios.post(
                route('mentor.courses.lesson-videos.ticket', course.id),
                { file_size: videoData.video.size, title: selectedVideoLesson.title },
            );
            const { upload_link, vimeo_id } = ticket;

            // 3. TUS upload to Vimeo
            await new Promise((resolve, reject) => {
                const upload = new tus.Upload(videoData.video, {
                    uploadUrl: upload_link,
                    onError:    reject,
                    onProgress: (uploaded, total) =>
                        setUploadProgress(Number(((uploaded / total) * 100).toFixed(1))),
                    onSuccess:  resolve,
                });
                upload.start();
            });

            setUploadProgress(100);

            // 4. Save to Laravel
            const formData = new FormData();
            formData.append('vimeo_id', vimeo_id);
            formData.append('duration', durationInSeconds);

            if (videoData.thumbnailBlob instanceof Blob) {
                formData.append('thumbnail', videoData.thumbnailBlob, 'thumb.jpg');
            }

            router.post(
                route('mentor.courses.lesson-videos.store', {
                    course: course.id,
                    lesson: selectedVideoLesson.id,
                }),
                formData,
                {
                    forceFormData:  true,
                    preserveState:  true,
                    preserveScroll: true,
                    onSuccess: () => {
                        setIsVideoUploading(false);
                        closeVideoUpload();
                    },
                    onError: () => {
                        setIsVideoUploading(false);
                        setVideoUploadError('Failed to save the video record.');
                    },
                },
            );
        } catch (err) {
            setVideoUploadError(
                err?.message ?? 'An unexpected error occurred. Please try again.',
            );
            setIsVideoUploading(false);
        }
    }, [selectedVideoLesson, videoData, course.id, closeVideoUpload]);

    const requestDeleteVideo = (video) =>
        setPendingRemoval({ type: 'video', id: video.id, name: video.title ?? 'Video Lesson' });

    const handleConfirmRemoval = () => {
        if (!pendingRemoval) return;

        if (pendingRemoval.type === 'video') {
            router.delete(route('mentor.lesson-videos.destroy', { lessonVideo: pendingRemoval.id }), {
                data: { from_edit: true },
                preserveScroll: true,
                onFinish: () => setPendingRemoval(null),
            });
        }

        if (pendingRemoval.type === 'material') {
            router.delete(route('mentor.courses.lesson-materials.destroy', { course: course.id, material: pendingRemoval.id }), {
                data: { from_edit: true },
                preserveScroll: true,
                onFinish: () => setPendingRemoval(null),
            });
        }
    };

    // // Menu handlers /////////////////////////////////////////////////////////

    const openMaterialMenu = (event, lesson) => { setMenuAnchorEl(event.currentTarget); setMenuLesson(lesson); };
    const closeMaterialMenu = () => { setMenuAnchorEl(null); setMenuLesson(null); };
    const handleReadingMaterialClick = () => { closeMaterialMenu(); openAddMaterial(menuLesson); };
    const handleVideoLessonClick = () => { closeMaterialMenu(); openVideoUpload(menuLesson); };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="md"
                fullScreen={isMobile}
                PaperProps={{
                    sx: {
                        borderRadius: { xs: 0, sm: 3 },
                        maxHeight: { xs: '100dvh', sm: '90vh' },
                        margin: { xs: 0, sm: 2 },
                        alignSelf: { xs: 'flex-end', sm: 'center' },
                        width: { xs: '100%', sm: undefined },
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        justifyContent: 'space-between',
                        pb: 1,
                        pt: { xs: 2, sm: 2 },
                        px: { xs: 2, sm: 3 },
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            gap: { xs: 1, sm: 2 },
                            flex: 1,
                        }}
                    >
                        <Box>
                            <Typography variant="h6" fontWeight="bold">Edit Media Content</Typography>
                            <Typography variant="caption" color="text.secondary">Upload videos and files to lessons</Typography>
                        </Box>
                        <Box sx={{ ml: { xs: 0, sm: 'auto' }, mr: { xs: 0, sm: 1 }, width: { xs: '100%', sm: 'auto' } }}>
                            <MentorStorageUsage totalBytes={totalBytes} formatBytes={formatBytes} />
                        </Box>
                    </Box>
                    <IconButton onClick={onClose} size="small" sx={{ mt: { xs: 0.5, sm: 0 }, ml: 1, flexShrink: 0 }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <Divider />

                <DialogContent sx={{ p: { xs: 1.5, sm: 3 }, overflowY: 'auto' }}>
                    {modules.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Typography variant="body2" color="text.secondary">
                                No modules yet. Add syllabus first, then upload media.
                            </Typography>
                        </Box>
                    ) : (
                        <Stack spacing={{ xs: 2, sm: 3 }}>
                            {modules.map((module) => (
                                <Paper key={module.id} variant="outlined" sx={{ borderRadius: { xs: 2, sm: 3 }, overflow: 'hidden' }}>
                                    <Box
                                        sx={{
                                            p: { xs: 1.5, sm: 2.5 },
                                            bgcolor: 'grey.50',
                                            borderBottom: 1,
                                            borderColor: 'divider',
                                            display: 'flex',
                                            flexDirection: { xs: 'column', sm: 'row' },
                                            justifyContent: 'space-between',
                                            alignItems: { xs: 'flex-start', sm: 'center' },
                                            gap: { xs: 1, sm: 0 },
                                        }}
                                    >
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.25 }}>
                                                {module.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {getModuleSummary(module)}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={module.status === 'in_progress' ? 'In Progress' : 'Draft'}
                                            size="small"
                                            sx={{
                                                bgcolor: module.status === 'in_progress' ? 'warning.light' : 'grey.300',
                                                color: module.status === 'in_progress' ? 'warning.dark' : 'text.secondary',
                                                fontWeight: 500,
                                                alignSelf: { xs: 'flex-start', sm: 'center' },
                                            }}
                                        />
                                    </Box>

                                    <Box>
                                        {module.lessons.map((lesson, lessonIndex) => (
                                            <Accordion
                                                key={lesson.id}
                                                defaultExpanded={lessonIndex === 0}
                                                sx={{
                                                    boxShadow: 'none',
                                                    borderBottom: lessonIndex < module.lessons.length - 1 ? 1 : 0,
                                                    borderColor: 'divider',
                                                    '&:before': { display: 'none' },
                                                }}
                                            >
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                    sx={{
                                                        px: { xs: 1.5, sm: 3 },
                                                        py: { xs: 1.5, sm: 2 },
                                                        '& .MuiAccordionSummary-content': { my: 0 },
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            width: '100%',
                                                            mr: { xs: 1, sm: 2 },
                                                        }}
                                                    >
                                                        <Box>
                                                            <Typography variant="subtitle2" fontWeight={500}>
                                                                Lesson {lessonIndex + 1}: {lesson.title}
                                                            </Typography>
                                                            {lesson.description && (
                                                                <Typography variant="caption" color="text.secondary">{lesson.description}</Typography>
                                                            )}
                                                        </Box>
                                                        {lessonIsEmpty(lesson) && (
                                                            <Chip label="EMPTY" size="small" sx={{ bgcolor: 'grey.200', color: 'text.secondary' }} />
                                                        )}
                                                    </Box>
                                                </AccordionSummary>
                                                <AccordionDetails sx={{ px: { xs: 1.5, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
                                                    {lesson.videos.length > 0 && (
                                                        <Stack spacing={2} sx={{ mb: lesson.materials.length > 0 ? 2 : 0 }}>
                                                            {lesson.videos.map((video) => (
                                                                <MentorMaterialItem
                                                                    key={`video-${video.id}`}
                                                                    material={video}
                                                                    subtitle={formatDuration(video.duration)}
                                                                    onDelete={() => requestDeleteVideo(video)}
                                                                    formatBytes={formatBytes}
                                                                />
                                                            ))}
                                                        </Stack>
                                                    )}
                                                    {lesson.materials.length > 0 && (
                                                        <Stack spacing={2} sx={{ mb: 2 }}>
                                                            {lesson.materials.map((material) => (
                                                                <MentorMaterialItem
                                                                    key={`material-${material.id}`}
                                                                    material={material}
                                                                    onDelete={() => requestDeleteMaterial(material)}
                                                                    formatBytes={formatBytes}
                                                                />
                                                            ))}
                                                        </Stack>
                                                    )}
                                                    {lessonIsEmpty(lesson) && (
                                                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                                            No materials added yet
                                                        </Typography>
                                                    )}
                                                    <Button
                                                        variant="contained"
                                                        startIcon={<AddIcon />}
                                                        onClick={(e) => openMaterialMenu(e, lesson)}
                                                        onMouseEnter={(e) => openMaterialMenu(e, lesson)}
                                                        fullWidth={isMobile}
                                                        size={isMobile ? 'medium' : 'medium'}
                                                        sx={{
                                                            bgcolor: 'success.main',
                                                            '&:hover': { bgcolor: 'success.dark' },
                                                            textTransform: 'none',
                                                            fontWeight: 500,
                                                            mt: 1,
                                                        }}
                                                    >
                                                        Add Material
                                                    </Button>
                                                </AccordionDetails>
                                            </Accordion>
                                        ))}
                                    </Box>
                                </Paper>
                            ))}
                        </Stack>
                    )}
                </DialogContent>

                <Divider />

                <DialogActions
                    sx={{
                        px: { xs: 2, sm: 3 },
                        py: { xs: 1.5, sm: 2 },
                        gap: 1,
                        flexDirection: { xs: 'column-reverse', sm: 'row' },
                        alignItems: { xs: 'stretch', sm: 'center' },
                        justifyContent: { xs: 'stretch', sm: 'flex-end' },
                    }}
                >
                    <Button
                        onClick={onClose}
                        fullWidth={isMobile}
                        sx={{ textTransform: 'none', color: 'text.secondary' }}
                    >
                        Close
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="contained"
                        startIcon={<SaveIcon />}
                        fullWidth={isMobile}
                        sx={{
                            bgcolor: 'success.main',
                            '&:hover': { bgcolor: 'success.dark' },
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                        }}
                    >
                        Done
                    </Button>
                </DialogActions>
            </Dialog>

            <MentorAddMaterialDialog
                open={isAddOpen}
                onClose={closeAddMaterial}
                selectedLesson={selectedLesson}
                data={data}
                setData={setData}
                onSubmit={handleUpload}
                processing={processing}
            />

            <MentorAddVideoDialog
                open={isVideoOpen}
                onClose={closeVideoUpload}
                selectedLesson={selectedVideoLesson}
                data={videoData}
                setData={setVideoData}
                onSubmit={handleVideoUpload}
                processing={isVideoUploading}
                uploadProgress={uploadProgress}
                uploadError={videoUploadError}
            />

            <MentorAddMaterialMenu
                anchorEl={menuAnchorEl}
                onClose={closeMaterialMenu}
                onReadingMaterialClick={handleReadingMaterialClick}
                onVideoLessonClick={handleVideoLessonClick}
            />

            <ContentRemovalWarningModal
                open={Boolean(pendingRemoval)}
                onClose={() => setPendingRemoval(null)}
                onConfirm={handleConfirmRemoval}
                itemType={pendingRemoval?.type ?? 'material'}
                itemName={pendingRemoval?.name ?? ''}
                loading={false}
            />
        </>
    );
}
