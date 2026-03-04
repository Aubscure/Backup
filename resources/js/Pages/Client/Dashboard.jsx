import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import ClientSidebar from '@/Components/Client/ClientSidebar';
import {
    Box,
    Typography,
    Paper,
    InputBase,
    Stack,
    IconButton,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const SIDEBAR_WIDTH = 240;

export default function ClientDashboard() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <>
            <Head title="Client Dashboard" />
            <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
                <ClientSidebar activePage="dashboard" mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
                <Box sx={{ ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` }, transition: theme.transitions.create('margin') }}>
                    <Paper square elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'white', position: 'sticky', top: 0, zIndex: 1100 }}>
                        <Box sx={{ display: 'flex', height: 64, alignItems: 'center', justifyContent: 'space-between', px: { xs: 2, sm: 3, lg: 4 } }}>
                            <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2, display: { md: 'none' } }}>
                                <MenuIcon />
                            </IconButton>
                            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'grey.100', borderRadius: 50, px: 2, py: 0.75, width: { xs: '100%', sm: 320 }, maxWidth: { xs: 'calc(100% - 100px)', sm: 320 }, mx: { xs: 1, sm: 'auto' } }}>
                                <SearchIcon sx={{ color: 'grey.400', mr: 1, fontSize: 20 }} />
                                <InputBase placeholder="Search for skills, mentors, or topics..." sx={{ fontSize: '0.875rem', flex: 1 }} />
                            </Box>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ ml: 'auto' }}>
                                <Typography variant="body2" fontWeight={500} sx={{ color: 'text.secondary', display: { xs: 'none', md: 'block' } }}>ManPro Learning Hub</Typography>
                                <Box sx={{ position: 'relative', cursor: 'pointer' }}><NotificationsNoneIcon sx={{ color: 'grey.500' }} /></Box>
                            </Stack>
                        </Box>
                    </Paper>
                    <Box sx={{ p: { xs: 2, sm: 3, lg: 4 }, maxWidth: 1200, mx: 'auto' }}>
                        <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>Client Dashboard</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>Welcome to your organization&apos;s learning hub. Manage licenses and assignments from the Library and Assignments pages.</Typography>
                        <Stack direction="row" flexWrap="wrap" spacing={2}>
                            <Paper component={Link} href={route('client.library')} elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', textDecoration: 'none', color: 'inherit', minWidth: 200, '&:hover': { borderColor: 'success.main', bgcolor: 'success.50' } }}>
                                <Typography variant="subtitle1" fontWeight={700}>Library</Typography>
                                <Typography variant="body2" color="text.secondary">Manage course licenses and purchase more.</Typography>
                            </Paper>
                            <Paper component={Link} href={route('client.assignments')} elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', textDecoration: 'none', color: 'inherit', minWidth: 200, '&:hover': { borderColor: 'success.main', bgcolor: 'success.50' } }}>
                                <Typography variant="subtitle1" fontWeight={700}>Assignments</Typography>
                                <Typography variant="body2" color="text.secondary">Assign courses to employees.</Typography>
                            </Paper>
                        </Stack>
                    </Box>
                </Box>
            </Box>
        </>
    );
}
