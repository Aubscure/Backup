import { Button, Box } from '@mui/material';
import { scaleIn, shimmerBg } from './keyframes';

export default function TemplateButton({ label, active, onClick, delay = 0 }) {
    return (
        <Button
            size="small"
            variant={active ? 'contained' : 'outlined'}
            onClick={onClick}
            sx={{
                textTransform: 'none', fontWeight: 600, fontSize: '0.78rem', px: 1.5,
                position: 'relative', overflow: 'hidden',
                transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                animation: `${scaleIn} 0.35s cubic-bezier(0.34,1.56,0.64,1) ${delay}s both`,
                ...(active
                    ? {
                        bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' },
                        border: 'none', color: '#fff', transform: 'scale(1.06)',
                        boxShadow: '0 4px 14px rgba(30,77,43,0.35)',
                    }
                    : {
                        borderColor: '#ddd', color: 'text.secondary',
                        '&:hover': {
                            borderColor: 'success.main', color: 'success.main',
                            transform: 'translateY(-1px)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        },
                    }
                ),
            }}
        >
            {active && (
                <Box sx={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.15) 50%,transparent 100%)',
                    backgroundSize: '200% 100%',
                    animation: `${shimmerBg} 2s linear infinite`,
                }} />
            )}
            {label}
        </Button>
    );
}
