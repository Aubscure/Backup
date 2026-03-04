import React from 'react';
import { Card, CardContent, Box, Typography, IconButton } from '@mui/material';
import { List, MoreHorizontal } from 'lucide-react';
import { ACTIVITY_COLORS, DEFAULT_ACTIVITY } from '@/Utils/dashboardUtils';

export default function RecentActivity({ activities }) {
    const items = activities ?? DEFAULT_ACTIVITY;

    return (
        <Card elevation={0} sx={{
            border: '1px solid', borderColor: 'divider', borderRadius: 2,
            overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%',
            // removed width: '500px' — let the Grid column control the width
        }}>
            <Box sx={{
                px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider',
                bgcolor: 'background.paper', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <List size={16} color="#15803d" />
                    <Typography variant="subtitle1" fontWeight={700} color="text.primary">Recent Activity</Typography>
                </Box>
                <IconButton size="small" sx={{ color: 'text.disabled' }}>
                    <MoreHorizontal size={16} />
                </IconButton>
            </Box>

            <CardContent sx={{ p: 3, flex: 1, overflowY: 'auto', maxHeight: 480 }}>
                {items.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
                        No activity yet.
                    </Typography>
                ) : (
                    items.map((item, i) => {
                        const colors = ACTIVITY_COLORS[item.type] ?? ACTIVITY_COLORS.primary;
                        return (
                            <Box key={i} sx={{ display: 'flex', gap: 2, cursor: 'pointer', '&:hover .dot': { transform: 'scale(1.3)' } }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 0.25 }}>
                                    <Box className="dot" sx={{
                                        width: 10, height: 10, borderRadius: '50%',
                                        bgcolor: colors.dot,
                                        boxShadow: `0 0 0 4px ${colors.ring}`,
                                        flexShrink: 0, transition: 'transform 0.2s',
                                    }} />
                                    {i !== items.length - 1 && (
                                        <Box sx={{ width: 1, flex: 1, bgcolor: '#f1f5f9', my: 0.75, minHeight: 24 }} />
                                    )}
                                </Box>
                                <Box sx={{ pb: i !== items.length - 1 ? 2.5 : 0, flex: 1 }}>
                                    <Typography variant="body2" fontWeight={500} color="text.primary" sx={{ lineHeight: 1.45, mb: 0.35 }}>
                                        <Box component="span" fontWeight={700}>{item.user}</Box>
                                        {' '}{item.action}{' '}
                                        <Box component="span" fontWeight={700} sx={{ color: colors.text }}>{item.target}</Box>
                                    </Typography>
                                    <Typography variant="caption" fontWeight={500} color="text.secondary">{item.time}</Typography>
                                </Box>
                            </Box>
                        );
                    })
                )}
            </CardContent>
        </Card>
    );
}