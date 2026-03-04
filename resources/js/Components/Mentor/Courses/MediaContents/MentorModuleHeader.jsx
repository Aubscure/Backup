import { Box, Typography, Stack, Chip, Button } from '@mui/material';
import { router } from '@inertiajs/react';

export default function MentorModuleHeader({ module, courseId, getModuleSummary }) {
    return (
        <Box
            sx={{
                p: 3,
                bgcolor: 'grey.50',
                borderBottom: 1,
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                    {module.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {getModuleSummary(module)}
                </Typography>
            </Box>
            <Stack direction="row" spacing={2} alignItems="center">
                <Chip
                    label={module.status === 'in_progress' ? 'In Progress' : 'Draft'}
                    size="small"
                    sx={{
                        bgcolor: module.status === 'in_progress' ? 'warning.light' : 'grey.300',
                        color: module.status === 'in_progress' ? 'warning.dark' : 'text.secondary',
                        fontWeight: 500,
                    }}
                />
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => router.post(route('mentor.courses.media-content.save', courseId), {}, { preserveScroll: true })}
                    sx={{
                        bgcolor: 'success.main',
                        '&:hover': { bgcolor: 'success.dark' },
                        textTransform: 'none',
                        fontWeight: 500,
                    }}
                >
                    Save Changes
                </Button>
            </Stack>
        </Box>
    );
}
