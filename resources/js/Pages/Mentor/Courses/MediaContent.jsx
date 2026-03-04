import MentorLayout from '@/Layouts/MentorLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useMemo, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Fade, Box, Stack } from '@mui/material';
import * as tus from 'tus-js-client';
import MentorCourseMilestone    from '@/Components/Mentor/Courses/MentorCourseMilestone';
import MentorCourseFooterActions from '@/Components/Mentor/Courses/MentorCourseFooterActions';
import MentorAddMaterialDialog  from '@/Components/Mentor/Courses/MediaContents/MentorAddMaterialDialog';
import MentorAddVideoDialog     from '@/Components/Mentor/Courses/MediaContents/MentorAddVideoDialog';
import MentorAddMaterialMenu    from '@/Components/Mentor/Courses/MediaContents/MentorAddMaterialMenu';
import MediaContentPageHeader   from '@/Components/Mentor/Courses/MediaContents/MediaContentPageHeader';
import MediaModulePanel         from '@/Components/Mentor/Courses/MediaContents/MediaModulePanel';

// ── Pure helpers (defined outside component, never recreated) ──────────────

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
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `Video • ${m}:${String(s).padStart(2, '0')}`;
};

const getModuleSummary = (module) => {
    const lessonCount = module.lessons.length;
    const fileCount   = module.lessons.reduce((a, l) => a + l.materials.length, 0);
    const videoCount  = module.lessons.reduce((a, l) => a + l.videos.length,    0);
    const parts = [];
    if (videoCount > 0) parts.push(`${videoCount} Video${videoCount !== 1 ? 's' : ''}`);
    if (fileCount  > 0) parts.push(`${fileCount} Material${fileCount !== 1 ? 's' : ''}`);
    return `${lessonCount} Lesson${lessonCount !== 1 ? 's' : ''}${parts.length ? ' • ' + parts.join(' • ') : ''}`;
};

const mapCourse = (course) =>
    (course?.syllabuses ?? []).map((s) => ({
        id:      s.id,
        title:   s.title,
        status:  s.draft_status || 'draft',
        lessons: (s.lessons ?? []).map((l) => ({
            id:          l.id,
            title:       l.title,
            description: l.description || '',
            materials:   (l.materials ?? []).map((m) => ({
                id: m.id, type: m.type, title: m.title,
                url: m.url, size_bytes: m.size_bytes,
                mime_type: m.mime_type, original_name: m.original_name,
                duration_seconds: m.duration_seconds,
            })),
            videos: (l.videos ?? []).map((v) => ({
                id: v.id, type: 'video',
                title: v.title ?? 'Video Lesson',
                vimeo_id: v.vimeo_id, duration: v.duration, thumbnail_url: v.thumbnail_url,
            })),
        })),
    }));


    const getVideoDuration = (file) => {
        return new Promise((resolve) => {
            const videoElement = document.createElement('video');
            videoElement.preload = 'metadata';
            videoElement.onloadedmetadata = () => {
                window.URL.revokeObjectURL(videoElement.src);
                resolve(Math.round(videoElement.duration));
            };
            videoElement.src = URL.createObjectURL(file);
        });
    };

// ── Page ──────────────────────────────────────────────────────────────────

