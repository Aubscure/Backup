import { Box, Typography } from '@mui/material';
import CheckCircleIcon          from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { fadeInUp, checkBounce } from './keyframes';

export default function CourseRow({ course, isAssigned, isChecked, onToggle, delay = 0 }) {
    return (
        <Box
            onClick={onToggle}
            sx={{
                display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1,
                borderRadius: 1.5, cursor: 'pointer',
                border: '1px solid', borderColor: isChecked ? 'success.main' : 'divider',
                bgcolor: isChecked ? 'rgba(46,125,50,0.06)' : 'transparent',
                transition: 'all 0.22s ease',
                animation: `${fadeInUp} 0.35s ease ${delay}s both`,
                '&:hover': {
                    bgcolor: isChecked ? 'rgba(46,125,50,0.1)' : 'rgba(30,77,43,0.04)',
                    borderColor: 'success.main', transform: 'translateX(2px)',
                },
                '&:active': { transform: 'translateX(1px) scale(0.99)' },
            }}
        >
            <Box sx={{ flexShrink: 0 }}>
                {isChecked
                    ? <CheckCircleIcon sx={{ color: 'success.main', fontSize: 22, animation: `${checkBounce} 0.35s cubic-bezier(0.34,1.56,0.64,1) both` }} />
                    : isAssigned
                        ? <CheckCircleIcon sx={{ color: 'success.light', fontSize: 22, opacity: 0.6 }} />
                        : <RadioButtonUncheckedIcon sx={{ color: '#ccc', fontSize: 22 }} />
                }
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={isChecked ? 600 : 400}>
                    {course.title}
                </Typography>
                {isAssigned && !isChecked && (
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        Already has a certificate assigned
                    </Typography>
                )}
            </Box>
        </Box>
    );
}
