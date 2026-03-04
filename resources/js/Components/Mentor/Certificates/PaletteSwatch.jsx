import { Box, Tooltip } from '@mui/material';
import { scaleIn } from './keyframes';

export default function PaletteSwatch({ palette, selected, onClick, delay = 0 }) {
    return (
        <Tooltip title={palette.label} arrow>
            <Box
                onClick={onClick}
                sx={{
                    width: 30, height: 30, borderRadius: '50%', overflow: 'hidden',
                    cursor: 'pointer', display: 'flex', flexShrink: 0,
                    border: selected ? '3px solid #333' : '3px solid transparent',
                    boxShadow: selected
                        ? '0 0 0 2px #333,0 4px 12px rgba(0,0,0,0.25)'
                        : '0 1px 3px rgba(0,0,0,0.2)',
                    transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                    animation: `${scaleIn} 0.4s cubic-bezier(0.34,1.56,0.64,1) ${delay}s both`,
                    '&:hover': { transform: 'scale(1.2) translateY(-2px)', boxShadow: '0 6px 18px rgba(0,0,0,0.25)' },
                    '&:active': { transform: 'scale(0.92)' },
                }}
            >
                <Box sx={{ flex: 1, bgcolor: palette.primary }} />
                <Box sx={{ flex: 1, bgcolor: palette.secondary }} />
            </Box>
        </Tooltip>
    );
}
