import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Stack,
    Paper,
    Badge,
    Tooltip,
    IconButton,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import NotificationsNoneIcon   from '@mui/icons-material/NotificationsNone';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import MenuIcon                from '@mui/icons-material/Menu';
import { Link } from '@inertiajs/react';

// ─── Route map ──────────────────────────────────────────────────────────────

const TAB_ROUTES = {
    Courses:      'mentor.courses.index',
    Certificates: 'certificates.index',
    Assessment:   'assessment.create',
    Analytics:    'analytics.index',
    Payments:     'payments.index',
    Enrollees:    'enrollees.index',
};

// ─── Tab item ────────────────────────────────────────────────────────────────

function NavTab({ tab, isActive, compact = false }) {
    const hasRoute = !!TAB_ROUTES[tab];
    return (
        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
            <Typography
                component={hasRoute ? Link : 'span'}
                href={hasRoute ? route(TAB_ROUTES[tab]) : undefined}
                variant="body2"
                fontWeight={isActive ? 600 : 400}
                sx={{
                    color:          isActive ? 'success.main' : 'text.secondary',
                    textDecoration: 'none',
                    cursor:         hasRoute ? 'pointer' : 'default',
                    pb:              compact ? 0.5 : 0.5,
                    px:              compact ? 1 : 0.5,
                    fontSize:       compact ? '0.78rem' : '0.85rem',
                    whiteSpace:     'nowrap',
                    borderBottom:   isActive ? '2px solid' : '2px solid transparent',
                    borderColor:    isActive ? 'success.main' : 'transparent',
                }}
            >
                {tab}
            </Typography>
        </Box>
    );
}

// ─── Notification bell ───────────────────────────────────────────────────────

function NotificationBell() {
    const [hasNew] = useState(true);
    return (
        <Tooltip title="Notifications" placement="bottom" arrow>
            <Box
                sx={{
                    cursor:         'pointer',
                    display:        'inline-flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    width:           36,
                    height:          38,
                    borderRadius:   '50%',
                }}
            >
                <Badge
                    variant={hasNew ? 'dot' : 'standard'}
                    sx={{
                        '& .MuiBadge-dot': {
                            bgcolor:      'error.main',
                            width:         8,
                            height:        8,
                            borderRadius: '50%',
                        },
                    }}
                >
                    {hasNew
                        ? <NotificationsActiveIcon sx={{ color: 'success.main' }} />
                        : <NotificationsNoneIcon   sx={{ color: 'text.secondary' }} />
                    }
                </Badge>
            </Box>
        </Tooltip>
    );
}

// ─── Brand text ──────────────────────────────────────────────────────────────

function BrandText() {
    return (
        <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: 'text.secondary', userSelect: 'none' }}
        >
            ManPro Expert Hub
        </Typography>
    );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function TopNav({
    activeTab    = 'Courses',
    sidebarWidth = 256,
    topNavHeight = '64px',
    onMenuClick,
}) {
    const tabs = ['Courses', 'Assessment', 'Enrollees', 'Analytics', 'Payments', 'Certificates'];

    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <Paper
            square
            elevation={0}
            sx={{
                borderBottom: 1,
                borderColor: (t) =>
                    scrolled
                        ? alpha(t.palette.divider, 0.8)
                        : alpha(t.palette.divider, 0.5),
                position: 'fixed',
                top:       0,
                zIndex:    1100,
                bgcolor:   'background.paper',

                /* ── Responsive left + width ── */
                left:  { xs: 0,              md: sidebarWidth },
                width: { xs: '100%',          md: `calc(100% - ${sidebarWidth}px)` },
            }}
        >
            <Box sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
                {/* ── Main bar ──────────────────────────────────────────── */}
                <Box
                    sx={{
                        display:        'flex',
                        height:          topNavHeight,
                        alignItems:     'center',
                        justifyContent: 'space-between',
                    }}
                >
                    {/* ── Left section ──────────────────────────────────── */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* Hamburger — only on xs / sm */}
                        {onMenuClick && (
                            <IconButton
                                onClick={onMenuClick}
                                size="medium"
                                aria-label="Open navigation"
                                sx={{
                                    display: { xs: 'inline-flex', md: 'none' },
                                    mr:       1,
                                    color:   'text.secondary',
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                    </Box>

                    {/* ── Centre tabs — md and above ───────────────────── */}
                    <Stack
                        direction="row"
                        spacing={3}
                        alignItems="center"
                        sx={{ display: { xs: 'none', md: 'flex' }, height: '100%' }}
                    >
                        {tabs.map((tab) => (
                            <NavTab key={tab} tab={tab} isActive={tab === activeTab} />
                        ))}
                    </Stack>

                    {/* ── Right section ────────────────────────────────── */}
                    <Stack direction="row" spacing={2} alignItems="center">
                        <BrandText />
                        <Box sx={{ width: '1px', height: 20, bgcolor: 'divider' }} />
                        <NotificationBell />
                    </Stack>
                </Box>
            </Box>

            {/* ── Mobile tab strip — xs / sm only ───────────────────────── */}
            <Box
                sx={{
                    display:    { xs: 'flex', md: 'none' },
                    overflowX:  'auto',
                    borderTop:  '1px solid',
                    borderColor:'divider',
                    px:         1,
                    pb:         0.25,
                    pt:         0.5,
                    gap:        0.5,
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                }}
            >
                {tabs.map((tab) => (
                    <NavTab key={tab} tab={tab} isActive={tab === activeTab} compact />
                ))}
            </Box>
        </Paper>
    );
}
