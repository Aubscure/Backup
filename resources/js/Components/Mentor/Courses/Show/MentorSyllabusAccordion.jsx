/**
 * RESPONSIVE: xs/sm breakpoints added — md/lg/xl behaviour is unchanged.
 * All `px: 4` → `px: { xs: 2, sm: 3, md: 4 }`, similar for py and gap.
 */

import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import MentorLessonVideoPlayer from '@/Components/Mentor/Courses/Show/MentorLessonVideoPlayer';
import MentorMaterialPdfViewer from '@/Components/Mentor/Courses/Show/MentorMaterialPdfViewer';
import {
    Box, Typography, Button, Accordion, AccordionSummary, AccordionDetails,
    Stack, Paper, Avatar, Fade, Grow, Chip, Divider, Tooltip,
} from '@mui/material';

// Icons
import ExpandMoreIcon                  from '@mui/icons-material/ExpandMore';
import VideocamRoundedIcon             from '@mui/icons-material/VideocamRounded';
import DescriptionRoundedIcon          from '@mui/icons-material/DescriptionRounded';
import PictureAsPdfIcon                from '@mui/icons-material/PictureAsPdf';
import PlayCircleOutlineRoundedIcon    from '@mui/icons-material/PlayCircleOutlineRounded';
import MenuBookRoundedIcon             from '@mui/icons-material/MenuBookRounded';
import OpenInNewRoundedIcon            from '@mui/icons-material/OpenInNewRounded';
import ArticleRoundedIcon              from '@mui/icons-material/ArticleRounded';
import QuizRoundedIcon                 from '@mui/icons-material/QuizRounded';
import AccessTimeRoundedIcon           from '@mui/icons-material/AccessTimeRounded';
import CheckCircleOutlineRoundedIcon   from '@mui/icons-material/CheckCircleOutlineRounded';
import ShuffleRoundedIcon              from '@mui/icons-material/ShuffleRounded';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function stripHTML(html) {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
}

function formatDuration(seconds) {
    if (!seconds) return 'N/A';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (!h) return `${m}m`;
    if (!m) return `${h}h`;
    return `${h}h ${m}m`;
}

function formatTimeLimit(hrs = 0, mins = 0, secs = 0) {
    const parts = [];
    if (hrs)  parts.push(`${hrs}h`);
    if (mins) parts.push(`${mins}m`);
    if (secs) parts.push(`${secs}s`);
    return parts.length ? parts.join(' ') : null;
}

function isPdfType(material) {
    if (material.type === 'pdf') return true;
    if (material.type === 'file') return true;
    if (material.mime_type && material.mime_type.includes('pdf')) return true;
    if (material.url && material.url.toLowerCase().endsWith('.pdf')) return true;
    return false;
}

// ─── Material config ──────────────────────────────────────────────────────────

function getMaterialConfig(type) {
    const map = {
        video:      { icon: <VideocamRoundedIcon sx={{ fontSize: 16 }} />,      label: 'Video',      bg: '#e8f5e9', color: '#2e7d32' },
        file:       { icon: <DescriptionRoundedIcon sx={{ fontSize: 16 }} />,   label: 'Document',   bg: '#e3f2fd', color: '#1565c0' },
        transcript: { icon: <ArticleRoundedIcon sx={{ fontSize: 16 }} />,        label: 'Transcript', bg: '#f3e5f5', color: '#6a1b9a' },
        pdf:        { icon: <PictureAsPdfIcon sx={{ fontSize: 16 }} />,          label: 'PDF',        bg: '#fff3e0', color: '#e65100' },
    };
    return map[type] || map.file;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ExpandableDescription({ text }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const cleanText = stripHTML(text);
    if (!cleanText) return null;
    return (
        <Box sx={{ mt: 0.5 }}>
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                    lineHeight: 1.6,
                    display: '-webkit-box',
                    WebkitLineClamp: isExpanded ? 'unset' : 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease-in-out',
                    // xs: slightly smaller caption
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                }}
            >
                {cleanText}
            </Typography>
            {cleanText.length > 90 && (
                <Typography
                    variant="caption"
                    onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                    sx={{
                        color: 'success.main',
                        cursor: 'pointer',
                        fontWeight: 600,
                        mt: 0.25,
                        display: 'inline-block',
                        transition: 'transform 0.2s',
                        fontSize: { xs: '0.68rem', sm: '0.75rem' },
                        // xs: make tap target a touch more comfortable
                        py: { xs: 0.5, sm: 0 },
                        '&:hover': { textDecoration: 'underline', transform: 'translateX(3px)' },
                    }}
                >
                    {isExpanded ? 'Show less' : 'Read more'}
                </Typography>
            )}
        </Box>
    );
}

