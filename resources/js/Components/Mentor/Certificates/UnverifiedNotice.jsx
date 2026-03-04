import { Box, Paper, Typography, Button } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { fadeInUp } from './keyframes';

export default function UnverifiedNotice({ onVerify }) {
    return (
        <Paper
            variant="outlined"
            sx={{
                borderRadius: 3, p: 3, bgcolor: '#fffbf0',
                border: '1px dashed #f0b429',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 1.5, textAlign: 'center',
                animation: `${fadeInUp} 0.5s ease 0.22s both`,
            }}
        >
            <Box sx={{
                width: 44, height: 44, borderRadius: '50%',
                bgcolor: 'rgba(240,180,41,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <LockOutlinedIcon sx={{ color: '#d97706', fontSize: 22 }} />
            </Box>
            <Box>
                <Typography variant="subtitle2" fontWeight={700} color="#92400e" sx={{ mb: 0.5 }}>
                    Account Verification Required
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', lineHeight: 1.6 }}>
                    You can design and preview certificates freely, but assigning them to courses
                    is only available once your mentor account has been verified by our team.
                </Typography>
            </Box>
            <Button
                size="small"
                variant="outlined"
                onClick={onVerify}
                sx={{
                    textTransform: 'none', fontWeight: 600, mt: 0.5,
                    borderColor: '#d97706', color: '#d97706', borderRadius: 2, fontSize: '0.78rem',
                    '&:hover': { bgcolor: 'rgba(240,180,41,0.08)', borderColor: '#b45309' },
                }}
            >
                Complete Verification →
            </Button>
        </Paper>
    );
}
