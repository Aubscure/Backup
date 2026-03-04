import React from 'react';
import { Box, Typography, Paper, Stack, Button, Tooltip, Fade } from '@mui/material';
import EmojiEventsRoundedIcon      from '@mui/icons-material/EmojiEventsRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import LockIcon                    from '@mui/icons-material/Lock';

import CertPreview from '@/Components/Enrollee/Courses/Show/CertPreview';
import { EASE }    from '@/Components/Enrollee/Courses/Show/Utils';

export default function OverviewTab({ course, hasCertificate, enrollment, hasAccess, mentorName, authUser }) {
    const isCompleted = !!(enrollment?.completed_at || enrollment?.status === 'completed');
    const downloadUrl = course.certificate?.download_url;

    return (
        <Fade in key="overview">
            <Box>
                {/* ── About ─────────────────────────────────────────────── */}
                <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, p: { xs: 2, sm: 3 }, mb: 2.5 }}>
                    <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1.5 }}>
                        About this course
                    </Typography>
                    <Typography variant="body2" color="text.secondary"
                        sx={{ lineHeight: 1.9, whiteSpace: 'pre-wrap' }}
                        dangerouslySetInnerHTML={{ __html: course.description || 'No description provided.' }} />
                </Paper>

                {/* ── Certificate callout banner ─────────────────────────── */}
                {hasCertificate && (
                    <Paper elevation={0}
                        sx={{ borderRadius: 3, p: { xs: 2, sm: 2.5 }, mb: 2.5, background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)', border: '1px solid #c8e6c9' }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Box sx={{ width: 52, height: 52, borderRadius: 3, flexShrink: 0, bgcolor: 'success.main', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(76,175,80,0.35)' }}>
                                <EmojiEventsRoundedIcon sx={{ fontSize: 28, color: '#fff' }} />
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" fontWeight={800} color="success.dark">
                                    Certificate of Completion
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, lineHeight: 1.6 }}>
                                    Complete all lessons and assessments to earn your certificate.
                                    Showcase your achievement and advance your career.
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                )}

                {/* ── Live certificate preview + download ───────────────── */}
                {hasCertificate && (
                    <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, p: { xs: 2, sm: 3 }, overflow: 'hidden' }}>

                        {/* Header row */}
                        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1} sx={{ mb: 2.5 }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <EmojiEventsRoundedIcon sx={{ fontSize: 20, color: 'success.main' }} />
                                <Typography variant="subtitle1" fontWeight={800}>Your certificate</Typography>
                            </Stack>

                            {/* Download — locked until course completion */}
                            <Tooltip
                                title={isCompleted ? '' : 'Complete the course to download your certificate'}
                                arrow placement="top"
                            >
                                <span>
                                    <Button
                                        variant={isCompleted ? 'contained' : 'outlined'}
                                        size="small"
                                        disabled={!isCompleted}
                                        component={isCompleted && downloadUrl ? 'a' : 'button'}
                                        href={isCompleted && downloadUrl ? downloadUrl : undefined}
                                        download={isCompleted && downloadUrl ? true : undefined}
                                        target={isCompleted && downloadUrl ? '_blank' : undefined}
                                        rel={isCompleted && downloadUrl ? 'noopener noreferrer' : undefined}
                                        startIcon={
                                            isCompleted
                                                ? <WorkspacePremiumRoundedIcon sx={{ fontSize: '16px !important' }} />
                                                : <LockIcon sx={{ fontSize: '15px !important' }} />
                                        }
                                        sx={{
                                            textTransform: 'none', fontWeight: 700, borderRadius: 2, fontSize: '0.78rem',
                                            ...(isCompleted
                                                ? { bgcolor: 'success.main', boxShadow: '0 4px 14px rgba(76,175,80,0.30)', transition: `all 220ms ${EASE}`, '&:hover': { bgcolor: 'success.dark', transform: 'translateY(-1px)', boxShadow: '0 6px 18px rgba(76,175,80,0.38)' } }
                                                : { borderColor: 'grey.300', color: 'text.disabled', '&.Mui-disabled': { borderColor: 'grey.200', color: 'text.disabled' } }
                                            ),
                                        }}
                                    >
                                        {isCompleted ? 'Download Certificate' : 'Locked'}
                                    </Button>
                                </span>
                            </Tooltip>
                        </Stack>

                        {/* Live certificate preview — always visible, centred, motivational */}
                        <Box sx={{ width: '100%', borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'grey.200', boxShadow: '0 8px 40px rgba(0,0,0,0.10)' }}>
                            <CertPreview
                                template={course.certificate?.design_layout}
                                palette={course.certificate?.color_palette}
                                studentName={[authUser.firstname, authUser.lastname].filter(Boolean).join(' ') || 'Your Name'}
                                courseName={course.title}
                                instructorName={mentorName}
                                isCompleted={isCompleted}
                            />
                        </Box>

                        {/* Caption */}
                        <Typography variant="caption" color="text.disabled"
                            sx={{ display: 'block', textAlign: 'center', mt: 1.5, fontStyle: 'italic' }}>
                            {isCompleted
                                ? 'Congratulations! Your certificate is ready to download.'
                                : 'This is a preview — finish all lessons and assessments to unlock your download.'
                            }
                        </Typography>
                    </Paper>
                )}
            </Box>
        </Fade>
    );
}
