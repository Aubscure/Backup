import { memo } from 'react';
import { Box, Typography, Fade, Grow } from '@mui/material';

const CoursePageHeader = memo(function CoursePageHeader({
    mounted,
    icon: Icon,
    title,
    subtitle,
    rightSlot = null,
}) {
    return (
        <Fade in={mounted} timeout={500}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 4,
                    flexWrap: 'wrap',
                    gap: 2,
                }}
            >
                {/* ── Left: icon + text ── */}
                <Grow in={mounted} timeout={600}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        <Box
                            sx={{
                                mt: 0.5,
                                width: 44,
                                height: 44,
                                borderRadius: 2.5,
                                background: 'linear-gradient(135deg, #66bb6a 0%, #2e7d32 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 14px rgba(46,125,50,0.25)',
                                flexShrink: 0,
                                transition: 'box-shadow 0.3s, transform 0.3s',
                                '&:hover': {
                                    boxShadow: '0 6px 20px rgba(46,125,50,0.35)',
                                    transform: 'scale(1.08) rotate(-4deg)',
                                },
                            }}
                        >
                            {Icon && <Icon sx={{ color: 'white', fontSize: 22 }} />}
                        </Box>

                        <Box>
                            <Typography
                                variant="h4"
                                fontWeight="bold"
                                sx={{
                                    mb: 0.5,
                                    background: 'linear-gradient(90deg, #2e7d32, #66bb6a)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    display: 'inline-block',
                                    lineHeight: 1.2,
                                }}
                            >
                                {title}
                            </Typography>
                            {subtitle && (
                                <Typography variant="body1" color="text.secondary">
                                    {subtitle}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Grow>

                {/* ── Right: optional slot (e.g. storage widget) ── */}
                {rightSlot && (
                    <Fade in={mounted} timeout={700} style={{ transitionDelay: '150ms' }}>
                        <Box>{rightSlot}</Box>
                    </Fade>
                )}
            </Box>
        </Fade>
    );
});

export default CoursePageHeader;