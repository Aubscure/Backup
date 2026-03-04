import React, { forwardRef } from 'react';
import { Box, Typography } from '@mui/material';
import { EASE, EASE_SPRING } from './utils';

const StatTile = forwardRef(({ icon, label, value, ...props }, ref) => {
    return (
        <Box
            ref={ref}
            {...props}
            sx={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                p: { xs: 1.25, sm: 1.5, md: 2 },
                borderRadius: 3, bgcolor: '#FFFFFF',
                border: '1px solid', borderColor: 'grey.100',
                gap: 0.5, textAlign: 'center',
                transition: `all 300ms ${EASE}`,
                flex: 1, minWidth: 60,
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.06)',
                    borderColor: 'success.light',
                    '& .stat-icon': { transform: 'scale(1.18)', color: 'success.main' },
                },
            }}
        >
            <Box className="stat-icon"
                sx={{ color: 'success.main', mb: 0.5, display: 'flex', transition: `transform 300ms ${EASE_SPRING}` }}>
                {icon}
            </Box>
            <Typography variant="caption" color="text.secondary" fontWeight={500}
                sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: { xs: '0.58rem', sm: '0.62rem', md: '0.7rem' } }}>
                {label}
            </Typography>
            <Typography variant="body2" fontWeight={600} color="text.primary"
                sx={{ fontSize: { xs: '0.72rem', sm: '0.8rem', md: '0.800rem' } }}>
                {value}
            </Typography>
        </Box>
    );
});

export default StatTile;