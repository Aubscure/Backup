import { Box, Card, CardContent, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ANALYTICS_CHART_COLORS, DEFAULT_STATUS_BREAKDOWN } from '@/Utils/analyticsUtils';

// ─── Object-key → display config ──────────────────────────────────────────────
const KEY_MAP = {
    ongoing:   { label: 'Ongoing',   color: ANALYTICS_CHART_COLORS.ongoing   },
    pending:   { label: 'Pending',   color: ANALYTICS_CHART_COLORS.pending   },
    graduated: { label: 'Graduated', color: ANALYTICS_CHART_COLORS.graduated },
    inactive:  { label: 'Inactive',  color: ANALYTICS_CHART_COLORS.inactive  },
};
const FALLBACK_COLORS = Object.values(ANALYTICS_CHART_COLORS).filter(
    (v) => typeof v === 'string' && v.startsWith('#'),
);

function normaliseData(raw) {
    if (!raw) return null;
    if (Array.isArray(raw)) return raw.length ? raw : null;
    const entries = Object.entries(raw).map(([key, value], idx) => ({
        label: KEY_MAP[key]?.label ?? key.charAt(0).toUpperCase() + key.slice(1),
        value: Number(value) || 0,
        color: KEY_MAP[key]?.color ?? FALLBACK_COLORS[idx % FALLBACK_COLORS.length],
    }));
    return entries;
}

function resolveData(raw) {
    const normalised = normaliseData(raw);
    if (!normalised) return DEFAULT_STATUS_BREAKDOWN;
    const hasValues = normalised.some((d) => d.value > 0);
    return hasValues ? normalised : DEFAULT_STATUS_BREAKDOWN;
}

// ─── Custom tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    const { label, value, color } = payload[0].payload;
    const total = payload[0].payload.__total;
    const pct = total ? ((value / total) * 100).toFixed(1) : 0;
    return (
        <Box
            sx={{
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                p: 1.5,
                boxShadow: 4,
                minWidth: 130,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
                <Typography variant="caption" fontWeight={700} color="text.primary">
                    {label}
                </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" display="block">
                {value.toLocaleString()} learners
            </Typography>
            <Typography variant="caption" color="text.secondary">
                {pct}% of total
            </Typography>
        </Box>
    );
}

// ─── Donut with total overlaid in the hole ────────────────────────────────────
function DonutWithCenter({ enriched, total, height = 200 }) {
    return (
        <Box sx={{ position: 'relative', width: '100%', height }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={enriched}
                        dataKey="value"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        innerRadius="55%"
                        outerRadius="80%"
                        paddingAngle={2}
                        strokeWidth={0}
                    >
                        {enriched.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>

            {/* Total number lives inside the donut hole on mobile */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    pointerEvents: 'none',
                    userSelect: 'none',
                }}
            >
                <Typography
                    component="div"
                    fontWeight={700}
                    sx={{ fontSize: '1.1rem', lineHeight: 1 }}
                >
                    {total.toLocaleString()}
                </Typography>
                <Typography
                    component="div"
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: '0.6rem', lineHeight: 1.4 }}
                >
                    Total
                </Typography>
            </Box>
        </Box>
    );
}

