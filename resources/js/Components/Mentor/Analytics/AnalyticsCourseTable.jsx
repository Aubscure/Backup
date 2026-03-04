import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    LinearProgress,
    Paper,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount || 0);

const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num || 0);

// ─── Table header columns ─────────────────────────────────────────────────────
const COLUMNS = ['Course', 'Type', 'Enrollments', 'Completion', 'Rating', 'Revenue', 'Certs', 'Trend'];

// ─── Trend icon ───────────────────────────────────────────────────────────────
function TrendIcon({ trend }) {
    if (trend === 'up')   return <TrendingUpIcon   sx={{ color: '#16a34a', fontSize: 20 }} />;
    if (trend === 'down') return <TrendingDownIcon sx={{ color: '#dc2626', fontSize: 20 }} />;
    return <AccessTimeIcon sx={{ color: '#9ca3af', fontSize: 20 }} />;
}

// ─── Desktop table row ────────────────────────────────────────────────────────
function CourseRow({ course }) {
    const isFree = (course.type || '').includes('Free');

    return (
        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
            <td style={{ padding: '12px 16px', fontWeight: 500, maxWidth: 220 }}>
                <Typography
                    variant="body2"
                    fontWeight={500}
                    sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    title={course.title}
                >
                    {course.title}
                </Typography>
            </td>

            <td style={{ padding: '12px 16px' }}>
                <Chip
                    label={course.type}
                    size="small"
                    sx={{
                        bgcolor: isFree ? '#f3f4f6' : '#f0fdf4',
                        color:   isFree ? '#6b7280' : '#166534',
                        fontWeight: 700,
                        fontSize: '0.68rem',
                        borderRadius: 1,
                    }}
                />
            </td>

            <td style={{ padding: '12px 16px' }}>
                <Typography variant="body2">{formatNumber(course.enrollments || 0)}</Typography>
            </td>

            <td style={{ padding: '12px 16px', minWidth: 160 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2" sx={{ minWidth: 34 }}>
                        {course.completion_rate || 0}%
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={course.completion_rate || 0}
                        sx={{
                            flex: 1,
                            height: 7,
                            borderRadius: 1,
                            minWidth: 80,
                            bgcolor: '#e5e7eb',
                            '& .MuiLinearProgress-bar': { bgcolor: '#16a34a' },
                        }}
                    />
                </Stack>
            </td>

            <td style={{ padding: '12px 16px' }}>
                {course.rating > 0 ? (
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <StarIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
                        <Typography variant="body2">{Number(course.rating).toFixed(1)}</Typography>
                        <Typography variant="caption" color="text.secondary">
                            ({course.rating_count || 0})
                        </Typography>
                    </Stack>
                ) : (
                    <Typography variant="body2" color="text.secondary">—</Typography>
                )}
            </td>

            <td style={{ padding: '12px 16px' }}>
                <Typography variant="body2" fontWeight={700}>
                    {formatCurrency(course.revenue || 0)}
                </Typography>
            </td>

            <td style={{ padding: '12px 16px' }}>
                <Typography variant="body2">{formatNumber(course.certificates_issued || 0)}</Typography>
            </td>

            <td style={{ padding: '12px 16px' }}>
                <TrendIcon trend={course.trend} />
            </td>
        </tr>
    );
}

// ─── Mobile card row (xs only) ────────────────────────────────────────────────
function CourseCard({ course }) {
    const isFree = (course.type || '').includes('Free');

    return (
        <Card
            elevation={0}
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'hidden',
            }}
        >
            <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
                {/* ── Title row ── */}
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1} mb={1.25}>
                    <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                            flex: 1,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.4,
                            fontSize: '0.82rem',
                        }}
                    >
                        {course.title}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.75} flexShrink={0}>
                        <Chip
                            label={course.type}
                            size="small"
                            sx={{
                                bgcolor: isFree ? '#f3f4f6' : '#f0fdf4',
                                color:   isFree ? '#6b7280' : '#166534',
                                fontWeight: 700,
                                fontSize: '0.62rem',
                                borderRadius: 1,
                                height: 20,
                            }}
                        />
                        <TrendIcon trend={course.trend} />
                    </Stack>
                </Stack>

                {/* ── Completion bar ── */}
                <Box mb={1.25}>
                    <Stack direction="row" justifyContent="space-between" mb={0.4}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.67rem' }}>
                            Completion
                        </Typography>
                        <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.67rem' }}>
                            {course.completion_rate || 0}%
                        </Typography>
                    </Stack>
                    <LinearProgress
                        variant="determinate"
                        value={course.completion_rate || 0}
                        sx={{
                            height: 6,
                            borderRadius: 1,
                            bgcolor: '#e5e7eb',
                            '& .MuiLinearProgress-bar': { bgcolor: '#16a34a' },
                        }}
                    />
                </Box>

                {/* ── Stats row: 4 metrics in a 2×2 grid ── */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 0.75,
                    }}
                >
                    {/* Enrollments */}
                    <Box sx={{ bgcolor: '#f9fafb', borderRadius: 1.5, p: 0.75 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem', display: 'block' }}>
                            Enrollments
                        </Typography>
                        <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.78rem' }}>
                            {formatNumber(course.enrollments || 0)}
                        </Typography>
                    </Box>

                    {/* Revenue */}
                    <Box sx={{ bgcolor: '#f0fdf4', borderRadius: 1.5, p: 0.75 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem', display: 'block' }}>
                            Revenue
                        </Typography>
                        <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.78rem', color: '#166534' }}>
                            {formatCurrency(course.revenue || 0)}
                        </Typography>
                    </Box>

                    {/* Rating */}
                    <Box sx={{ bgcolor: '#f9fafb', borderRadius: 1.5, p: 0.75 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem', display: 'block' }}>
                            Rating
                        </Typography>
                        {course.rating > 0 ? (
                            <Stack direction="row" alignItems="center" spacing={0.4}>
                                <StarIcon sx={{ fontSize: 12, color: '#f59e0b' }} />
                                <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.78rem' }}>
                                    {Number(course.rating).toFixed(1)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem' }}>
                                    ({course.rating_count || 0})
                                </Typography>
                            </Stack>
                        ) : (
                            <Typography variant="caption" color="text.secondary">—</Typography>
                        )}
                    </Box>

                    {/* Certificates */}
                    <Box sx={{ bgcolor: '#f9fafb', borderRadius: 1.5, p: 0.75 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem', display: 'block' }}>
                            Certificates
                        </Typography>
                        <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.78rem' }}>
                            {formatNumber(course.certificates_issued || 0)}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

// ─── Exported component ───────────────────────────────────────────────────────
/**
 * AnalyticsCourseTable
 *
 * xs  → card-based list (no horizontal scrolling, all data visible)
 * sm+ → original scrollable table
 *
 * @param {Array}  [courses=[]]  - Array of course performance objects from the controller
 */
export default function AnalyticsCourseTable({ courses = [] }) {
    const theme = useTheme();
    const isXs  = useMediaQuery(theme.breakpoints.only('xs'));

    return (
        <Paper
            elevation={0}
            sx={{
                border: '1px solid', borderColor: 'divider',
                borderRadius: 2.5, overflow: 'hidden',
                // ── removed the incorrect mt:8 — spacing is handled by the parent Section
            }}
        >
            {/* ── Panel header ── */}
            <Box sx={{
                px: { xs: 2, sm: 3 },
                py: { xs: 1.75, sm: 2.5 },
                borderBottom: '1px solid', borderColor: 'divider',
            }}>
                <Typography variant="subtitle1" fontWeight={700}
                    sx={{ fontSize: { xs: '0.875rem', sm: undefined } }}
                >
                    Course Performance Analytics
                </Typography>
                <Typography variant="caption" color="text.secondary"
                    sx={{ fontSize: { xs: '0.7rem', sm: undefined } }}
                >
                    Top courses by revenue
                </Typography>
            </Box>

            {/* ════════════════════════════════════════════════════════
                xs — card list
                ════════════════════════════════════════════════════════ */}
            {isXs && (
                <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                    {courses.length > 0 ? (
                        courses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))
                    ) : (
                        <Box sx={{ py: 5, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                No course performance data available yet.
                            </Typography>
                        </Box>
                    )}
                </Box>
            )}

            {/* ════════════════════════════════════════════════════════
                sm+ — original scrollable table
                ════════════════════════════════════════════════════════ */}
            {!isXs && (
                <Box sx={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb' }}>
                                {COLUMNS.map((h) => (
                                    <th
                                        key={h}
                                        style={{
                                            textAlign: 'left',
                                            padding: '10px 16px',
                                            fontWeight: 700,
                                            fontSize: '0.7rem',
                                            textTransform: 'uppercase',
                                            color: '#6b7280',
                                            borderBottom: '2px solid #e5e7eb',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {courses.length > 0 ? (
                                courses.map((course) => (
                                    <CourseRow key={course.id} course={course} />
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={COLUMNS.length}
                                        style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}
                                    >
                                        No course performance data available yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </Box>
            )}

            <Divider />

            {/* Footer */}
            <Box sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
                <Typography variant="caption" color="text.secondary"
                    sx={{ fontSize: { xs: '0.68rem', sm: undefined } }}
                >
                    Showing top {Math.min(courses.length, 5)} courses by revenue.
                </Typography>
            </Box>
        </Paper>
    );
}
