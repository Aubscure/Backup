import React, { useState } from 'react';
import { Card, CardContent, Box, Typography, Select, MenuItem, FormControl } from '@mui/material';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { DEFAULT_REVENUE_TRENDS } from '@/Utils/dashboardUtils';   // ← from utils

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <Box sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1.5, boxShadow: 4 }}>
            <Typography variant="caption" fontWeight={700} display="block" mb={0.5} color="text.secondary">{label}</Typography>
            {payload.map((entry) => (
                <Box key={entry.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: entry.color }} />
                    <Typography variant="caption" fontWeight={700} color="text.primary">
                        {entry.name}: {entry.name.includes('Revenue') ? `$${entry.value.toLocaleString()}` : entry.value}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

export default function RevenueTrendsChart({ data }) {
    const chartData = data ?? DEFAULT_REVENUE_TRENDS;   // fallback from utils
    const [range, setRange] = useState('30');

    return (
        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{
                px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider',
                bgcolor: 'background.paper', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5,
            }}>
                <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                    Revenue &amp; Enrollment Trends
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {[{ color: '#15803d', label: 'Revenue ($)' }, { color: '#f59e0b', label: 'Enrollments' }].map(({ color, label }) => (
                        <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
                            <Typography variant="caption" fontWeight={700} color="text.secondary">{label}</Typography>
                        </Box>
                    ))}
                    <FormControl size="small">
                        <Select value={range} onChange={(e) => setRange(e.target.value)}
                            sx={{ fontSize: '12px', fontWeight: 700, bgcolor: '#f8fafc', borderRadius: 1.5,
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' }, minWidth: 120 }}>
                            <MenuItem value="30">Last 30 Days</MenuItem>
                            <MenuItem value="90">Last 90 Days</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            <CardContent sx={{ p: 3, height: 360 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor="#15803d" stopOpacity={0.12} />
                                <stop offset="95%" stopColor="#15803d" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="enrGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.12} />
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} dx={-10}
                            tickFormatter={(v) => `$${v}`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#15803d" strokeWidth={2.5}
                            fillOpacity={1} fill="url(#revGrad)"
                            dot={{ r: 4, fill: '#fff', stroke: '#15803d', strokeWidth: 2 }}
                            activeDot={{ r: 6, strokeWidth: 0 }} />
                        <Area type="monotone" dataKey="enrollments" name="Enrollments" stroke="#f59e0b" strokeWidth={2.5}
                            fillOpacity={1} fill="url(#enrGrad)"
                            dot={{ r: 4, fill: '#fff', stroke: '#f59e0b', strokeWidth: 2 }}
                            activeDot={{ r: 6, strokeWidth: 0 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
