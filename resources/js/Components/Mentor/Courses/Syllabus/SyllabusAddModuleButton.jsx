import { useState } from 'react';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function SyllabusAddModuleButton({ onAdd }) {
    const [hovered, setHovered] = useState(false);

    return (
        <Box sx={{ position: 'relative' }}>
            {/* Animated dot */}
            <Box
                sx={{
                    position: 'absolute',
                    left: 20,
                    top: 0,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    border: '4px solid white',
                    bgcolor: hovered ? 'success.dark' : 'success.main',
                    boxShadow: hovered
                        ? '0 0 0 6px rgba(46,125,50,0.15)'
                        : 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                    transition: 'all 0.2s ease',
                    transform: hovered ? 'rotate(90deg) scale(1.1)' : 'rotate(0) scale(1)',
                }}
            >
                <AddIcon sx={{ fontSize: 14, color: 'white' }} />
            </Box>

            <Button
                onClick={onAdd}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                startIcon={<AddIcon />}
                sx={{
                    ml: 8,
                    color: hovered ? 'success.dark' : 'success.main',
                    textTransform: 'none',
                    fontWeight: 600,
                    letterSpacing: '0.01em',
                    transition: 'color 0.2s, letter-spacing 0.2s',
                    '&:hover': {
                        bgcolor: 'transparent',
                        letterSpacing: '0.04em',
                    },
                }}
            >
                Add New Module
            </Button>
        </Box>
    );
}