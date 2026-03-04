import React from 'react';
import {
    Grid, Card, CardContent, Typography,
    Box, IconButton, Divider,
} from '@mui/material';
import { GraduationCap, TrendingUp, MoreHorizontal } from 'lucide-react';
import { buildStatCards } from '@/Utils/dashboardUtils';   // ← from utils

export default function DashboardStatCards({ stats }) {
    const cards = buildStatCards(stats);   // handles null / missing / defaults

    return (
        <Grid container spacing={2.5}>
            {cards.map((stat, i) => {
                const Icon = stat.Icon ?? GraduationCap;
                return (
                    <Grid item xs={12} md={4} key={i} sx={{ width: { xs: '100%', sm: '100%', md: 'auto', lg: 'auto' }, maxHeighteight: '70%', flexGrow: 1, justifyContent: 'end', alignItems: 'center' }}>
                        <Card
                            elevation={0}
                            sx={{
                                border: '1px solid', borderColor: 'divider', borderRadius: 2,
                                transition: 'box-shadow 0.2s',
                                '&:hover': { boxShadow: 3, '& .stat-icon': { transform: 'scale(1.08)' } },
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Typography variant="caption" fontWeight={700}
                                        sx={{ letterSpacing: '0.08em', color: 'text.secondary', textTransform: 'uppercase', fontSize: '11px' }}>
                                        {stat.title}
                                    </Typography>
                                    <Box className="stat-icon"
                                        sx={{ p: 1, borderRadius: 2, bgcolor: stat.iconBg, display: 'flex', transition: 'transform 0.2s' }}>
                                        <Icon size={20} color={stat.iconColor} />
                                    </Box>
                                </Box>

                                <Typography variant="h3" fontWeight={600} color="text.primary"
                                    sx={{ letterSpacing: '-1px', lineHeight: 1.1, mb: 0.75 }}>
                                    {stat.value}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                    <TrendingUp size={15} color="#22c55e" />
                                    <Typography variant="body2" fontWeight={700} color="#15803d">
                                        {stat.change}
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
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
