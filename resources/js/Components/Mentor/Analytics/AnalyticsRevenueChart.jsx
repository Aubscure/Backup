import { useState } from 'react';
import { Box, Card, CardContent, FormControl, MenuItem, Select, Typography, useMediaQuery, useTheme } from '@mui/material';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { ANALYTICS_CHART_COLORS, DEFAULT_ANALYTICS_REVENUE_TRENDS } from '@/Utils/analyticsUtils';

// ─── Normalise controller data ─────────────────────────────────────────────────
const normalizeKeys = (arr) =>
    arr.map((d) => ({ ...d, name: d.name ?? d.month ?? '' }));

const resolveData = (data) => {
    if (!data || data.length === 0) return DEFAULT_ANALYTICS_REVENUE_TRENDS;
    const hasValues = data.some(
        (d) => (d.individual || 0) + (d.organization || 0) > 0
    );
    return hasValues ? normalizeKeys(data) : DEFAULT_ANALYTICS_REVENUE_TRENDS;
};

// ─── Currency formatter (PHP) ──────────────────────────────────────────────────
const formatPHP = (value) =>
    new Intl.NumberFormat('en-PH', {
        style: 'currency', currency: 'PHP',
        minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(value || 0);

// ─── Custom tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <Box
            sx={{
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                p: 1.5,
                boxShadow: 4,
                minWidth: 160,
            }}
        >
            <Typography variant="caption" fontWeight={700} display="block" mb={0.75} color="text.secondary">
                {label}
            </Typography>
            {payload.map((entry) => (
                <Box key={entry.name} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: entry.color, flexShrink: 0 }} />
                    <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
                        {entry.name}:
                    </Typography>
                    <Typography variant="caption" fontWeight={700} color="text.primary">
                        {formatPHP(entry.value)}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
}

// ─── Series config ─────────────────────────────────────────────────────────────
const SERIES = [
    { key: 'individual',   label: 'Individual',   color: ANALYTICS_CHART_COLORS.individual,   gradId: 'indGrad'  },
    { key: 'organization', label: 'Organization', color: ANALYTICS_CHART_COLORS.organization, gradId: 'orgGrad'  },
];

// ─── Inline legend strip ───────────────────────────────────────────────────────
function LegendStrip() {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 }, flexWrap: 'wrap' }}>
            {SERIES.map(({ color, label }) => (
                <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
                    <Typography variant="caption" fontWeight={700} color="text.secondary"
                        sx={{ fontSize: { xs: '0.68rem', sm: undefined } }}
                    >
                        {label}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
}

// ─── Exported component ────────────────────────────────────────────────────────
/**
 * AnalyticsRevenueChart
 *
 * xs  → stacked header: title → legend + selector on same row
 * sm+ → original side-by-side header layout
 *
 * @param {Array} [data] - Array of { name, individual, organization }
 */
export default function AnalyticsRevenueChart({ data }) {
    const chartData = resolveData(data);
    const [range, setRange] = useState('6');
    const isEmpty = !chartData || chartData.length === 0;

    const theme = useTheme();
    const isXs  = useMediaQuery(theme.breakpoints.only('xs'));

    const chartHeight = isXs ? 210 : 300;

    return (
        <Card
            elevation={0}
            sx={{
                border: '1px solid', borderColor: 'divider', borderRadius: 2,
                overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column',
            }}
        >
            {/* ── Header ─────────────────────────────────────────────── */}
            <Box
                sx={{
                    px: { xs: 2, sm: 2.5, md: 3 },
                    py: { xs: 1.5, sm: 2 },
                    borderBottom: '1px solid', borderColor: 'divider',
                    bgcolor: 'background.paper',
                }}
            >
                {isXs ? (
                    /* ── xs: stacked ── */
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={700} color="text.primary"
                                sx={{ fontSize: '0.875rem' }}
                            >
                                Revenue Trends
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                Individual vs Organization
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                            <LegendStrip />
                            <FormControl size="small" sx={{ flexShrink: 0 }}>
                                <Select
                                    value={range}
                                    onChange={(e) => setRange(e.target.value)}
                                    sx={{
                                        fontSize: '11px', fontWeight: 700,
                                        bgcolor: '#f8fafc', borderRadius: 1.5,
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
                                        minWidth: 110,
                                    }}
                                >
                                    <MenuItem value="3">Last 3 Mo.</MenuItem>
                                    <MenuItem value="6">Last 6 Mo.</MenuItem>
                                    <MenuItem value="12">Last 12 Mo.</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                ) : (
                    /* ── sm+: original ── */
                    <Box sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        flexWrap: 'wrap', gap: 1.5,
                    }}>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                                Revenue Trends
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Individual vs Organization
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <LegendStrip />
                            <FormControl size="small">
                                <Select
                                    value={range}
                                    onChange={(e) => setRange(e.target.value)}
                                    sx={{
                                        fontSize: '12px', fontWeight: 700, bgcolor: '#f8fafc', borderRadius: 1.5,
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
                                        minWidth: 130,
                                    }}
                                >
                                    <MenuItem value="3">Last 3 Months</MenuItem>
                                    <MenuItem value="6">Last 6 Months</MenuItem>
                                    <MenuItem value="12">Last 12 Months</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                )}
            </Box>

            {/* ── Chart body ──────────────────────────────────────────── */}
            <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 }, flex: 1 }}>
                {isEmpty ? (
                    <Box sx={{ height: chartHeight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            No revenue data available yet.
                        </Typography>
                    </Box>
                ) : (
                    <ResponsiveContainer width="100%" height={chartHeight}>
                        <AreaChart
                            data={chartData}
                            margin={{ top: 10, right: 4, left: isXs ? -10 : 0, bottom: 0 }}
                        >
                            <defs>
                                {SERIES.map(({ color, gradId }) => (
                                    <linearGradient key={gradId} id={gradId} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor={color} stopOpacity={0.12} />
                                        <stop offset="95%" stopColor={color} stopOpacity={0}    />
                                    </linearGradient>
                                ))}
                            </defs>

                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={ANALYTICS_CHART_COLORS.grid} />
                            <XAxis
                                dataKey="name"
                                axisLine={false} tickLine={false}
                                tick={{ fill: ANALYTICS_CHART_COLORS.axis, fontSize: isXs ? 10 : 12, fontWeight: 500 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false} tickLine={false}
                                tick={{ fill: ANALYTICS_CHART_COLORS.axis, fontSize: isXs ? 10 : 12, fontWeight: 500 }}
                                dx={-10}
                                width={isXs ? 38 : 48}
                                tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}K`}
                            />
                            <Tooltip content={<CustomTooltip />} />

                            {SERIES.map(({ key, label, color, gradId }) => (
                                <Area
                                    key={key}
                                    type="monotone"
                                    dataKey={key}
                                    name={label}
                                    stroke={color}
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill={`url(#${gradId})`}
                                    dot={{ r: isXs ? 3 : 4, fill: '#fff', stroke: color, strokeWidth: 2 }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
