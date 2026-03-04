import { useState } from 'react';
import { router, Link as InertiaLink, usePage } from '@inertiajs/react';

import {
    Drawer,
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider,
    Container,
} from '@mui/material';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleDrawer = () => {
        setMobileOpen((prev) => !prev);
    };

    const fullName = `${user.firstname ?? ''} ${user.lastname ?? ''}`.trim();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: 'grey.100',
                // FIX: Prevents horizontal scrolling caused by Grid negative margins or wide content
                overflowX: 'hidden',
                position: 'relative'
            }}
        >
            {/* === REMOVE Breeze Top Navbar === */}

            {/* MOBILE DRAWER */}
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={toggleDrawer}
                // Performance optimization for mobile drawers
                ModalProps={{ keepMounted: true }}
                sx={{
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
                }}
            >
                <Box role="presentation">
                    {/* Navigation Links */}
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton
                                component={InertiaLink}
                                href={route('dashboard')}
                                onClick={toggleDrawer}
                            >
                                <ListItemText primary="Dashboard" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton
                                component={InertiaLink}
                                href={route('mentor.courses.index')}
                                onClick={toggleDrawer}
                            >
                                <ListItemText primary="Courses" />
                            </ListItemButton>
                        </ListItem>
                    </List>

                    <Divider />

                    {/* User Info */}
                    <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            {fullName || user.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                            {user.email}
                        </Typography>
                    </Box>

                    <Divider />

                    {/* User Actions */}
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton
                                component={InertiaLink}
                                href={route('profile.edit')}
                                onClick={toggleDrawer}
                            >
                                <ListItemText primary="Profile" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    toggleDrawer();
                                    router.post(route('logout'));
                                }}
                            >
                                <ListItemText primary="Log Out" sx={{ color: 'error.main' }} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            {/* Optional Header (if any) */}
            {header && (
                <Box
                    sx={{
                        ml: 30,
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        py: 3,
                        position: 'relative',
                        zIndex: 1
                    }}
                >
                    <Container maxWidth="xl">{header}</Container>
                </Box>
            )}

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    width: '100%',
                    // Ensure it behaves as a block to respect the parent's overflow hidden
                    display: 'block',
                    boxSizing: 'border-box'
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
