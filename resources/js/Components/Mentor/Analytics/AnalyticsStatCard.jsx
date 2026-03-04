import { Box, Card, CardContent, Stack, Tooltip, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

/**
 * AnalyticsStatCard
 *
 * xs  → reduced padding, smaller icon, subtitle truncated with tooltip
 * sm+ → original layout
 *
 * @param {string}  title       - Card label (uppercase)
 * @param {*}       value       - Primary displayed value
 * @param {string}  [subtitle]  - Secondary text below value
 * @param {node}    icon        - MUI icon element
 * @param {string}  [iconBg]    - Background colour for icon circle
 * @param {'up'|'down'} [trend] - Direction of the trend indicator
 * @param {string}  [trendValue]- Human-readable trend text
 */
export default function AnalyticsStatCard({
    title,
    value,
    subtitle,
    icon,
    iconBg = '#f0fdf4',
    trend,
    trendValue,
}) {
    const isUp = trend === 'up';

    return (
        <Card
            elevation={0}
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2.5,
                height: '100%',
                width: '100%',
                minWidth: 0,          // ← ADD THIS
                overflow: 'hidden',   // ← ADD THIS
                transition: 'box-shadow 0.2s, transform 0.2s',
                '&:hover': {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transform: 'translateY(-2px)',
                },
            }}
        >
            <CardContent
                sx={{
                    // ── xs: tighter padding so 2-col grid doesn't feel cramped
                    p: { xs: 1.75, sm: 2, md: 2.5 },
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    '&:last-child': { pb: { xs: 1.75, sm: 2, md: 2.5 } },
                }}
            >
                {/* Top row: text + icon */}
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="caption"
                            sx={{
                                textTransform: 'uppercase',
                                letterSpacing: '0.06em',
                                // ── xs: slightly smaller label so nothing clips
                                fontSize: { xs: '0.62rem', sm: '0.65rem', md: '0.68rem' },
                                color: 'text.secondary',
                                display: 'block',
                            }}
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight={700}
                            sx={{
                                mt: 0.5, mb: 0.25,
                                wordBreak: 'break-word',
                                lineHeight: 1.2,
                                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
                            }}
                        >
                            {value}
                        </Typography>

                        {subtitle && (
                            // ── xs: single line with tooltip; sm+: wraps naturally
                            <Tooltip title={subtitle} placement="bottom" arrow enterDelay={400}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: { xs: '0.66rem', sm: '0.7rem', md: '0.72rem' },
                                        display: 'block',
                                        lineHeight: 1.4,
                                        // xs: clamp to 2 lines so cards stay uniform height
                                        overflow: 'hidden',
                                        display: '-webkit-box',
                                        WebkitLineClamp: { xs: 2, sm: 3 },
                                        WebkitBoxOrient: 'vertical',
                                    }}
                                >
                                    {subtitle}
                                </Typography>
                            </Tooltip>
                        )}
                    </Box>

                    <Box
                        sx={{
                            // ── xs: shrink icon circle so it doesn't eat card width
                            width:  { xs: 36, sm: 40, md: 46 },
                            height: { xs: 36, sm: 40, md: 46 },
                            borderRadius: '50%',
                            bgcolor: iconBg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        {/* Clone the icon with a smaller fontSize on xs */}
                        <Box sx={{ '& .MuiSvgIcon-root': { fontSize: { xs: 18, sm: 20, md: 22 } } }}>
                            {icon}
                        </Box>
                    </Box>
                </Stack>

                {/* Trend badge */}
                {trendValue && (
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.5}
                        sx={{ mt: 'auto', pt: 1.25 }}
                    >
                        {isUp
                            ? <TrendingUpIcon   sx={{ fontSize: { xs: 13, md: 15 }, color: '#16a34a' }} />
                            : <TrendingDownIcon sx={{ fontSize: { xs: 13, md: 15 }, color: '#dc2626' }} />
                        }
                        <Typography
                            variant="caption"
                            sx={{
                                color: isUp ? '#16a34a' : '#dc2626',
                                fontWeight: 600,
                                fontSize: { xs: '0.66rem', md: undefined },
                            }}
                        >
                            {trendValue}
                        </Typography>
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
}
