import React, { useState, memo } from 'react';
import { Box, Typography, Stack, Tooltip, Fade } from '@mui/material';
import LockIcon                     from '@mui/icons-material/Lock';
import ExpandMoreIcon               from '@mui/icons-material/ExpandMore';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import VideoLibraryRoundedIcon      from '@mui/icons-material/VideoLibraryRounded';
import ArticleRoundedIcon           from '@mui/icons-material/ArticleRounded';
import InsertDriveFileRoundedIcon   from '@mui/icons-material/InsertDriveFileRounded';

// Reuse the mentor video player directly — no enrollee-specific changes needed
import MentorLessonVideoPlayer   from '@/Components/Mentor/Courses/Show/MentorLessonVideoPlayer';
// View-only fork of the mentor PDF viewer (no download button, blocks Ctrl+S/P)
import EnrolleeMaterialPdfViewer from '@/Components/Enrollee/Courses/Show/EnrolleeMaterialPdfViewer';

import { EASE, formatDuration } from './utils';

const LessonRow = memo(({ lesson, moduleIdx, lessonIdx, hasAccess }) => {
    const [open,      setOpen]      = useState(false);
    const [pdfViewer, setPdfViewer] = useState({ open: false, url: null, title: '' });

    const materials  = lesson.materials || [];
    const videos     = lesson.videos    || [];
    const hasContent = (materials.length + videos.length) > 0;
    const totalSec   = materials.reduce((s, m) => s + (m.duration_seconds || 0), 0)
                     + videos.reduce((s, v)    => s + (v.duration         || 0), 0);

    const openPdf  = (m) => setPdfViewer({ open: true,  url: m.url, title: m.title || m.original_name || 'Document' });
    const closePdf = ()  => setPdfViewer({ open: false, url: null,  title: '' });

    return (
        <>
            <Box sx={{ borderBottom: '1px solid', borderColor: 'grey.100', '&:last-child': { borderBottom: 0 } }}>

                {/* ── Row header ────────────────────────────────────────── */}
                <Box
                    onClick={() => hasContent && setOpen((p) => !p)}
                    sx={{
                        display: 'flex', alignItems: 'center',
                        py: { xs: 1, sm: 1.25 }, px: { xs: 0.5, sm: 1 },
                        borderRadius: 1.5, gap: 0.75,
                        cursor: hasContent ? 'pointer' : 'default',
                        transition: `background 150ms ${EASE}`,
                        '&:hover': hasContent ? { bgcolor: 'rgba(76,175,80,0.04)' } : {},
                    }}
                >
                    <Typography variant="caption" color="text.disabled"
                        sx={{ minWidth: 36, fontFamily: 'monospace', flexShrink: 0, fontSize: '0.68rem' }}>
                        {moduleIdx + 1}.{lessonIdx + 1}
                    </Typography>

                    {hasAccess
                        ? <PlayCircleOutlineRoundedIcon sx={{ fontSize: 16, color: 'success.main', flexShrink: 0 }} />
                        : <LockIcon                    sx={{ fontSize: 14, color: 'grey.400',      flexShrink: 0 }} />
                    }

                    <Typography variant="body2" fontWeight={600} flex={1}
                        sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: { xs: '0.78rem', sm: '0.875rem' } }}>
                        {lesson.title}
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center" flexShrink={0}>
                        {videos.length > 0 && (
                            <Tooltip title={`${videos.length} video${videos.length !== 1 ? 's' : ''}`} arrow>
                                <Stack direction="row" spacing={0.25} alignItems="center">
                                    <VideoLibraryRoundedIcon sx={{ fontSize: 13, color: 'text.disabled' }} />
                                    <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.68rem' }}>{videos.length}</Typography>
                                </Stack>
                            </Tooltip>
                        )}
                        {materials.length > 0 && (
                            <Tooltip title={`${materials.length} file${materials.length !== 1 ? 's' : ''}`} arrow>
                                <Stack direction="row" spacing={0.25} alignItems="center">
                                    <ArticleRoundedIcon sx={{ fontSize: 13, color: 'text.disabled' }} />
                                    <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.68rem' }}>{materials.length}</Typography>
                                </Stack>
                            </Tooltip>
                        )}
                        {totalSec > 0 && (
                            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.68rem' }}>
                                {formatDuration(totalSec)}
                            </Typography>
                        )}
                        {hasContent && (
                            <ExpandMoreIcon sx={{
                                fontSize: 16, color: 'text.disabled',
                                transform: open ? 'rotate(180deg)' : 'none',
                                transition: `transform 250ms ${EASE}`,
                            }} />
                        )}
                    </Stack>
                </Box>

                {/* ── Expanded content ──────────────────────────────────── */}
                {open && hasContent && (
                    <Fade in={open}>
                        <Box sx={{ pb: 1.5 }}>
                            {/* Videos — inline Vimeo player (reuses mentor component) */}
                            {videos.length > 0 && hasAccess && (
                                <Box sx={{ mb: materials.length > 0 ? 1.5 : 0 }}>
                                    <MentorLessonVideoPlayer videos={videos} />
                                </Box>
                            )}

                            {/* Videos — locked placeholder */}
                            {videos.length > 0 && !hasAccess && (
                                <Stack spacing={0.5} sx={{ pl: { xs: 4, sm: 5 }, mb: materials.length > 0 ? 1 : 0 }}>
                                    {videos.map((v) => (
                                        <Stack key={`v-${v.id}`} direction="row" alignItems="center" spacing={1} sx={{ py: 0.6 }}>
                                            <LockIcon sx={{ fontSize: 14, color: 'grey.400', flexShrink: 0 }} />
                                            <Typography variant="body2" color="text.disabled" sx={{ fontSize: '0.8rem' }}>
                                                {v.title || 'Video'}{v.duration ? ` · ${formatDuration(v.duration)}` : ''}
                                            </Typography>
                                        </Stack>
                                    ))}
                                </Stack>
                            )}

                            {/* Materials — click to open in PDF viewer (view-only, no download) */}
                            <Stack spacing={0.5} sx={{ pl: { xs: 4, sm: 5 } }}>
                                {materials.map((m) => (
                                    <Stack
                                        key={`m-${m.id}`}
                                        direction="row" alignItems="center" spacing={1}
                                        onClick={() => hasAccess && m.url && openPdf(m)}
                                        sx={{
                                            py: 0.75, px: 1, borderRadius: 1.5,
                                            cursor: hasAccess && m.url ? 'pointer' : 'default',
                                            transition: `background 150ms ${EASE}`,
                                            '&:hover': hasAccess && m.url ? { bgcolor: 'rgba(76,175,80,0.06)' } : {},
                                        }}
                                    >
                                        {hasAccess
                                            ? <InsertDriveFileRoundedIcon sx={{ fontSize: 15, color: 'success.main', flexShrink: 0 }} />
                                            : <LockIcon                  sx={{ fontSize: 14, color: 'grey.400',     flexShrink: 0 }} />
                                        }
                                        <Typography
                                            variant="body2" fontWeight={500} noWrap
                                            sx={{
                                                flex: 1, fontSize: '0.8rem',
                                                color: hasAccess && m.url ? 'success.dark' : 'text.disabled',
                                            }}
                                        >
                                            {m.title || m.original_name || 'Document'}
                                        </Typography>
                                        {m.duration_seconds > 0 && (
                                            <Typography variant="caption" color="text.disabled" flexShrink={0} sx={{ fontSize: '0.68rem' }}>
                                                {formatDuration(m.duration_seconds)}
                                            </Typography>
                                        )}
                                    </Stack>
                                ))}
                            </Stack>
                        </Box>
                    </Fade>
                )}
            </Box>

            {/* View-only PDF viewer dialog */}
            <EnrolleeMaterialPdfViewer
                open={pdfViewer.open}
                onClose={closePdf}
                url={pdfViewer.url}
                title={pdfViewer.title}
            />
        </>
    );
});

export default LessonRow;