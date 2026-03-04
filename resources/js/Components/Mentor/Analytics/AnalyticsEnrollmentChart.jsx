import { useState } from 'react';
import { Box, Card, CardContent, FormControl, MenuItem, Select, Typography, useMediaQuery, useTheme } from '@mui/material';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { ANALYTICS_CHART_COLORS, DEFAULT_ENROLLMENT_TRENDS } from '@/Utils/analyticsUtils';

// ─── Normalise controller data ─────────────────────────────────────────────────
const normalizeKeys = (arr) =>
    arr.map((d) => ({ ...d, name: d.name ?? d.month ?? '' }));

const resolveData = (data) => {
    if (!data || data.length === 0) return DEFAULT_ENROLLMENT_TRENDS;
    const hasValues = data.some(
        (d) => (d.graduated || 0) + (d.ongoing || 0) + (d.pending || 0) > 0
    );
    return hasValues ? normalizeKeys(data) : DEFAULT_ENROLLMENT_TRENDS;
};

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
                minWidth: 140,
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
                        {entry.value.toLocaleString()}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
}

// ─── Series config ─────────────────────────────────────────────────────────────
const SERIES = [
    { key: 'pending',   label: 'Pending',   color: ANALYTICS_CHART_COLORS.pending   },
    { key: 'ongoing',   label: 'Ongoing',   color: ANALYTICS_CHART_COLORS.ongoing   },
    { key: 'graduated', label: 'Graduated', color: ANALYTICS_CHART_COLORS.graduated },
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
 * AnalyticsEnrollmentChart
 *
 * xs  → header stacks: title/subtitle → legend row → range selector (full-width)
 * sm+ → original side-by-side header layout
 *
 * @param {Array} [data] - Array of { name, graduated, ongoing, pending }
 */
export default function AnalyticsEnrollmentChart({ data }) {
    const chartData = resolveData(data);
    const [range, setRange] = useState('6');
    const isEmpty = !chartData || chartData.length === 0;

    const theme = useTheme();
    const isXs  = useMediaQuery(theme.breakpoints.only('xs'));

    // ── Responsive chart height: shorter on mobile so it fits without scrolling
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
                {/* ── xs: full stacked header ── */}
                {isXs ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {/* Title row */}
                        <Box>
                            <Typography variant="subtitle1" fontWeight={700} color="text.primary"
                                sx={{ fontSize: '0.875rem' }}
                            >
                                Enrollment Trends
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                Monthly breakdown by status
                            </Typography>
                        </Box>

                        {/* Legend + selector on same row, legend left, selector right */}
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
                    /* ── sm+: original side-by-side header ── */
                    <Box sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        flexWrap: 'wrap', gap: 1.5,
                    }}>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                                Enrollment Trends
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Monthly breakdown by status
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
                            No enrollment data available yet.
                        </Typography>
                    </Box>
                ) : (
                    <ResponsiveContainer width="100%" height={chartHeight}>
                        <BarChart
                            data={chartData}
                            margin={{ top: 10, right: 4, left: isXs ? -18 : 0, bottom: 0 }}
                            barCategoryGap="35%"
                        >
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
                                allowDecimals={false}
                                width={isXs ? 28 : 40}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />

                            {SERIES.map(({ key, label, color }, idx) => (
                                <Bar
                                    key={key}
                                    dataKey={key}
                                    name={label}
                                    stackId="status"
                                    fill={color}
                                    radius={idx === SERIES.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
