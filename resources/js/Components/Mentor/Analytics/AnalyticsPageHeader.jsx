import { Box, Button, Stack, Typography } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

/**
 * AnalyticsPageHeader
 *
 * Top bar with title, live-update badge, and export button.
 * xs  → stacked, export button full-width
 * sm+ → side-by-side (original)
 *
 * @param {function} [onExport] - Callback for the Export Report button
 */
export default function AnalyticsPageHeader({ onExport }) {
    return (
        <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', sm: 'center' }}
            flexWrap="wrap"
            gap={{ xs: 1.5, sm: 2 }}
        >
            {/* Title block */}
            <Box>
                <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{
                        color: '#111827',
                        lineHeight: 1.2,
                        // ── xs: slightly smaller so it doesn't crowd the page
                        fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
                    }}
                >
                    Analytics Dashboard
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: 'text.secondary',
                        mt: 0.5,
                        fontSize: { xs: '0.78rem', sm: '0.875rem' },
                    }}
                >
                    Comprehensive insights into your mentoring performance and revenue.
                </Typography>
            </Box>

            {/* Actions */}
            <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                flexWrap="wrap"
                // ── xs: button spans full width; sm+: auto width
                sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<FileDownloadIcon />}
                    onClick={onExport}
                    fullWidth
                    sx={{
                        // ── xs: full width feels intentional; sm+: shrinks back to content width
                        maxWidth: { xs: '100%', sm: 'none' },
                        bgcolor: '#16a34a',
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: 1.5,
                        px: { xs: 2, sm: 2 },
                        py: { xs: 1, sm: 0.75 },
                        boxShadow: 'none',
                        '&:hover': {
                            bgcolor: '#15803d',
                            boxShadow: '0 2px 8px rgba(22,163,74,0.35)',
                        },
                    }}
                >
                    Export Report
                </Button>
            </Stack>
        </Stack>
    );
}
