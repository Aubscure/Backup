import { Box, Button, Paper, Stack } from '@mui/material';
import { keyframes } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

/**
 * Floating Mentor Course Footer Action Bar — Glassmorphism Edition
 */

const floatUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

export default function MentorCourseFooterActions({
    onDiscard,
    onSaveAsDraft,
    onBack,
    onNext,
    nextLabel = 'Next Step',
    nextDisabled = false,
    processing = false,
    discardLabel = 'Discard',
    showDiscard = true,
    sx = {},
}) {
    return (
        <Paper
            elevation={0}
            sx={(theme) => ({
                position: 'fixed',
                bottom: 24,
                left: { xs: 16, md: 'calc(256px + 24px)' },
                right: 16,
                zIndex: 1300,

                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 1.5, md: 2 },

                borderRadius: 3,

                // ── Glassmorphism core ──────────────────────────────────────
                // Layered semi-transparent gradient for depth
                background: `
                    linear-gradient(
                        135deg,
                        rgba(255, 255, 255, 0.55) 0%,
                        rgba(255, 255, 255, 0.30) 50%,
                        rgba(255, 255, 255, 0.45) 100%
                    )
                `,
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',

                // Frosted inner glow + crisp outer edge
                border: '1px solid rgba(255, 255, 255, 0.65)',
                boxShadow: `
                    0 8px 32px rgba(0, 0, 0, 0.10),
                    0 2px 8px rgba(0, 0, 0, 0.06),
                    inset 0 1px 0 rgba(255, 255, 255, 0.80),
                    inset 0 -1px 0 rgba(255, 255, 255, 0.20)
                `,

                // Subtle animated shimmer overlay via pseudo-element workaround
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 'inherit',
                    background: `
                        linear-gradient(
                            105deg,
                            transparent 40%,
                            rgba(255, 255, 255, 0.18) 50%,
                            transparent 60%
                        )
                    `,
                    backgroundSize: '200% 100%',
                    animation: `${shimmer} 4s linear infinite`,
                    pointerEvents: 'none',
                    zIndex: 0,
                },
                // ───────────────────────────────────────────────────────────

                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' },
                justifyContent: 'space-between',
                gap: { xs: 2, sm: 0 },

                transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
                animation: `${floatUp} 0.5s cubic-bezier(0.22,1,0.36,1) both`,

                '&:hover': {
                    transform: 'translateY(-6px) scale(1.01)',
                    boxShadow: `
                        0 20px 60px rgba(0, 0, 0, 0.14),
                        0 4px 16px rgba(0, 0, 0, 0.08),
                        inset 0 1px 0 rgba(255, 255, 255, 0.90),
                        inset 0 -1px 0 rgba(255, 255, 255, 0.25)
                    `,
                    background: `
                        linear-gradient(
                            135deg,
                            rgba(255, 255, 255, 0.65) 0%,
                            rgba(255, 255, 255, 0.38) 50%,
                            rgba(255, 255, 255, 0.55) 100%
                        )
                    `,
                },

                // Ensure children sit above the shimmer pseudo-element
                '& > *': { position: 'relative', zIndex: 1 },

                ...sx,
            })}
        >
            {/* Left: Discard */}
            {showDiscard && (
                <Button
                    onClick={onDiscard}
                    startIcon={<DeleteIcon />}
                    color="error"
                    sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        width: { xs: '100%', sm: 'auto' },
                        order: { xs: 1, sm: 0 },
                        backdropFilter: 'blur(4px)',
                        '&:hover': {
                            background: 'rgba(211, 47, 47, 0.08)',
                        },
                    }}
                >
                    {discardLabel}
                </Button>
            )}

            {/* Right side buttons */}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                sx={{
                    width: { xs: '100%', sm: 'auto' },
                }}
            >
                {onSaveAsDraft && (
                    <Button
                        onClick={onSaveAsDraft}
                        disabled={processing}
                        variant="outlined"
                        sx={{
                            textTransform: 'none',
                            fontWeight: 500,
                            width: { xs: '100%', sm: 'auto' },
                            transition: 'all 0.25s ease',
                            borderColor: 'rgba(0,0,0,0.18)',
                            background: 'rgba(255,255,255,0.35)',
                            backdropFilter: 'blur(8px)',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                background: 'rgba(255,255,255,0.55)',
                                borderColor: 'rgba(0,0,0,0.28)',
                            },
                        }}
                    >
                        Save as Draft
                    </Button>
                )}

                {onBack && (
                    <Button
                        onClick={onBack}
                        variant="outlined"
                        sx={{
                            textTransform: 'none',
                            fontWeight: 500,
                            width: { xs: '100%', sm: 'auto' },
                            transition: 'all 0.25s ease',
                            borderColor: 'rgba(0,0,0,0.18)',
                            background: 'rgba(255,255,255,0.35)',
                            backdropFilter: 'blur(8px)',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                background: 'rgba(255,255,255,0.55)',
                                borderColor: 'rgba(0,0,0,0.28)',
                            },
                        }}
                    >
                        Back
                    </Button>
                )}

                {onNext && (
                    <Button
                        onClick={onNext}
                        disabled={processing || nextDisabled}
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                            background: !nextDisabled
                                ? 'linear-gradient(135deg, #2e7d34 0%, #1b5e20 100%)'
                                : undefined,
                            bgcolor: nextDisabled ? 'grey.200' : 'transparent',
                            backdropFilter: 'blur(8px)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #289b32 0%, #1b5e20 100%)'
,
                                transform: 'translateY(-2px) scale(1.03)',
                                boxShadow: '0 8px 24px #2e7d34',
                            },
                            '&.Mui-disabled': {
                                bgcolor: 'grey.200',
                                color: 'grey.600',
                            },
                            textTransform: 'none',
                            fontWeight: 700,
                            px: 4,
                            py: 1.2,
                            borderRadius: 2,
                            width: { xs: '100%', sm: 'auto' },
                            boxShadow: !nextDisabled
                                ? '0 4px 14px rgba(5,150,105,0.30), inset 0 1px 0 rgba(255,255,255,0.20)'
                                : 'none',
                            transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                        }}
                    >
                        {nextLabel}
                    </Button>
                )}
            </Stack>
        </Paper>
    );
}