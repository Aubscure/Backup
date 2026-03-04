import React from 'react';
import { Box, Typography, Paper, Stack, Accordion, AccordionSummary, AccordionDetails, Fade } from '@mui/material';
import ExpandMoreIcon          from '@mui/icons-material/ExpandMore';
import CheckCircleIcon         from '@mui/icons-material/CheckCircle';
import SchoolRoundedIcon       from '@mui/icons-material/SchoolRounded';
import VideoLibraryRoundedIcon from '@mui/icons-material/VideoLibraryRounded';
import ArticleRoundedIcon      from '@mui/icons-material/ArticleRounded';
import QuizRoundedIcon         from '@mui/icons-material/QuizRounded';

import LessonRow   from '@/Components/Enrollee/Courses/Show/LessonRow';
import ModuleBadge from '@/Components/Enrollee/Courses/Show/ModuleBadge';
import { EASE, formatModuleDuration } from '@/Components/Enrollee/Courses/Show/utils';

export default function CurriculumTab({ syllabuses, hasAccess }) {
    return (
        <Fade in key="curriculum">
            <Box>
                {syllabuses.length === 0 ? (
                    <Paper elevation={0} variant="outlined" sx={{ p: 6, borderRadius: 3, textAlign: 'center' }}>
                        <SchoolRoundedIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1.5 }} />
                        <Typography variant="body1" color="text.secondary" fontWeight={600}>No curriculum available yet.</Typography>
                    </Paper>
                ) : (
                    <Stack spacing={1.5}>
                        {syllabuses.map((syllabus, idx) => {
                            const lessons     = syllabus.lessons || [];
                            const lessonCount = lessons.length;
                            const modVideos   = lessons.reduce((a, l) => a + (l.videos?.length    || 0), 0);
                            const modFiles    = lessons.reduce((a, l) => a + (l.materials?.length || 0), 0);
                            const modQuizzes  = (syllabus.assessments?.length || 0)
                                + lessons.reduce((a, l) => a + (l.assessments?.length || 0), 0);
                            const modDur = formatModuleDuration(lessons);

                            return (
                                <Accordion key={syllabus.id} defaultExpanded={idx === 0} elevation={0}
                                    sx={{
                                        border: '1px solid', borderColor: 'grey.200',
                                        borderRadius: '12px !important', '&:before': { display: 'none' },
                                        transition: `border-color 200ms ${EASE}`,
                                        '&.Mui-expanded': { borderColor: 'success.light', boxShadow: '0 4px 16px rgba(76,175,80,0.08)' },
                                    }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'text.secondary' }} />}
                                        sx={{
                                            borderRadius: '12px', minHeight: 58, px: { xs: 2, sm: 2.5 },
                                            '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1.5, my: 1.25 },
                                            '&.Mui-expanded': { borderBottom: '1px solid', borderColor: 'grey.100', borderRadius: '12px 12px 0 0' },
                                        }}>
                                        {/* Module index bubble */}
                                        <Box sx={{
                                            width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                                            bgcolor: hasAccess ? 'success.50' : 'grey.100',
                                            border: '1.5px solid', borderColor: hasAccess ? 'success.light' : 'grey.200',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            {hasAccess
                                                ? <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                                : <Typography variant="caption" fontWeight={800} color="text.disabled" sx={{ fontSize: '0.7rem', lineHeight: 1 }}>{idx + 1}</Typography>
                                            }
                                        </Box>

                                        <Typography fontWeight={700} variant="body2" flex={1} sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                                            {syllabus.title || `Module ${idx + 1}`}
                                        </Typography>

                                        {/* Badges — desktop */}
                                        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ flexShrink: 0, display: { xs: 'none', sm: 'flex' } }}>
                                            <ModuleBadge icon={SchoolRoundedIcon}       count={lessonCount} tooltip={`${lessonCount} lesson${lessonCount !== 1 ? 's' : ''}`} />
                                            <ModuleBadge icon={VideoLibraryRoundedIcon} count={modVideos}   tooltip={`${modVideos} video${modVideos !== 1 ? 's' : ''}`} />
                                            <ModuleBadge icon={ArticleRoundedIcon}      count={modFiles}    tooltip={`${modFiles} file${modFiles !== 1 ? 's' : ''}`} />
                                            {modQuizzes > 0 && <ModuleBadge icon={QuizRoundedIcon} count={modQuizzes} tooltip={`${modQuizzes} assessment${modQuizzes !== 1 ? 's' : ''}`} color="#3949ab" />}
                                            {modDur && <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.68rem', fontWeight: 600 }}>{modDur}</Typography>}
                                        </Stack>

                                        {/* Compact — mobile */}
                                        <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0, display: { xs: 'block', sm: 'none' }, fontSize: '0.68rem' }}>
                                            {lessonCount} lesson{lessonCount !== 1 ? 's' : ''}
                                        </Typography>
                                    </AccordionSummary>

                                    <AccordionDetails sx={{ px: { xs: 1.5, sm: 2 }, pt: 0.5, pb: 1.5 }}>
                                        {modQuizzes > 0 && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.75, mb: 1, borderRadius: 1.5, bgcolor: '#f3f4fd', border: '1px solid #e8eaf6' }}>
                                                <QuizRoundedIcon sx={{ fontSize: 14, color: '#3949ab' }} />
                                                <Typography variant="caption" sx={{ color: '#3949ab', fontWeight: 700, fontSize: '0.7rem' }}>
                                                    {modQuizzes} assessment{modQuizzes !== 1 ? 's' : ''} in this module
                                                </Typography>
                                            </Box>
                                        )}
                                        <Stack>
                                            {lessons.map((lesson, lidx) => (
                                                <LessonRow key={lesson.id} lesson={lesson} moduleIdx={idx} lessonIdx={lidx} hasAccess={hasAccess} />
                                            ))}
                                        </Stack>
                                    </AccordionDetails>
                                </Accordion>
                            );
                        })}
                    </Stack>
                )}
            </Box>
        </Fade>
    );
}