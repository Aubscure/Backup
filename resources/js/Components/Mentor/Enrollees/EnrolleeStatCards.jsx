import React from 'react';
import { Box, Typography, Paper, Stack } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { keyframes } from '@mui/material';
import { STATIC_STATS } from './enrolleeData';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const CARDS = (stats) => [
    {
        label:    'Total Enrollees',
        value:    stats.total_enrollees.toLocaleString(),
        sub:      '+12% from last month',
        subColor: '#16a34a',
        icon:     <PeopleAltIcon sx={{ fontSize: 28 }} />,
        iconBg:   '#f0fdf4',
        iconColor:'#1a7309',
    },
    {
        label:    'Active Enrollments',
        value:    stats.active_enrollments.toLocaleString(),
        sub:      '68.3% occupancy',
        subColor: '#6b7280',
        icon:     <HowToRegIcon sx={{ fontSize: 28 }} />,
        iconBg:   '#eff6ff',
        iconColor:'#2563eb',
    },
    {
        label:    'Completion Rate',
        value:    `${stats.completion_rate}%`,
        sub:      '+2.4% vs industry avg',
        subColor: '#16a34a',
        icon:     <TrendingUpIcon sx={{ fontSize: 28 }} />,
        iconBg:   '#fefce8',
        iconColor:'#ca8a04',
    },
    {
        label:    'Issued Certificates',
        value:    stats.issued_certificates.toLocaleString(),
        sub:      `Based on ${stats.total_enrollees.toLocaleString()} enrollees`,
        subColor: '#6b7280',
        icon:     <WorkspacePremiumIcon sx={{ fontSize: 28 }} />,
        iconBg:   '#fdf4ff',
        iconColor:'#9333ea',
    },
];

export default function EnrolleeStatsCards({ stats = STATIC_STATS }) {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', lg: 'repeat(4, 1fr)' },
                gap: 2.5,
                mb: 3,
            }}
        >
            {CARDS(stats).map((card, i) => (
                <Paper
                    key={card.label}
                    elevation={0}
                    sx={{
                        p: 2.5,
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        animation: `${fadeInUp} 0.45s ease-out both`,
                        animationDelay: `${i * 0.07}s`,
                        transition: 'box-shadow 0.2s, transform 0.2s',
                        '&:hover': {
                            boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
                            transform: 'translateY(-2px)',
                        },
                    }}
                >
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                            <Typography variant="caption" fontWeight={600} sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.7rem' }}>
                                {card.label}
                            </Typography>
                            <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5, color: '#111827', lineHeight: 1.1 }}>
                                {card.value}
                            </Typography>
                            <Typography variant="caption" sx={{ color: card.subColor, mt: 0.5, display: 'block', fontWeight: 500 }}>
                                {card.sub}
                            </Typography>
                        </Box>
                        <Box sx={{ p: 1.25, borderRadius: 2.5, bgcolor: card.iconBg, color: card.iconColor, display: 'flex', alignItems: 'center' }}>
                            {card.icon}
                        </Box>
                    </Stack>
                </Paper>
            ))}
        </Box>
    );
}