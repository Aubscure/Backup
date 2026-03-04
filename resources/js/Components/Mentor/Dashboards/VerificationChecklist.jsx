import React from 'react';
import { Box, Paper, Typography, Stack, Chip, LinearProgress, keyframes, alpha } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LockIcon from '@mui/icons-material/Lock';

// --- ANIMATIONS ---
const pulseRing = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(229, 168, 16, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(229, 168, 16, 0); }
  100% { box-shadow: 0 0 0 0 rgba(229, 168, 16, 0); }
`;

const pulseRingSuccess = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(28, 119, 8, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(28, 119, 8, 0); }
  100% { box-shadow: 0 0 0 0 rgba(28, 119, 8, 0); }
`;

const popIn = keyframes`
  0% { transform: scale(0.5); opacity: 0; }
  60% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
`;

/**
 * VerificationChecklist
 *
 * Props:
 *   isVerified          - user's is_verified flag
 *   verificationSubmitted - has submitted verification docs
 *   hasCourse           - any course exists (draft, published, unpublished)
 *   hasPublishedCourse  - at least one published course exists
 */
export default function VerificationChecklist({
    isVerified,
    verificationSubmitted,
    hasCourse = false,
    hasPublishedCourse = false,
}) {
    // ── Step statuses ──────────────────────────────────────────────────────────

    const step2Status = isVerified
        ? 'completed'
        : verificationSubmitted
            ? 'review'
            : 'current';

    const step3Status = !isVerified
        ? 'locked'
        : hasCourse
            ? 'completed'
            : 'current';

    const step4Status = !isVerified || !hasCourse
        ? 'locked'
        : hasPublishedCourse
            ? 'completed'
            : 'current';

    const steps = [
        {
            id: 1,
            title: 'Create Account',
            subtitle: 'Basic profile setup complete.',
            status: 'completed',
        },
        {
            id: 2,
            title: 'Verify Identity & Expertise',
            subtitle: 'Upload CV, professional certificates, and ID proof.',
            status: step2Status,
        },
        {
            id: 3,
            title: 'Create Your First Course',
            subtitle: 'Outline syllabus and upload content.',
            status: step3Status,
        },
        {
            id: 4,
            title: 'Publish & Earn',
            subtitle: 'Go live and accept students.',
            status: step4Status,
        },
    ];

    // ── Progress & completed count ─────────────────────────────────────────────

    const completedCount = steps.filter((s) => s.status === 'completed').length;
    const progress = (completedCount / steps.length) * 100;

    // Color shifts green once verified, stays amber while pending
    const progressColor = isVerified ? '#1c7708' : '#e5a810';

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 16px -4px rgba(0,0,0,0.1)',
                },
                fontFamily: 'Roboto, sans-serif',
                '& *': { fontFamily: 'Roboto, sans-serif !important' },
            }}
        >
            {/* ── Header ── */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">Getting Started Checklist</Typography>
                <Chip
                    label={`${completedCount}/4 Completed`}
                    size="small"
                    sx={{
                        fontWeight: 'bold',
                        bgcolor: alpha(progressColor, 0.1),
                        color: progressColor,
                    }}
                />
            </Box>

            {/* ── Progress Bar ── */}
            <Box sx={{ position: 'relative', mb: 4 }}>
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'grey.100',
                        '& .MuiLinearProgress-bar': {
                            bgcolor: progressColor,
                            borderRadius: 4,
                            transition: 'background-color 0.5s ease, transform 0.4s ease',
                        },
                    }}
                />
            </Box>

            {/* ── Step list ── */}
            <Stack spacing={2}>
                {steps.map((step) => {
                    const isLocked    = step.status === 'locked';
                    const isCurrent   = step.status === 'current';
                    const isCompleted = step.status === 'completed';
                    const isReview    = step.status === 'review';

                    // For steps 3+, the "active" colour is always green (only reachable after verification)
                    const activeColor = (step.id >= 3 || isVerified) ? '#1c7708' : '#e5a810';
                    const pulsAnim    = (step.id >= 3 || isVerified) ? pulseRingSuccess : pulseRing;

                    return (
                        <Box
                            key={step.id}
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                p: 1.5,
                                borderRadius: 2,
                                transition: 'all 0.2s ease',
                                opacity: isLocked ? 0.6 : 1,
                                bgcolor: isCurrent ? alpha(activeColor, 0.04) : 'transparent',
                                cursor: isLocked ? 'not-allowed' : 'default',
                                '&:hover': {
                                    bgcolor: isLocked ? 'transparent' : 'grey.50',
                                    transform: isLocked ? 'none' : 'translateX(4px)',
                                },
                            }}
                        >
                            {/* ── Icon ── */}
                            <Box sx={{ mr: 2, mt: 0.5, position: 'relative' }}>
                                {isCompleted ? (
                                    <CheckCircleIcon
                                        color="success"
                                        sx={{ animation: `${popIn} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)` }}
                                    />
                                ) : isCurrent || isReview ? (
                                    <Box
                                        sx={{
                                            width: 24, height: 24,
                                            borderRadius: '50%',
                                            border: '2px solid',
                                            borderColor: activeColor,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 'bold', fontSize: 12, color: 'text.primary',
                                            bgcolor: 'white',
                                            animation: `${pulsAnim} 2s infinite`,
                                        }}
                                    >
                                        {step.id}
                                    </Box>
                                ) : (
                                    <Box
                                        sx={{
                                            width: 24, height: 24,
                                            borderRadius: '50%',
                                            border: '2px solid',
                                            borderColor: 'grey.300',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 12, color: 'grey.400',
                                        }}
                                    >
                                        {isLocked ? <LockIcon sx={{ fontSize: 14 }} /> : step.id}
                                    </Box>
                                )}

                                {/* Vertical connector */}
                                {step.id !== steps.length && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            left: '11px', top: 28, bottom: -20,
                                            width: '2px',
                                            bgcolor: isCompleted ? 'success.light' : 'grey.200',
                                            opacity: isCompleted ? 0.3 : 0.5,
                                            zIndex: 0,
                                        }}
                                    />
                                )}
                            </Box>

                            {/* ── Text ── */}
                            <Box sx={{ flex: 1 }}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={isCurrent ? 700 : 500}
                                    color={isCurrent ? activeColor : 'text.primary'}
                                >
                                    {step.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {step.subtitle}
                                </Typography>
                            </Box>

                            {/* ── Badges ── */}
                            <Box>
                                {step.id === 2 && isReview && (
                                    <Chip
                                        icon={<AccessTimeIcon sx={{ fontSize: '16px !important' }} />}
                                        label="In Review"
                                        size="small"
                                        sx={{
                                            bgcolor: '#fff8e1', color: '#e5a810',
                                            fontWeight: 'bold',
                                            '& .MuiChip-icon': { color: '#e5a810' },
                                        }}
                                    />
                                )}
                                {step.id === 2 && isVerified && (
                                    <Chip
                                        label="Verified"
                                        color="success"
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                )}
                                {step.id === 3 && hasCourse && isCompleted && (
                                    <Chip
                                        label="Done"
                                        color="success"
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                )}
                                {step.id === 4 && hasPublishedCourse && isCompleted && (
                                    <Chip
                                        label="Live 🚀"
                                        color="success"
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                )}
                            </Box>
                        </Box>
                    );
                })}
            </Stack>
        </Paper>
    );
}