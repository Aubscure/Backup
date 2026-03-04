import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import SignOutModal from '@/Components/SignOutModal';
import manproLogo from '../../../images/manprologo.svg';
import {
    Box,
    Typography,
    Avatar,
    Button,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Drawer,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LogoutIcon from '@mui/icons-material/Logout';

export default function ClientSidebar({ activePage = 'dashboard', mobileOpen, onMobileClose }) {
    const { auth } = usePage().props;
    const user = auth?.user ?? {};
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [signOutOpen, setSignOutOpen] = useState(false);

    const quickActions = [
        { label: 'Dashboard', icon: <DashboardIcon fontSize="small" />, key: 'dashboard', href: route('client.dashboard') },
        { label: 'Library', icon: <MenuBookIcon fontSize="small" />, key: 'library', href: route('client.library') },
        { label: 'Workforce', icon: <PeopleIcon fontSize="small" />, key: 'workforce', href: '#' },
        { label: 'Assignments', icon: <AssignmentIcon fontSize="small" />, key: 'assignments', href: route('client.assignments') },
        { label: 'Analytics', icon: <BarChartIcon fontSize="small" />, key: 'analytics', href: '#' },
        { label: 'Settings', icon: <SettingsIcon fontSize="small" />, key: 'settings', href: '#' },
    ];

    const sidebarContent = (
        <Box sx={{ height: '100%', width: 240, bgcolor: 'background.paper', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <img src={manproLogo} alt="ManPro Logo" style={{ height: 36, width: 'auto' }} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3, px: 2 }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: '#e8f5e9', border: '3px solid #c8e6c9', mb: 1.5 }}>
                    <PeopleIcon sx={{ fontSize: 44, color: '#81c784' }} />
                </Avatar>
                <Typography variant="subtitle1" fontWeight={700} sx={{ color: 'text.primary' }}>
                    {user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : 'Doe Jane'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.25 }}>Client</Typography>
            </Box>
            <Box>
                <Box sx={{ px: 2.5, pt: 1, pb: 0.5 }}>
                    <Typography variant="caption" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary', fontSize: '0.7rem' }}>
                        Quick Actions
                    </Typography>
                </Box>
                <List dense disablePadding>
                    {quickActions.map((item) => (
                        <ListItemButton
                            key={item.key}
                            component={Link}
                            href={item.href}
                            selected={activePage === item.key}
                            onClick={isMobile ? onMobileClose : undefined}
                            sx={{
                                px: 2.5,
                                py: 0.75,
                                '&.Mui-selected': { bgcolor: '#f0fdf4', borderRight: '3px solid', borderColor: 'success.main', '&:hover': { bgcolor: '#dcfce7' } },
                                '&:hover': { bgcolor: 'grey.50' },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 36, color: activePage === item.key ? 'success.main' : 'text.secondary' }}>{item.icon}</ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: activePage === item.key ? 600 : 400, color: activePage === item.key ? 'success.main' : 'text.primary' }}
                            />
                        </ListItemButton>
                    ))}
                </List>
            </Box>
            <Box sx={{ mt: 1 }}>
                <Box sx={{ px: 2.5, pt: 2, pb: 0.5 }}>
                    <Typography variant="caption" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary', fontSize: '0.7rem' }}>Support</Typography>
                </Box>
                <List dense disablePadding>
                    <ListItemButton sx={{ px: 2.5, py: 0.75, '&:hover': { bgcolor: 'grey.50' } }}>
                        <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}><HelpOutlineIcon fontSize="small" /></ListItemIcon>
                        <ListItemText primary="Help Center" primaryTypographyProps={{ fontSize: '0.875rem' }} />
                    </ListItemButton>
                </List>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ px: 2, py: 1.5 }}>
                <Paper elevation={0} sx={{ bgcolor: '#166534', color: 'white', p: 2, borderRadius: 3 }}>
                    <Typography variant="body2" fontWeight="bold">Need Any Help?</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5, display: 'block' }}>Our support team is online.</Typography>
                    <Button variant="contained" fullWidth startIcon={<SupportAgentIcon />} sx={{ mt: 1.5, bgcolor: 'white', color: '#166534', fontWeight: 600, fontSize: '0.8rem', textTransform: 'none', borderRadius: 2, '&:hover': { bgcolor: 'grey.100' } }}>
                        Contact Support
                    </Button>
                </Paper>
            </Box>
            <Box sx={{ px: 2, pb: 2.5 }}>
                <Button
                    fullWidth
                    startIcon={<LogoutIcon />}
                    onClick={() => setSignOutOpen(true)}
                    sx={{ textTransform: 'none', fontWeight: 500, color: 'error.main', justifyContent: 'flex-start', px: 1, '&:hover': { bgcolor: 'error.lighter' } }}
                >
                    Sign Out
                </Button>
            </Box>

            <SignOutModal
                open={signOutOpen}
                onClose={() => setSignOutOpen(false)}
            />
        </Box>
    );

    if (isMobile) {
        return (
            <Drawer variant="temporary" open={mobileOpen} onClose={onMobileClose} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 } }}>
                {sidebarContent}
            </Drawer>
        );
    }
    return (
        <Box component="aside" sx={{ position: 'fixed', left: 0, top: 0, height: '100vh', width: 240, bgcolor: 'background.paper', overflowY: 'auto', borderRight: '1px solid', borderColor: 'divider', display: { xs: 'none', md: 'flex' }, flexDirection: 'column', zIndex: 1200 }}>
            {sidebarContent}
        </Box>
    );
}