// ─── Legend: adapts to layout prop ────────────────────────────────────────────
//  'column' → original single-column list          (md+)
//  'grid'   → 2×2 card grid                        (xs)
//  'stack'  → single column inside sm side panel   (sm)
function ChartLegend({ data, layout = 'column' }) {
    const total = data.reduce((s, d) => s + d.value, 0);
    const isGrid = layout === 'grid';
    const isStack = layout === 'stack';

    return (
        <Box
            sx={
                isGrid
                    ? { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 1.5 }
                    : {
                          display: 'flex',
                          flexDirection: 'column',
                          gap: isStack ? 0.75 : 1,
                          mt: isStack ? 0 : 2,
                          flex: isStack ? 1 : undefined,
                          justifyContent: isStack ? 'center' : undefined,
                      }
            }
        >
            {data.map((item) => {
                const pct = total ? ((item.value / total) * 100).toFixed(1) : '0.0';

                if (isGrid) {
                    return (
                        <Box
                            key={item.label}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0.4,
                                bgcolor: 'action.hover',
                                borderRadius: 2,
                                p: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                                transition: 'background-color 0.15s ease, box-shadow 0.15s ease',
                                '&:active': {
                                    bgcolor: 'action.selected',
                                    boxShadow: `0 0 0 2px ${item.color}44`,
                                },
                            }}
                        >
                            {/* dot + label */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                <Box
                                    sx={{
                                        width: 8, height: 8,
                                        borderRadius: '50%',
                                        bgcolor: item.color,
                                        flexShrink: 0,
                                        boxShadow: `0 0 0 2.5px ${item.color}28`,
                                    }}
                                />
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.67rem' }}>
                                    {item.label}
                                </Typography>
                            </Box>
                            {/* value + pct */}
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                                <Typography fontWeight={700} sx={{ fontSize: '0.9rem', lineHeight: 1 }}>
                                    {item.value.toLocaleString()}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                    {pct}%
                                </Typography>
                            </Box>
                        </Box>
                    );
                }

                // row layout (column / stack)
                return (
                    <Box
                        key={item.label}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 1,
                            ...(isStack && {
                                borderRadius: 1.5,
                                px: 1,
                                py: 0.5,
                                transition: 'background-color 0.15s ease',
                                '&:hover': { bgcolor: 'action.hover' },
                            }),
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                                sx={{
                                    width: isStack ? 12 : 10,
                                    height: isStack ? 12 : 10,
                                    borderRadius: '50%',
                                    bgcolor: item.color,
                                    flexShrink: 0,
                                    boxShadow: isStack ? `0 0 0 3px ${item.color}22` : 'none',
                                }}
                            />
                            <Typography variant="caption" color="text.secondary"
                                sx={{ fontSize: isStack ? '0.72rem' : undefined }}
                            >
                                {item.label}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption" fontWeight={700}
                                sx={{ fontSize: isStack ? '0.72rem' : undefined }}
                            >
                                {item.value.toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary"
                                sx={{ minWidth: 36, textAlign: 'right', fontSize: isStack ? '0.72rem' : undefined }}
                            >
                                {pct}%
                            </Typography>
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
}

// ─── Exported component ────────────────────────────────────────────────────────
/**
 * AnalyticsStatusBreakdown
 *
 * Recharts PieChart (donut) showing enrollees by status.
 * Responsive layouts:
 *   xs  → donut (total inside hole) stacked above 2×2 card grid legend
 *   sm  → donut on left  |  legend list on right
 *   md+ → original layout (donut → total below → single-col legend)
 *
 * @param {Array|Object} [data]
 *   - Array:  [{ label, value, color? }, ...]
 *   - Object: { ongoing: n, pending: n, graduated: n, inactive: n }
 */
export default function AnalyticsStatusBreakdown({ data }) {
    const theme    = useTheme();
    const isXs     = useMediaQuery(theme.breakpoints.only('xs'));
    const isSm     = useMediaQuery(theme.breakpoints.only('sm'));
    const isMobile = isXs || isSm;

    const chartData = resolveData(data);
    const total     = chartData.reduce((s, d) => s + d.value, 0);
    const enriched  = chartData.map((d) => ({ ...d, __total: total }));

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
                    py: { xs: 1.5, sm: 1.75, md: 2 },
                    borderBottom: '1px solid', borderColor: 'divider',
                    bgcolor: 'background.paper',
                }}
            >
                <Typography variant="subtitle1" fontWeight={700} color="text.primary"
                    sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem', md: undefined } }}
                >
                    Status Breakdown
                </Typography>
                <Typography variant="caption" color="text.secondary"
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.72rem', md: undefined } }}
                >
                    All enrollees by status
                </Typography>
            </Box>

            {/* ── Chart body ──────────────────────────────────────────── */}
            <CardContent
                sx={{
                    p: { xs: 2, sm: 2, md: 3 },
                    '&:last-child': { pb: { xs: 2, sm: 2, md: 3 } },
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >

                {/* ════════════════════════════════════════════════════════
                    xs  — donut (total in hole) stacked above 2-col grid
                    ════════════════════════════════════════════════════════ */}
                {isXs && (
                    <>
                        <DonutWithCenter enriched={enriched} total={total} height={165} />
                        <ChartLegend data={chartData} layout="grid" />
                    </>
                )}

                {/* ════════════════════════════════════════════════════════
                    sm  — donut left | legend list right
                    ════════════════════════════════════════════════════════ */}
                {isSm && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                        <Box sx={{ flexShrink: 0, width: 155 }}>
                            <DonutWithCenter enriched={enriched} total={total} height={155} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <ChartLegend data={chartData} layout="stack" />
                        </Box>
                    </Box>
                )}

                {/* ════════════════════════════════════════════════════════
                    md+ — original layout, completely untouched
                    ════════════════════════════════════════════════════════ */}
                {!isMobile && (
                    <>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={enriched}
                                    dataKey="value"
                                    nameKey="label"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="55%"
                                    outerRadius="80%"
                                    paddingAngle={2}
                                    strokeWidth={0}
                                >
                                    {enriched.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>

                        <Box sx={{ textAlign: 'center', mt: -1, mb: 1 }}>
                            <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1 }}>
                                {total.toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Total Enrollees
                            </Typography>
                        </Box>

                        <ChartLegend data={chartData} layout="column" />
                    </>
                )}

            </CardContent>
        </Card>
    );
}