function MaterialRow({ material }) {
    const cfg = getMaterialConfig(material.type);
    const openAsPdf = isPdfType(material);
    const [pdfOpen, setPdfOpen] = useState(false);

    const handleClick = (e) => {
        e.preventDefault();
        if (!material.url) return;
        if (openAsPdf) setPdfOpen(true);
        else window.open(material.url, '_blank', 'noopener,noreferrer');
    };

    return (
        <>
            <Box
                component="div"
                onClick={handleClick}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 1, sm: 1.5 },
                    // xs: tighter inner padding
                    px: { xs: 1.25, sm: 1.5, md: 2 },
                    py: { xs: 1,    sm: 1.2 },
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'grey.200',
                    bgcolor: cfg.bg + '66',
                    textDecoration: 'none',
                    cursor: material.url ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                    '&:hover': material.url ? {
                        borderColor: cfg.color,
                        bgcolor: cfg.bg,
                        transform: 'translateX(3px)',
                        boxShadow: `0 2px 10px ${cfg.color}22`,
                    } : {},
                }}
            >
                <Box sx={{
                    // xs: slightly smaller icon box
                    width:  { xs: 28, sm: 32, md: 34 },
                    height: { xs: 28, sm: 32, md: 34 },
                    borderRadius: 1.5,
                    bgcolor: cfg.bg,
                    border: `1px solid ${cfg.color}33`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: cfg.color,
                    flexShrink: 0,
                }}>
                    {cfg.icon}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                        variant="body2"
                        fontWeight={600}
                        noWrap
                        sx={{
                            color: 'text.primary',
                            fontSize: { xs: '0.78rem', sm: '0.875rem' },
                        }}
                    >
                        {material.title || material.name || cfg.label}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.2 }}>
                        <Typography variant="caption" sx={{
                            color: cfg.color,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: 0.4,
                            fontSize: { xs: '0.62rem', sm: '0.65rem', md: '10px' },
                        }}>
                            {openAsPdf ? 'Read Only' : cfg.label}
                        </Typography>
                        {material.duration_seconds > 0 && (
                            <>
                                <Typography variant="caption" color="text.disabled">·</Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.68rem', sm: '0.75rem' } }}>
                                    {formatDuration(material.duration_seconds)}
                                </Typography>
                            </>
                        )}
                    </Box>
                </Box>
                {material.url && (
                    <Box sx={{ color: cfg.color, opacity: 0.7, flexShrink: 0 }}>
                        <OpenInNewRoundedIcon sx={{ fontSize: { xs: 15, sm: 18 } }} />
                    </Box>
                )}
            </Box>

            {openAsPdf && (
                <MentorMaterialPdfViewer
                    open={pdfOpen}
                    onClose={() => setPdfOpen(false)}
                    url={material.url}
                    title={material.title || material.name || 'Document'}
                />
            )}
        </>
    );
}

// ─── AssessmentRow ────────────────────────────────────────────────────────────

