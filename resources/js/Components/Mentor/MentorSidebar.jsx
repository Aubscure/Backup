/**
 * resources/js/Components/Mentor/MentorSidebar.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Two new props added — everything else is identical to the original.
 *
 *   drawerMode {boolean}   default false
 *     false → original behaviour: position fixed, 100 vh, zIndex 1200.
 *             Used when rendered as the permanent desktop sidebar.
 *     true  → rendered inside a MUI Drawer. position:fixed is removed,
 *             height becomes 100%, zIndex is reset so it doesn't fight
 *             the Drawer's own stacking context.
 *
 *   onClose {function}     optional
 *     When drawerMode is true, every navigation action (link clicks,
 *     sign-out) calls onClose so the parent MentorLayout can close the
 *     Drawer automatically on mobile.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import SignOutModal from '@/Components/SignOutModal';
import profileBg     from '../../../images/profile_bg.jpg';
import manproLogo    from '../../../images/manprologo.svg';
import {
    Box,
    Typography,
    Button,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    keyframes,
} from '@mui/material';
import DashboardIcon    from '@mui/icons-material/Dashboard';
import PersonIcon       from '@mui/icons-material/Person';
import SettingsIcon     from '@mui/icons-material/Settings';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LogoutIcon       from '@mui/icons-material/Logout';
import CourseSummary          from '@/Components/Mentor/Courses/MentorCourseSummary';
import ProfileAvatar          from '@/Components/Mentor/MentorProfileAvatar';
import VerificationStatusCard from '@/Components/Mentor/Verifications/MentorVerificationStatusCard';

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

export default function CourseSidebar({ drawerMode = false, onClose }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [signOutOpen, setSignOutOpen] = useState(false);

    const docCount         = user.verification_documents_count ?? 0;
    const isVerified       = user.is_verified === true || user.is_verified === 1;
    const hasSubmittedDocs = docCount > 0;

    let verificationState = 'unverified';
    if (isVerified)        verificationState = 'verified';
    else if (hasSubmittedDocs) verificationState = 'pending';

    const path          = window.location.pathname;
    const isCourseCreate = path.includes('/courses/create');
    const isSyllabus     = path.includes('/courses/') && path.includes('/syllabus');
    const isMediaContent = path.includes('/courses/') && path.includes('/media-content');
    const isPricing      = path.includes('/courses/') && path.includes('/pricing');

    /** Closes the Drawer on mobile after any navigation. No-op on desktop. */
    const maybeClose = () => { if (drawerMode && onClose) onClose(); };

    /* ── Positioning: fixed on desktop, flow-based inside Drawer on mobile ── */
    const positionSx = drawerMode
        ? { position: 'relative', height: '100%', width: '100%', zIndex: 'auto' }
        : { position: 'fixed', left: 0, top: 0, height: '100vh', width: 256, zIndex: 1200 };

    return (
        <Box
            component="aside"
            sx={{
                ...positionSx,
                bgcolor:       'background.paper',
                boxShadow:      3,
                display:       'flex',
                flexDirection: 'column',
                animation:     `${fadeIn} 0.5s ease-out`,
            }}
        >

            {/* ── Logo ────────────────────────────────────────────────────── */}
            <Box sx={{ p: 2,  borderColor: 'divider', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src={manproLogo} alt="ManPro Logo" style={{ height: 38 }} />
            </Box>

            {/* ── Profile header ──────────────────────────────────────────── */}
            <Box
                sx={{
                    flexShrink: 0,
                    '&:hover .profile-bg-image': { transform: 'scale(1.1)' },
                }}
            >
                <Box sx={{ position: 'relative', overflow: 'hidden', height: 180 }}>
                    <Box
                        className="profile-bg-image"
                        sx={{
                            position:           'absolute',
                            inset:               0,
                            backgroundImage:    `url(${profileBg})`,
                            backgroundSize:     'cover',
                            backgroundPosition: 'center',
                            transition:         'transform 6s cubic-bezier(0.25, 0.45, 0.45, 0.95)',
                        }}
                    />
                    <Box
                        sx={{
                            position:       'relative',
                            zIndex:          1,
                            display:        'flex',
                            flexDirection:  'column',
                            alignItems:     'center',
                            justifyContent: 'center',
                            height:         '100%',
                        }}
                    >
                        <ProfileAvatar size={80} src={user.profile_photo_url} user={user} />
                        <Typography
                            variant="body2"
                            fontWeight="bold"
                            sx={{ color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.8)', mt: 1 }}
                        >
                            {user.firstname} {user.lastname}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{ color: 'rgba(255,255,255,0.95)', mt: 0.5, textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
                        >
                            Mentor
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ px: 2, py: 1.5 }}>
                    <Button
                        component={Link}
                        href={route('dashboard')}
                        onClick={maybeClose}
                        variant="contained"
                        fullWidth
                        startIcon={<DashboardIcon />}
                        sx={{
                            bgcolor:       '#1b730900',
                            borderColor:   '#1b730900',
                            color:         'grey.800',
                            fontWeight:     600,
                            textTransform: 'none',
                            py:             1.25,
                            borderRadius:   2,
                            transition:    'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            border:        '1px solid transparent',
                            '&:hover': {
                                bgcolor:   '#1a7309',
                                color:     '#ffffff',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(26, 115, 9, 0.3)',
                            },
                        }}
                    >
                        My Dashboard
                    </Button>
                </Box>
            </Box>

            {/* ── Scrollable body ─────────────────────────────────────────── */}
            <Box
                sx={{
                    flex:          1,
                    overflowY:    'auto',
                    px:            2,
                    display:      'flex',
                    flexDirection:'column',
                    gap:           1,
                    '&::-webkit-scrollbar':            { width: 6 },
                    '&::-webkit-scrollbar-thumb':      { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 3 },
                    '&::-webkit-scrollbar-thumb:hover':{ backgroundColor: 'rgba(0,0,0,0.3)' },
                }}
            >
                {!isCourseCreate && !isSyllabus && !isMediaContent && !isPricing && (
                    <VerificationStatusCard isVerified={isVerified} docCount={docCount} />
                )}

                {(isCourseCreate || isSyllabus || isMediaContent || isPricing) && (
                    <CourseSummary duration={null} resources={null} modules={null} />
                )}

                {/* Quick Actions */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Box sx={{ px: 2, pt: 2 }}>
                        <Typography
                            variant="caption"
                            fontWeight="bold"
                            sx={{ textTransform: 'uppercase', color: 'text.secondary' }}
                        >
                            Quick Actions
                        </Typography>
                    </Box>
                    <List dense>
                        {[
                            { text: 'My Profile', icon: <PersonIcon fontSize="small" />, href: route('profile.edit') },
                            { text: 'Settings',   icon: <SettingsIcon fontSize="small" />, href: '#' },
                        ].map((item, index) => (
                            <ListItemButton
                                key={index}
                                component={item.href !== '#' ? Link : 'div'}
                                href={item.href !== '#' ? item.href : undefined}
                                onClick={maybeClose}
                                sx={{
                                    borderRadius: 1,
                                    mb: 0.5,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        transform: 'translateX(5px)',
                                        bgcolor:   'rgba(26, 115, 9, 0.08)',
                                        '& .MuiListItemIcon-root':    { color: '#1a7309' },
                                        '& .MuiListItemText-primary': { color: '#1a7309', fontWeight: 600 },
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary', transition: 'color 0.2s' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} sx={{ transition: 'color 0.2s' }} />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>

                {/* Support box */}
                <Box sx={{ px: 2, py: 2 }}>
                    <Paper
                        elevation={3}
                        sx={{
                            bgcolor:    'success.dark',
                            color:      'white',
                            p:           2,
                            borderRadius: 3,
                            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            position:   'relative',
                            overflow:   'hidden',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 24px -5px rgba(27, 94, 32, 0.5)',
                            },
                        }}
                    >
                        <Box sx={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
                        <Typography fontWeight="bold" sx={{ position: 'relative', zIndex: 1 }}>
                            Need Any Help?
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8, position: 'relative', zIndex: 1, display: 'block', mb: 2 }}>
                            Our support team is online.
                        </Typography>
                        <Button
                            fullWidth
                            startIcon={<SupportAgentIcon />}
                            sx={{
                                bgcolor:       'white',
                                color:         'success.dark',
                                fontWeight:     600,
                                textTransform: 'none',
                                boxShadow:     '0 2px 5px rgba(0,0,0,0.1)',
                                transition:    'transform 0.2s',
                                '&:hover': { bgcolor: '#f5f5f5', transform: 'scale(1.02)' },
                            }}
                        >
                            Contact Support
                        </Button>
                    </Paper>
                </Box>
            </Box>

            {/* ── Sign out (pinned to bottom) ──────────────────────────────── */}
            <Box sx={{ p: 2, mt: 'auto', bgcolor: 'background.paper' }}>
                <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    startIcon={<LogoutIcon />}
                    onClick={() => setSignOutOpen(true)}
                    sx={{
                        textTransform: 'none',
                        transition:    'all 0.2s ease',
                        borderWidth:   '1.5px',
                        '&:hover': {
                            borderWidth: '1.5px',
                            bgcolor:     '#d32f2f',
                            color:       'white',
                            transform:   'translateY(-2px)',
                            boxShadow:   '0 4px 8px rgba(211, 47, 47, 0.25)',
                        },
                    }}
                >
                    Sign Out
                </Button>
            </Box>

            <SignOutModal
                open={signOutOpen}
                onClose={() => { setSignOutOpen(false); maybeClose(); }}
            />

        </Box>
    );
}