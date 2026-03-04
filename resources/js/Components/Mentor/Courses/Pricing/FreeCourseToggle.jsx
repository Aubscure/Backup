import { memo } from 'react';
import { Box, Paper, Typography, FormControlLabel, Checkbox, Collapse, Fade } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const FreeCourseToggle = memo(function FreeCourseToggle({ checked, onChange }) {
    return (
        <Paper
            variant="outlined"
            sx={{
                p: { xs: 2, sm: 2.5 },
                mb: { xs: 2, md: 3 },
                borderRadius: 2,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                bgcolor: checked ? 'success.50' : 'grey.50',
                borderColor: checked ? 'success.main' : 'divider',
                borderWidth: checked ? 2 : 1,
                transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                '&:hover': {
                    borderColor: 'success.light',
                    boxShadow: '0 4px 16px rgba(46,125,50,0.10)',
                    transform: 'translateY(-1px)',
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: checked
                        ? 'linear-gradient(120deg, rgba(102,187,106,0.08) 0%, transparent 60%)'
                        : 'transparent',
                    transition: 'background 0.35s',
                    pointerEvents: 'none',
                },
            }}
            onClick={() => onChange({ target: { checked: !checked } })}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormControlLabel
                    onClick={(e) => e.stopPropagation()}
                    control={
                        <Checkbox
                            checked={checked}
                            onChange={onChange}
                            sx={{
                                color: 'success.main',
                                transition: 'transform 0.2s',
                                '&.Mui-checked': { color: 'success.main', transform: 'scale(1.1)' },
                            }}
                        />
                    }
                    label={
                        <Typography
                            variant="body1"
                            fontWeight={600}
                            sx={{
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                color: checked ? 'success.dark' : 'text.primary',
                                transition: 'color 0.2s',
                            }}
                        >
                            Make this course FREE
                        </Typography>
                    }
                />

                <Fade in={checked} timeout={300}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CheckCircleOutlineIcon
                            sx={{
                                color: 'success.main',
                                fontSize: 20,
                                animation: checked ? 'popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)' : 'none',
                                '@keyframes popIn': {
                                    from: { transform: 'scale(0) rotate(-45deg)', opacity: 0 },
                                    to: { transform: 'scale(1) rotate(0deg)', opacity: 1 },
                                },
                            }}
                        />
                        <Typography variant="caption" color="success.main" fontWeight={600}>
                            Active
                        </Typography>
                    </Box>
                </Fade>
            </Box>

            <Collapse in={true} timeout={200}>
                <Typography
                    variant="caption"
                    color={checked ? 'success.dark' : 'text.secondary'}
                    sx={{
                        ml: { xs: 4, sm: 4.5 },
                        display: 'block',
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        transition: 'color 0.2s',
                    }}
                >
                    When enabled, both Individual and Organization plans will be free for all users.
                </Typography>
            </Collapse>
        </Paper>
    );
});

export default FreeCourseToggle;