export default function MediaContent({ course }) {
    const [mounted,            setMounted]            = useState(false);
    const [isAddOpen,          setIsAddOpen]          = useState(false);
    const [selectedLesson,     setSelectedLesson]     = useState(null);
    const [isVideoOpen,        setIsVideoOpen]        = useState(false);
    const [selectedVideoLesson, setSelectedVideoLesson] = useState(null);
    const [uploadProgress,     setUploadProgress]     = useState(null);
    const [videoUploadError,   setVideoUploadError]   = useState(null);
    const [isVideoUploading,   setIsVideoUploading]   = useState(false);
    const [menuAnchorEl,       setMenuAnchorEl]       = useState(null);
    const [menuLesson,         setMenuLesson]         = useState(null);

    const { data, setData, post, processing, reset } = useForm({ title: '', file: null, duration_seconds: '' });
    const { data: videoData, setData: setVideoData, reset: resetVideo } = useForm({ video: null });

    useEffect(() => { setMounted(true); }, []);

    const modules    = useMemo(() => mapCourse(course), [course]);
    const totalBytes = useMemo(() => modules.flatMap((m) => m.lessons.flatMap((l) => l.materials))
        .reduce((sum, m) => sum + Number(m.size_bytes ?? 0), 0), [modules]);

    // ── Material handlers ────────────────────────────────────────────────

    const openAddMaterial  = useCallback((lesson) => { setSelectedLesson(lesson); setIsAddOpen(true); reset(); }, [reset]);
    const closeAddMaterial = useCallback(() => { setIsAddOpen(false); setSelectedLesson(null); reset(); }, [reset]);

    const handleUpload = useCallback((e) => {
        e.preventDefault();
        if (!selectedLesson) return;
        post(route('mentor.courses.lesson-materials.store', { course: course.id, lesson: selectedLesson.id }), {
            forceFormData: true,
            onSuccess: closeAddMaterial,
        });
    }, [selectedLesson, course.id, post, closeAddMaterial]);

    const handleDeleteMaterial = useCallback((materialId) =>
        router.delete(route('mentor.courses.lesson-materials.destroy', { course: course.id, material: materialId }), { preserveScroll: true }),
    [course.id]);

    // ── Video handlers ───────────────────────────────────────────────────

    const openVideoUpload  = useCallback((lesson) => { setSelectedVideoLesson(lesson); setIsVideoOpen(true); resetVideo(); }, [resetVideo]);
    const closeVideoUpload = useCallback(() => {
        setIsVideoOpen(false); setSelectedVideoLesson(null);
        setUploadProgress(null); setVideoUploadError(null); resetVideo();
    }, [resetVideo]);

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

            // 4. Save to Laravel — send thumbnail blob as multipart form data
            const formData = new FormData();
            formData.append('vimeo_id', vimeo_id);
            formData.append('duration', durationInSeconds);

            // videoData.thumbnailBlob is set by MentorAddVideoDialog when file is chosen
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

    const handleDeleteVideo = useCallback((videoId) =>
        router.delete(route('lesson-videos.destroy', { lessonVideo: videoId }), { preserveScroll: true }),
    []);

    // ── Menu handlers ────────────────────────────────────────────────────

    const openMaterialMenu  = useCallback((event, lesson) => { setMenuAnchorEl(event.currentTarget); setMenuLesson(lesson); }, []);
    const closeMaterialMenu = useCallback(() => { setMenuAnchorEl(null); setMenuLesson(null); }, []);

    const handleReadingMaterialClick = useCallback(() => { if (!menuLesson) return; closeMaterialMenu(); openAddMaterial(menuLesson); }, [menuLesson, closeMaterialMenu, openAddMaterial]);
    const handleVideoLessonClick     = useCallback(() => { if (!menuLesson) return; closeMaterialMenu(); openVideoUpload(menuLesson); }, [menuLesson, closeMaterialMenu, openVideoUpload]);

    // ── Page submit ──────────────────────────────────────────────────────

    const handleDiscard = useCallback(() => {
        if (confirm('Discard all changes? All progress will be lost.'))
            window.location.href = route('mentor.courses.index');
    }, []);

    const handleSubmit = useCallback((e, isDraft = false) => {
        e.preventDefault();
        router.post(
            route('mentor.courses.media-content.save', course.id),
            { is_draft: isDraft, next_step: !isDraft, redirect_to: isDraft ? 'index' : undefined },
            { preserveScroll: true, onSuccess: () => { if (isDraft) window.location.href = route('mentor.courses.index'); } },
        );
    }, [course.id]);

    // ── Render ───────────────────────────────────────────────────────────

    return (
        <>
            <Head title="Upload Media Content" />

            <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', pb: 44 }}>
                <Box>
                    <Fade in={mounted} style={{ transitionDelay: '80ms' }}>
                        <Box sx={{ mx: 'auto', px: { xs: 2, sm: 3, lg: 4 } }}>
                            <MentorCourseMilestone currentStep={2} />
                        </Box>
                    </Fade>

                    <Box sx={{ mx: 'auto', maxWidth: 1200, py: 4, px: { xs: 2, sm: 3, lg: 4 } }}>
                        <MediaContentPageHeader
                            mounted={mounted}
                            totalBytes={totalBytes}
                            formatBytes={formatBytes}
                        />

                        <Box component="form" onSubmit={(e) => handleSubmit(e, false)}>
                            <Stack spacing={3}>
                                {modules.map((module, index) => (
                                    <MediaModulePanel
                                        key={module.id}
                                        module={module}
                                        index={index}
                                        courseId={course.id}
                                        getModuleSummary={getModuleSummary}
                                        formatBytes={formatBytes}
                                        formatDuration={formatDuration}
                                        onOpenMenu={openMaterialMenu}
                                        onDeleteMaterial={handleDeleteMaterial}
                                        onDeleteVideo={handleDeleteVideo}
                                    />
                                ))}
                            </Stack>

                            <MentorCourseFooterActions
                                onDiscard={handleDiscard}
                                onSaveAsDraft={(e) => handleSubmit(e, true)}
                                onBack={() => router.visit(route('mentor.courses.syllabus', course.id))}
                                onNext={handleSubmit}
                                nextLabel="Next Step"
                                processing={processing}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>

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
        </>
    );
}

MediaContent.layout = (page) => (
    <MentorLayout auth={page.props.auth} activeTab="Courses">
        {page}
    </MentorLayout>
);
