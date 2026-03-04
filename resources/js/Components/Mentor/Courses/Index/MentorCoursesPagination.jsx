import { Paper, Stack, Button, Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { DoNotDisturbOnTotalSilenceOutlined } from '@mui/icons-material';

const floatUp = keyframes`
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

export default function MentorCoursesPagination({ currentPage, lastPage, onPageChange, total, perPage }) {
    const showing = Math.min(currentPage * perPage, total);

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
                border: '1px solid rgba(255, 255, 255, 0.65)',
                boxShadow: `
                    0 8px 32px rgba(0, 0, 0, 0.10),
                    0 2px 8px rgba(0, 0, 0, 0.06),
                    inset 0 1px 0 rgba(255, 255, 255, 0.80),
                    inset 0 -1px 0 rgba(255, 255, 255, 0.20)
                `,
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
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
                animation: `${floatUp} 0.5s cubic-bezier(0.22,1,0.36,1) both`,
            })}
        >
            {/* Left: Prev / Next arrows */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ zIndex: 1 }}>
                <Button
                    variant="outlined"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    sx={{
                        minWidth: 40,
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        p: 0,
                        color: 'text.secondary',
                        borderColor: 'divider',
                    }}
                >
                    <ChevronLeftIcon fontSize="small" />
                </Button>

                <Button
                    variant="contained"
                    color="success"
                    disabled={currentPage === lastPage}
                    onClick={() => onPageChange(currentPage + 1)}
                    sx={{
                        minWidth: 40,
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        p: 0,
                        boxShadow: 3,
                    }}
                >
                    <ChevronRightIcon fontSize="small" />
                </Button>
            </Stack>

            {/* Right: results count */}
            <Typography
                variant="body2"
                sx={{ zIndex: 1, color: 'text.secondary', fontWeight: 500, userSelect: 'none' }}
            >
            {total > 0
                ? `Showing ${showing.toLocaleString()} of ${total.toLocaleString()} results`
                : `Page ${currentPage} of ${lastPage}`
            }
            </Typography>
        </Paper>
    );
}
