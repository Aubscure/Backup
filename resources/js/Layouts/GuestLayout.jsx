import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { Box, Container, Paper } from '@mui/material';

export default function GuestLayout({ children }) {
    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: 'grey.100',
                pt: 3,
                justifyContent: { sm: 'center' },
            }}
        >
            <Box>
                <Link href="/">
                    <ApplicationLogo style={{ height: 80, width: 80, color: '#6b7280' }} />
                </Link>
            </Box>

            <Paper
                elevation={3}
                sx={{
                    mt: 3,
                    width: '100%',
                    maxWidth: 448,
                    overflow: 'hidden',
                    px: 3,
                    py: 2,
                    borderRadius: 2,
                }}
            >
                {children}
            </Paper>
        </Box>
    );
}