function AssessmentRow({ assessment }) {
    const questionCount = assessment.questions?.length ?? 0;
    const timeLimit = assessment.has_time_limit
        ? formatTimeLimit(assessment.time_limit_hrs, assessment.time_limit_mins, assessment.time_limit_secs)
        : null;

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: { xs: 1, sm: 1.5 },
            // xs: tighter padding
            px: { xs: 1.25, sm: 1.5, md: 2 },
            py: { xs: 1,    sm: 1.4 },
            borderRadius: 2,
            border: '1px solid #e8eaf6',
            bgcolor: '#f3f4fd',
            transition: 'all 0.2s',
            '&:hover': {
                borderColor: '#5c6bc0',
                bgcolor: '#eaecfb',
                transform: 'translateX(3px)',
                boxShadow: '0 2px 10px #5c6bc022',
            },
        }}>
            {/* Icon */}
            <Box sx={{
                width:  { xs: 28, sm: 32, md: 34 },
                height: { xs: 28, sm: 32, md: 34 },
                borderRadius: 1.5,
                flexShrink: 0,
                bgcolor: '#e8eaf6',
                border: '1px solid #9fa8da55',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3949ab',
            }}>
                <QuizRoundedIcon sx={{ fontSize: { xs: 14, sm: 17 } }} />
            </Box>

            {/* Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography
                        variant="body2"
                        fontWeight={600}
                        noWrap
                        sx={{
                            color: 'text.primary',
                            fontSize: { xs: '0.78rem', sm: '0.875rem' },
                        }}
                    >
                        {assessment.title}
                    </Typography>
                    {assessment.is_draft && (
                        <Chip label="Draft" size="small" sx={{
                            height: 18, fontSize: 10, fontWeight: 700,
                            bgcolor: '#fff8e1', color: '#f57f17',
                            border: '1px solid #ffe082',
                        }} />
                    )}
                </Box>

                {/* Meta chips */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                        <Typography variant="caption" sx={{
                            color: '#3949ab', fontWeight: 700,
                            fontSize: { xs: '0.62rem', sm: '0.65rem', md: '10px' },
                            textTransform: 'uppercase', letterSpacing: 0.4,
                        }}>
                            {questionCount} {questionCount === 1 ? 'Question' : 'Questions'}
                        </Typography>
                    </Box>

                    {assessment.passing_grade != null && (
                        <>
                            <Typography variant="caption" color="text.disabled">·</Typography>
                            <Tooltip title="Passing grade" arrow>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                    <CheckCircleOutlineRoundedIcon sx={{ fontSize: 11, color: '#43a047' }} />
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: { xs: '0.68rem', sm: '0.75rem' } }}>
                                        {assessment.passing_grade}%
                                    </Typography>
                                </Box>
                            </Tooltip>
                        </>
                    )}

                    {timeLimit && (
                        <>
                            <Typography variant="caption" color="text.disabled">·</Typography>
                            <Tooltip title="Time limit" arrow>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                    <AccessTimeRoundedIcon sx={{ fontSize: 11, color: '#ef6c00' }} />
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: { xs: '0.68rem', sm: '0.75rem' } }}>
                                        {timeLimit}
                                    </Typography>
                                </Box>
                            </Tooltip>
                        </>
                    )}

                    {assessment.is_randomized && (
                        <>
                            <Typography variant="caption" color="text.disabled">·</Typography>
                            <Tooltip title="Questions are randomized" arrow>
                                <ShuffleRoundedIcon sx={{ fontSize: 13, color: '#7b1fa2' }} />
                            </Tooltip>
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

// ─── AssessmentsBlock ─────────────────────────────────────────────────────────

function AssessmentsBlock({ assessments, label = 'Assessments', px = 4, pb = 2.5 }) {
    if (!assessments || assessments.length === 0) return null;
    return (
        // Override the fixed px/pb with responsive equivalents on xs/sm
        <Box sx={{
            // The parent passes numeric px/pb; we override for xs/sm via responsive sx.
            // We can't use the prop directly in responsive syntax, so we apply it inline:
            px: { xs: 2, sm: 3, md: px },
            pb: { xs: 1.5, sm: 2, md: pb },
        }}>
            <Typography
                variant="caption"
                fontWeight={700}
                color="text.disabled"
                sx={{
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                    display: 'block',
                    mb: 1,
                    fontSize: { xs: '0.62rem', sm: '0.65rem' },
                }}
            >
                {label}
            </Typography>
            <Stack spacing={1}>
                {assessments.map((a) => (
                    <AssessmentRow key={a.id} assessment={a} />
                ))}
            </Stack>
        </Box>
    );
}

// ─── LessonRow ────────────────────────────────────────────────────────────────

function LessonRow({ lesson, index }) {
    const videos      = lesson.videos      || [];
    const materials   = lesson.materials   || [];
    const assessments = lesson.assessments || [];

    const totalDuration =
        videos.reduce((s, v)    => s + (v.duration         || 0), 0) +
        materials.reduce((s, m) => s + (m.duration_seconds || 0), 0);

    return (
        <Box sx={{ borderTop: '1px solid', borderColor: 'grey.100' }}>
            {/* Lesson header */}
            <Box sx={{
                display: 'flex',
                alignItems: 'flex-start',
                // xs: tighter gap between icon and text
                gap: { xs: 1.5, sm: 2, md: 2.5 },
                // xs/sm: reduce horizontal & vertical padding
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 1.5, sm: 2, md: 2.5 },
                transition: 'all 0.25s',
                '&:hover': {
                    bgcolor: 'rgba(76,175,80,0.03)',
                    '& .lesson-icon': { transform: 'scale(1.2) rotate(5deg)', color: 'success.main' },
                    '& .lesson-title': { color: 'success.dark' },
                },
            }}>
                <Box
                    className="lesson-icon"
                    sx={{
                        mt: 0.25,
                        color: 'text.disabled',
                        transition: 'all 0.3s',
                        // xs: slightly smaller icon
                        '& svg': { fontSize: { xs: 20, sm: 24 } },
                    }}
                >
                    {videos.length > 0
                        ? <PlayCircleOutlineRoundedIcon />
                        : <MenuBookRoundedIcon />}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                        <Typography
                            className="lesson-title"
                            variant="body2"
                            fontWeight={600}
                            sx={{
                                transition: 'color 0.2s',
                                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                            }}
                        >
                            {index}. {lesson.title}
                        </Typography>
                        {totalDuration > 0 && (
                            <Typography variant="caption" sx={{
                                flexShrink: 0,
                                bgcolor: 'white',
                                border: '1px solid',
                                borderColor: 'grey.200',
                                px: 1,
                                py: 0.2,
                                borderRadius: 1.5,
                                fontWeight: 600,
                                color: 'text.secondary',
                                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                            }}>
                                {formatDuration(totalDuration)}
                            </Typography>
                        )}
                    </Box>
                    <ExpandableDescription text={lesson.description} />
                </Box>
            </Box>

            {/* Videos */}
            <MentorLessonVideoPlayer videos={videos} />

            {/* Reading materials */}
            {materials.length > 0 && (
                <Box sx={{
                    px: { xs: 2, sm: 3, md: 4 },
                    pb: assessments.length > 0 ? { xs: 1, sm: 1.5 } : { xs: 1.5, sm: 2, md: 2.5 },
                }}>
                    <Typography
                        variant="caption"
                        fontWeight={700}
                        color="text.disabled"
                        sx={{
                            textTransform: 'uppercase',
                            letterSpacing: 0.8,
                            display: 'block',
                            mb: 1,
                            fontSize: { xs: '0.62rem', sm: '0.65rem' },
                        }}
                    >
                        Resources
                    </Typography>
                    <Stack spacing={1}>
                        {materials.map((material, i) => (
                            <MaterialRow key={material.id ?? i} material={material} />
                        ))}
                    </Stack>
                </Box>
            )}

            {/* Lesson-level assessments */}
            <AssessmentsBlock
                assessments={assessments}
                label="Lesson Assessments"
                px={4}
                pb={2.5}
            />
        </Box>
    );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function MentorSyllabusAccordion({ syllabuses = [], courseId }) {
    const [expandedModule, setExpandedModule] = useState(false);

    const handleAccordionChange = (panel) => (_e, isExpanded) => {
        setExpandedModule(isExpanded ? panel : false);
    };

    if (syllabuses.length === 0) {
        return (
            <Fade in timeout={800}>
                <Box sx={{
                    textAlign: 'center',
                    py: { xs: 5, sm: 6, md: 8 },
                    px: { xs: 2, sm: 3 },
                    border: '2px dashed',
                    borderColor: 'grey.300',
                    borderRadius: 4,
                    bgcolor: 'grey.50/50',
                }}>
                    <Typography color="text.disabled" fontWeight={600} sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                        No modules added yet.
                    </Typography>
                    <Button
                        component={Link}
                        href={route('mentor.courses.syllabus', courseId)}
                        size="medium"
                        variant="contained"
                        color="success"
                        disableElevation
                        sx={{
                            mt: 2.5,
                            textTransform: 'none',
                            borderRadius: 2.5,
                            px: { xs: 3, sm: 4 },
                            '&:hover': { transform: 'scale(1.02)' },
                        }}
                    >
                        Add Your First Syllabus
                    </Button>
                </Box>
            </Fade>
        );
    }

    return (
        <Stack spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
            {syllabuses.map((mod, modIdx) => {
                const syllabusAssessments = mod.assessments || [];
                const totalItems = (mod.lessons || []).length + syllabusAssessments.length;

                return (
                    <Grow in timeout={400 + modIdx * 100} key={mod.id}>
                        <Paper
                            elevation={expandedModule === mod.id ? 4 : 0}
                            sx={{
                                border: '1px solid',
                                borderColor: expandedModule === mod.id ? 'success.light' : 'grey.200',
                                borderRadius: 3,
                                overflow: 'hidden',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: expandedModule === mod.id ? 'scale(1.01)' : 'scale(1)',
                                '&:hover': {
                                    borderColor: 'success.main',
                                    boxShadow: expandedModule === mod.id ? '' : '0 4px 20px rgba(0,0,0,0.08)',
                                    // xs: no translateX on touch — scale is enough
                                    transform: expandedModule === mod.id
                                        ? 'scale(1.01)'
                                        : { xs: 'none', sm: 'translateX(4px)' },
                                },
                            }}
                        >
                            <Accordion
                                expanded={expandedModule === mod.id}
                                onChange={handleAccordionChange(mod.id)}
                                disableGutters
                                elevation={0}
                                sx={{ '&:before': { display: 'none' }, bgcolor: 'transparent' }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: 'success.main' }} />}
                                    sx={{
                                        // xs: tighter accordion header padding
                                        px: { xs: 2, sm: 3 },
                                        py: { xs: 1.25, sm: 2 },
                                        bgcolor: expandedModule === mod.id ? 'rgba(76,175,80,0.04)' : 'white',
                                        transition: 'background-color 0.3s ease',
                                        '& .MuiAccordionSummary-content': {
                                            alignItems: 'center',
                                            gap: { xs: 1.5, sm: 2, md: 2.5 },
                                            m: 0,
                                        },
                                    }}
                                >
                                    <Avatar sx={{
                                        // xs: smaller module number avatar
                                        width:  { xs: 32, sm: 36, md: 40 },
                                        height: { xs: 32, sm: 36, md: 40 },
                                        bgcolor: expandedModule === mod.id ? 'success.main' : '#e7f1e6',
                                        color: expandedModule === mod.id ? 'white' : 'success.dark',
                                        fontSize: { xs: 12, sm: 13, md: 14 },
                                        fontWeight: 600,
                                        flexShrink: 0,
                                        transition: 'all 0.3s ease',
                                        boxShadow: expandedModule === mod.id ? '0 4px 10px rgba(76,175,80,0.3)' : 'none',
                                    }}>
                                        {modIdx + 1}
                                    </Avatar>

                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                            <Typography
                                                variant="subtitle1"
                                                fontWeight={600}
                                                sx={{
                                                    color: 'text.primary',
                                                    letterSpacing: -0.2,
                                                    fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
                                                }}
                                            >
                                                {mod.title}
                                            </Typography>
                                            {syllabusAssessments.length > 0 && (
                                                <Chip
                                                    icon={<QuizRoundedIcon sx={{ fontSize: '13px !important' }} />}
                                                    label={`${syllabusAssessments.length} ${syllabusAssessments.length === 1 ? 'Assessment' : 'Assessments'}`}
                                                    size="small"
                                                    sx={{
                                                        height: 20,
                                                        fontSize: '0.65rem',
                                                        fontWeight: 700,
                                                        bgcolor: '#e8eaf6',
                                                        color: '#3949ab',
                                                        border: '1px solid #9fa8da55',
                                                        '& .MuiChip-icon': { color: '#3949ab' },
                                                        // xs: hide on very small if needed — actually keep it, it's a chip
                                                    }}
                                                />
                                            )}
                                        </Box>
                                        <ExpandableDescription text={mod.description} />
                                    </Box>
                                </AccordionSummary>

                                <AccordionDetails sx={{ p: 0, bgcolor: 'white' }}>
                                    {totalItems === 0 ? (
                                        <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3 }}>
                                            <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                                                No lessons or assessments in this module yet.
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Box>
                                            {(mod.lessons || []).map((lesson, lessonIdx) => (
                                                <LessonRow key={lesson.id} lesson={lesson} index={lessonIdx + 1} />
                                            ))}

                                            {syllabusAssessments.length > 0 && (
                                                <>
                                                    {(mod.lessons || []).length > 0 && (
                                                        <Divider sx={{ mx: { xs: 2, sm: 3, md: 4 }, opacity: 0.5 }} />
                                                    )}
                                                    <AssessmentsBlock
                                                        assessments={syllabusAssessments}
                                                        label="Module Assessments"
                                                        px={4}
                                                        pb={3}
                                                    />
                                                </>
                                            )}
                                        </Box>
                                    )}
                                </AccordionDetails>
                            </Accordion>
                        </Paper>
                    </Grow>
                );
            })}
        </Stack>
    );
}
