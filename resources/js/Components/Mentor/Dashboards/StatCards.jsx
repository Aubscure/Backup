import React from 'react';
import {
    Grid, Card, CardContent, Typography,
    Box, IconButton, Divider,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { GraduationCap, Users, PhilippinePeso, TrendingUp, MoreHorizontal } from 'lucide-react';
import { keyframes } from '@mui/material';

// ── Animations ────────────────────────────────────────────────────────────────

const shake = keyframes`
  0%   { transform: rotate(0deg); }
  25%  { transform: rotate(-10deg); }
  75%  { transform: rotate(10deg); }
  100% { transform: rotate(0deg); }
`;

// ── Static stat definitions (pre-course onboarding — values always 0) ────────

const STATS = [
    {
        title:     'MENTOR COURSES',
        value:     '0',
        change:    'No courses yet',
        footer:    'Create your first course to start',
        Icon:      GraduationCap,
        iconColor: '#187604',
        iconBg:    '#e7f1e6',
    },
    {
        title:     'ENROLLEES',
        value:     '0',
        change:    'No enrollees yet',
        footer:    'Enrollments appear after publishing',
        Icon:      Users,
        iconColor: '#e5a810',
        iconBg:    '#fff8e1',
    },
    {
        title:     'EARNINGS',
        value:     '₱0.00',
        change:    'No earnings yet',
        footer:    'Payments coming soon',
        Icon:      PhilippinePeso,
        iconColor: '#187604',
        iconBg:    '#e7f1e6',
    },
];

export default function StatCards({ isVerified }) {
    return (
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
            {STATS.map((stat, i) => {
                const { Icon } = stat;

                return (
                    <Grid item xs={12} sm={6} md={4} key={i} sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Card
                            elevation={0}
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'box-shadow 0.25s, transform 0.25s, border-color 0.25s',
                                cursor: 'default',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: isVerified
                                        ? '0 12px 24px -4px rgba(24,118,4,0.18)'
                                        : '0 12px 24px -4px rgba(0,0,0,0.08)',
                                    borderColor: 'transparent',
                                    '& .stat-icon':  { transform: 'scale(1.1) rotate(5deg)' },
                                    '& .lock-icon':  {
                                        animation: `${shake} 0.5s ease-in-out`,
                                        color: '#187604',
                                    },
                                },
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>

                                {/* ── Top row: label + icon ── */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Typography
                                        variant="caption"
                                        fontWeight={700}
                                        sx={{
                                            letterSpacing: '0.08em',
                                            color: 'text.secondary',
                                            textTransform: 'uppercase',
                                            fontSize: '11px',
                                        }}
                                    >
                                        {stat.title}
                                    </Typography>

                                    <Box
                                        className="stat-icon"
                                        sx={{
                                            p: 1,
                                            borderRadius: 2,
                                            bgcolor: isVerified ? stat.iconBg : '#f5f5f5',
                                            display: 'flex',
                                            transition: 'transform 0.25s',
                                        }}
                                    >
                                        <Icon
                                            size={20}
                                            color={isVerified ? stat.iconColor : '#bdbdbd'}
                                        />
                                    </Box>
                                </Box>

                                {/* ── Value (blurred when locked) ── */}
                                <Box sx={{ position: 'relative', mb: 0.75 }}>
                                    <Typography
                                        variant="h3"
                                        fontWeight={900}
                                        sx={{
                                            letterSpacing: '-1px',
                                            lineHeight: 1.1,
                                            color: isVerified ? 'text.primary' : 'text.disabled',
                                            filter: isVerified ? 'none' : 'blur(6px)',
                                            transition: 'filter 0.3s ease',
                                            userSelect: isVerified ? 'auto' : 'none',
                                        }}
                                    >
                                        {stat.value}
                                    </Typography>

                                    {/* Lock badge — centred over blurred value */}
                                    {!isVerified && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                inset: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <LockIcon
                                                className="lock-icon"
                                                sx={{
                                                    fontSize: 22,
                                                    color: 'text.disabled',
                                                    transition: 'color 0.3s ease',
                                                }}
                                            />
                                        </Box>
                                    )}
                                </Box>

                                {/* ── Change row (blurred when locked) ── */}
                                <Box
                                    sx={{
                                        display: 'flex', alignItems: 'center', gap: 0.75,
                                        filter: isVerified ? 'none' : 'blur(3px)',
                                        transition: 'filter 0.3s ease',
                                    }}
                                >
                                    <TrendingUp size={15} color={isVerified ? '#22c55e' : '#bdbdbd'} />
                                    <Typography
                                        variant="body2"
                                        fontWeight={700}
                                        color={isVerified ? '#15803d' : 'text.disabled'}
                                    >
                                        {stat.change}
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                {/* ── Footer row ── */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography
                                        variant="caption"
                                        fontWeight={500}
                                        color="text.secondary"
                                        sx={{
                                            filter: isVerified ? 'none' : 'blur(3px)',
                                            transition: 'filter 0.3s ease',
                                        }}
                                    >
                                        {stat.footer}
                                    </Typography>
                                </Box>

                            </CardContent>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
}
