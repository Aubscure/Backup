import { useState, useEffect, useRef } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import EnrolleeSidebar from '@/Components/Enrollee/EnrolleeSidebar';
import {
    Box,
    Typography,
    Paper,
    Stack,
    Button,
    Chip,
    IconButton,
    useMediaQuery,
    useTheme,
    Snackbar,
    Alert,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LockIcon from '@mui/icons-material/Lock';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import MuiLink from '@mui/material/Link';

const SIDEBAR_WIDTH = 240;

function formatDuration(seconds) {
    if (!seconds) return '—';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
}

export default function EnrolleeCourseLesson({
    course,
    lesson,
    syllabus,
    lessonNumber,
    totalLessons,
    allLessonsForNav,
    currentIndex,
    completedVideoIds,
    canProceed,
}) {
    const { props } = usePage();
    const flash = props.flash || {};
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [snack, setSnack] = useState(flash.success || flash.error || null);
    const [submittedVideoIds, setSubmittedVideoIds] = useState(() => [...(completedVideoIds || [])]);
    const [vimeoReady, setVimeoReady] = useState(!!window.Vimeo);

    useEffect(() => {
        if (flash.success || flash.error) setSnack(flash.success || flash.error);
    }, [flash.success, flash.error]);

    const markVideoComplete = (lessonVideoId) => {
        if (submittedVideoIds.includes(lessonVideoId)) return;
        setSubmittedVideoIds((prev) => [...prev, lessonVideoId]);
        router.post(
            route('enrollee.courses.lessons.complete-video', [course.id, lesson.id]),
            { lesson_video_id: lessonVideoId },
            { preserveScroll: true }
        );
    };

    useEffect(() => {
        if (window.Vimeo) {
            setVimeoReady(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://player.vimeo.com/api/player.js';
        script.async = true;
        script.onload = () => setVimeoReady(true);
        document.body.appendChild(script);
        return () => {
            if (script.parentNode) document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        const videos = lesson?.videos || [];
        if (!vimeoReady || !videos.length || typeof window.Vimeo === 'undefined') return;

        const players = [];
        videos.forEach((video) => {
            const el = document.getElementById(`vimeo-${video.id}`);
            if (!el || !video.vimeo_id) return;
            try {
                const player = new window.Vimeo.Player(el);
                player.on('ended', () => markVideoComplete(video.id));
                players.push(player);
            } catch (e) {
                console.warn('Vimeo player init failed for video', video.id, e);
            }
        });
        return () => {
            players.forEach((p) => p.destroy?.());
        };
    }, [vimeoReady, lesson?.id, lesson?.videos?.length]);

    const nextLesson = currentIndex < totalLessons - 1 ? allLessonsForNav?.[currentIndex + 1] : null;
    const prevLesson = currentIndex > 0 ? allLessonsForNav?.[currentIndex - 1] : null;
    const nextUnlocked = nextLesson?.unlocked ?? false;
    const videos = lesson?.videos || [];
    const materials = lesson?.materials || [];

    return (
        <>
            <Head title={`${lesson?.title || 'Lesson'} — ${course?.title}`} />
            <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
                <EnrolleeSidebar activePage="courses" mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
                <Box sx={{ ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` }, transition: theme.transitions.create('margin') }}>
                    {/* Top bar */}
                    <Paper square elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'white', position: 'sticky', top: 0, zIndex: 1100 }}>
                        <Box sx={{ display: 'flex', height: 64, alignItems: 'center', justifyContent: 'space-between', px: { xs: 2, sm: 3, lg: 4 } }}>
                            <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2, display: { md: 'none' } }}>
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="body2" fontWeight={600} sx={{ color: 'text.secondary' }}>
                                ManPro Learning Hub
                            </Typography>
                            <Box sx={{ position: 'relative', cursor: 'pointer' }}>
                                <NotificationsNoneIcon sx={{ color: 'grey.500' }} />
                            </Box>
                        </Box>
                    </Paper>

                    <Box sx={{ p: { xs: 2, sm: 3, lg: 4 }, maxWidth: 1000, mx: 'auto' }}>
                        {/* Breadcrumb / progress */}
                        <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                            {(allLessonsForNav || []).slice(0, 8).map((item, i) => (
                                <Box key={item.id} sx={{ display: 'flex', alignItems: 'center' }}>
                                    {i > 0 && <Typography variant="caption" color="text.secondary" sx={{ mx: 0.25 }}>•</Typography>}
                                    {item.unlocked === true ? (
                                        <Link
                                            href={route('enrollee.courses.lessons.show', [course.id, item.id])}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <Chip
                                                size="small"
                                                label={`${item.index}. ${item.title?.slice(0, 20)}${(item.title?.length || 0) > 20 ? '…' : ''}`}
                                                sx={{
                                                    bgcolor: item.id === lesson?.id ? 'success.main' : 'grey.100',
                                                    color: item.id === lesson?.id ? 'white' : 'text.secondary',
                                                    fontWeight: item.id === lesson?.id ? 700 : 500,
                                                    fontSize: '0.7rem',
                                                }}
                                            />
                                        </Link>
                                    ) : (
                                        <Box
                                            component="span"
                                            sx={{ display: 'inline-flex', cursor: 'not-allowed', pointerEvents: 'none' }}
                                            aria-hidden
                                        >
                                            <Chip
                                                size="small"
                                                icon={<LockIcon sx={{ fontSize: 14 }} />}
                                                label={`${item.index}`}
                                                sx={{
                                                    bgcolor: 'grey.100',
                                                    color: 'text.disabled',
                                                    fontSize: '0.7rem',
                                                    pointerEvents: 'none',
                                                }}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            ))}
                            {totalLessons > 8 && (
                                <Typography variant="caption" color="text.secondary">+{totalLessons - 8} more</Typography>
                            )}
                        </Stack>

                        <Typography variant="overline" sx={{ color: 'success.main', fontWeight: 700 }}>
                            {syllabus?.title || 'Module'}
                        </Typography>
                        <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>
                            LESSON {lessonNumber} OF {totalLessons}
                        </Typography>
                        <Typography variant="h6" fontWeight={600} color="text.secondary" sx={{ mb: 2 }}>
                            {lesson?.title}
                        </Typography>

                        {/* Video(s) */}
                        {videos.map((video, idx) => (
                            <Box key={video.id} sx={{ mb: 3 }}>
                                <Chip
                                    size="small"
                                    label={video.title || `Part ${idx + 1}`}
                                    sx={{ mb: 1, bgcolor: 'success.50', color: 'success.dark', fontWeight: 600 }}
                                />
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        boxShadow: 2,
                                        bgcolor: '#000',
                                        '&::before': { content: '""', display: 'block', paddingTop: '56.25%' },
                                        '& iframe': {
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            border: 0,
                                        },
                                    }}
                                >
                                    <iframe
                                        id={`vimeo-${video.id}`}
                                        src={`https://player.vimeo.com/video/${video.vimeo_id}?title=0&byline=0&portrait=0`}
                                        title={video.title || `Video ${idx + 1}`}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                        allowFullScreen
                                    />
                                </Box>
                                {completedVideoIds?.includes(video.id) && (
                                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
                                        <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />
                                        <Typography variant="caption" color="success.dark">Completed</Typography>
                                    </Stack>
                                )}
                            </Box>
                        ))}

                        {videos.length === 0 && (
                            <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', color: 'text.secondary', mb: 3 }}>
                                No video for this lesson.
                            </Paper>
                        )}

                        {/* Rule: finish video before next */}
                        {!canProceed && videos.length > 0 && (
                            <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'warning.50', borderColor: 'warning.main' }}>
                                <Typography variant="body2" fontWeight={600} color="warning.dark">
                                    Finish watching the video above to unlock the next lesson.
                                </Typography>
                            </Paper>
                        )}

                        {/* Description */}
                        {lesson?.description && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>About this lesson</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                                    {lesson.description}
                                </Typography>
                            </Box>
                        )}

                        {/* Materials */}
                        {materials.length > 0 && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Resources</Typography>
                                <Stack spacing={0.5}>
                                    {materials.map((m) => (
                                        <Stack key={m.id} direction="row" alignItems="center" spacing={1}>
                                            <InsertDriveFileIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                            {m.url ? (
                                                <MuiLink href={m.url} target="_blank" rel="noopener noreferrer" variant="body2" fontWeight={500}>
                                                    {m.title || m.original_name || 'File'}
                                                </MuiLink>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">{m.title || m.original_name || 'File'}</Typography>
                                            )}
                                            {m.duration_seconds ? (
                                                <Typography variant="caption" color="text.secondary">({formatDuration(m.duration_seconds)})</Typography>
                                            ) : null}
                                        </Stack>
                                    ))}
                                </Stack>
                            </Box>
                        )}

                        {/* Prev / Next */}
                        <Stack direction="row" justifyContent="space-between" sx={{ mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                            <Box>
                                {prevLesson?.unlocked ? (
                                    <Button
                                        component={Link}
                                        href={route('enrollee.courses.lessons.show', [course.id, prevLesson.id])}
                                        startIcon={<ArrowBackIcon />}
                                        sx={{ textTransform: 'none', fontWeight: 600 }}
                                    >
                                        Previous lesson
                                    </Button>
                                ) : (
                                    <Button disabled startIcon={<ArrowBackIcon />} sx={{ textTransform: 'none' }}>
                                        Previous lesson
                                    </Button>
                                )}
                            </Box>
                            <Box>
                                {nextLesson ? (
                                    nextUnlocked ? (
                                        <Button
                                            component={Link}
                                            href={route('enrollee.courses.lessons.show', [course.id, nextLesson.id])}
                                            variant="contained"
                                            endIcon={<ArrowForwardIcon />}
                                            sx={{ bgcolor: 'primary.main', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: 'primary.dark' } }}
                                        >
                                            Next lesson
                                        </Button>
                                    ) : (
                                        <Button
                                            disabled
                                            variant="contained"
                                            endIcon={<LockIcon />}
                                            sx={{ textTransform: 'none', fontWeight: 600 }}
                                        >
                                            Finish video to continue
                                        </Button>
                                    )
                                ) : (
                                    <Button
                                        component={Link}
                                        href={route('enrollee.courses.show', course.id)}
                                        variant="contained"
                                        endIcon={<CheckCircleIcon />}
                                        sx={{ bgcolor: 'success.main', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: 'success.dark' } }}
                                    >
                                        Back to course
                                    </Button>
                                )}
                            </Box>
                        </Stack>
                    </Box>
                </Box>
            </Box>

            <Snackbar open={!!snack} autoHideDuration={5000} onClose={() => setSnack(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={() => setSnack(null)} severity={flash.error ? 'error' : 'success'} sx={{ width: '100%' }}>{snack}</Alert>
            </Snackbar>
        </>
    );
}
