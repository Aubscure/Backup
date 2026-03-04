import EnrolleeSidebar from '@/Components/Enrollee/EnrolleeSidebar';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    InputBase,
    Stack,
    Avatar,
    AvatarGroup,
    Chip,
    Rating,
    IconButton,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import DiamondIcon from '@mui/icons-material/Diamond';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import BoltIcon from '@mui/icons-material/Bolt';
import AcUnitIcon from '@mui/icons-material/AcUnit';

const SIDEBAR_WIDTH = 240;

// Trusted companies (static placeholder data)
const trustedCompanies = [
    { name: 'ACME Corp', icon: <ChangeHistoryIcon sx={{ fontSize: 20, color: 'text.secondary' }} /> },
    { name: 'GemStone', icon: <DiamondIcon sx={{ fontSize: 20, color: 'text.secondary' }} /> },
    { name: 'Infinite', icon: <AllInclusiveIcon sx={{ fontSize: 20, color: 'text.secondary' }} /> },
    { name: 'EnergyInc', icon: <BoltIcon sx={{ fontSize: 20, color: 'text.secondary' }} /> },
    { name: 'FlowState', icon: <AcUnitIcon sx={{ fontSize: 20, color: 'text.secondary' }} /> },
];

export default function Dashboard() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    return (
        <>
            <Head title="Enrollee Dashboard" />

            <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
                {/* Sidebar */}
                <EnrolleeSidebar activePage="dashboard" mobileOpen={mobileOpen} onMobileClose={handleDrawerToggle} />

                {/* Main Content */}
                <Box
                    sx={(theme) => ({
                        ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` },
                        transition: theme.transitions.create('margin', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                        }),
                    })}
                >
                    {/* Top Navigation Bar */}
                    <Paper
                        square
                        elevation={0}
                        sx={{
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'white',
                            position: 'sticky',
                            top: 0,
                            zIndex: 1100,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                height: 64,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                px: { xs: 2, sm: 3, lg: 4 },
                            }}
                        >
                            {/* Mobile Menu Button */}
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2, display: { md: 'none' } }}
                            >
                                <MenuIcon />
                            </IconButton>

                            {/* Search Bar */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    bgcolor: 'grey.100',
                                    borderRadius: 50,
                                    px: 2,
                                    py: 0.75,
                                    width: { xs: '100%', sm: 320, md: 420 },
                                    maxWidth: { xs: 'calc(100% - 100px)', sm: 320, md: 420 },
                                    mx: { xs: 1, sm: 'auto' },
                                }}
                            >
                                <SearchIcon sx={{ color: 'grey.400', mr: 1, fontSize: 20 }} />
                                <InputBase
                                    placeholder="Search for skills, mentors, or topics..."
                                    sx={{ fontSize: '0.875rem', flex: 1 }}
                                    readOnly
                                />
                            </Box>

                            {/* Right side */}
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ ml: 'auto' }}>
                                <Typography
                                    variant="body2"
                                    fontWeight={500}
                                    sx={{ color: 'text.secondary', display: { xs: 'none', md: 'block' } }}
                                >
                                    ManPro Learning Hub
                                </Typography>
                                <Box sx={{ position: 'relative', cursor: 'pointer' }}>
                                    <NotificationsNoneIcon sx={{ color: 'grey.500' }} />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            bgcolor: 'error.main',
                                        }}
                                    />
                                </Box>
                            </Stack>
                        </Box>
                    </Paper>

                    {/* Hero Section */}
                    <Box
                        sx={{
                            px: { xs: 3, sm: 4, lg: 6 },
                            py: { xs: 4, md: 6 },
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', lg: 'row' },
                                alignItems: 'center',
                                gap: { xs: 4, lg: 6 },
                            }}
                        >
                            {/* Left Content */}
                            <Box sx={{ flex: 1, maxWidth: { lg: '50%' } }}>
                                {/* Badge */}
                                <Chip
                                    icon={<CheckCircleOutlineIcon sx={{ fontSize: 16 }} />}
                                    label="UPSKILL AND RESKILL FOR THE FUTURE"
                                    size="small"
                                    sx={{
                                        bgcolor: '#F5D56933',
                                        color: '#166534',
                                        fontWeight: 600,
                                        fontSize: '0.7rem',
                                        letterSpacing: '0.05em',
                                        border: '1px solid #F5D56933',
                                        mb: 3,
                                        '& .MuiChip-icon': { color: '#16a34a' },
                                    }}
                                />

                                {/* Heading */}
                                <Typography
                                    variant="h2"
                                    sx={{
                                        fontWeight: 800,
                                        lineHeight: 1.1,
                                        mb: 2.5,
                                        fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3.25rem' },
                                    }}
                                >
                                    <Box
                                        component="span"
                                        sx={{
                                            background: 'linear-gradient(90deg, #166534 0%, #FFC107 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                        }}
                                    >
                                        Learn. Grow.
                                    </Box>
                                    <br />
                                    <Box
                                        component="span"
                                        sx={{
                                            background: 'linear-gradient(90deg, #166534 0%, #FFC107 200%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                        }}
                                    >
                                        Lead
                                    </Box>
                                    <Box component="span" sx={{ color: 'text.primary', fontWeight: 400 }}>—with</Box>
                                    <br />
                                    <Box component="span" sx={{ color: '#165534', fontWeight: 800 }}>Expert </Box>
                                    <Box component="span" sx={{ color: 'text.primary' }}>Mentors</Box>
                                </Typography>

                                {/* Description */}
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: 'text.secondary',
                                        lineHeight: 1.7,
                                        mb: 3.5,
                                        maxWidth: 480,
                                        fontSize: '0.95rem',
                                    }}
                                >
                                    Join 10,000+ learners developing leadership skills that drive
                                    confidence, growth, and career advancement.
                                </Typography>

                                {/* CTA Button */}
                                <Button
                                    component={Link}
                                    href={route('enrollee.courses.index')}
                                    variant="contained"
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                        bgcolor: '#166534',
                                        color: 'white',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 2,
                                        fontSize: '0.95rem',
                                        '&:hover': { bgcolor: '#14532d' },
                                        mb: 3.5,
                                    }}
                                >
                                    Explore Courses
                                </Button>

                                {/* Social Proof */}
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <AvatarGroup
                                        max={4}
                                        sx={{
                                            '& .MuiAvatar-root': {
                                                width: 36,
                                                height: 36,
                                                fontSize: '0.8rem',
                                                border: '2px solid white',
                                            },
                                        }}
                                    >
                                        <Avatar sx={{ bgcolor: '#1e3a5f' }}>J</Avatar>
                                        <Avatar sx={{ bgcolor: '#6b21a8' }}>M</Avatar>
                                        <Avatar sx={{ bgcolor: '#0e7490' }}>S</Avatar>
                                        <Avatar sx={{ bgcolor: '#9f1239' }}>A</Avatar>
                                        <Avatar sx={{ bgcolor: '#78716c' }}>K</Avatar>
                                    </AvatarGroup>
                                    <Chip
                                        label="+2k"
                                        size="small"
                                        sx={{
                                            bgcolor: 'grey.200',
                                            fontWeight: 600,
                                            fontSize: '0.75rem',
                                        }}
                                    />
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <Rating
                                            value={4.8}
                                            precision={0.1}
                                            size="small"
                                            readOnly
                                            sx={{ color: '#facc15' }}
                                        />
                                        <Typography variant="body2" fontWeight={500} color="text.secondary">
                                            4.8/5 Rating
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Box>

                            {/* Right Content — Hero Image Area */}
                            <Box
                                sx={{
                                    flex: 1,
                                    maxWidth: { lg: '50%' },
                                    position: 'relative',
                                    width: '100%',
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        bgcolor: '#d4e7d0',
                                        height: { xs: 280, sm: 340, md: 400 },
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {/* Placeholder background gradient */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 30%, #a5d6a7 60%, #81c784 100%)',
                                        }}
                                    />

                                    {/* Decorative elements */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.05) 100%)',
                                        }}
                                    />

                                    {/* Placeholder image area */}
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            zIndex: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 1,
                                            color: 'white',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: '50%',
                                                bgcolor: 'rgba(22, 101, 52, 0.8)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                                transition: 'transform 0.2s',
                                                '&:hover': { transform: 'scale(1.1)' },
                                            }}
                                        >
                                            <PlayCircleFilledIcon sx={{ fontSize: 48, color: 'white' }} />
                                        </Box>
                                    </Box>

                                    {/* New Course Card Overlay */}
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            position: 'absolute',
                                            bottom: 20,
                                            left: 20,
                                            right: 20,
                                            p: 2,
                                            borderRadius: 3,
                                            bgcolor: 'rgba(255,255,255,0.95)',
                                            backdropFilter: 'blur(10px)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.5,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 2,
                                                bgcolor: '#166534',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <TrendingUpIcon sx={{ color: 'white', fontSize: 22 }} />
                                        </Box>
                                        <Box>
                                            <Typography
                                                variant="overline"
                                                sx={{
                                                    color: 'text.secondary',
                                                    fontSize: '0.65rem',
                                                    lineHeight: 1.2,
                                                    letterSpacing: '0.08em',
                                                }}
                                            >
                                                NEW COURSE
                                            </Typography>
                                            <Typography variant="subtitle2" fontWeight={700}>
                                                Strategic Leadership
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    {/* Trusted By Section */}
                    <Box
                        sx={{
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            py: 5,
                            px: { xs: 3, sm: 4, lg: 6 },
                            textAlign: 'center',
                        }}
                    >
                        <Typography
                            variant="overline"
                            sx={{
                                color: 'text.secondary',
                                letterSpacing: '0.15em',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                mb: 3,
                                display: 'block',
                            }}
                        >
                            TRUSTED BY LEADING TEAMS
                        </Typography>
                        <Stack
                            direction="row"
                            spacing={{ xs: 3, sm: 5, md: 7 }}
                            justifyContent="center"
                            alignItems="center"
                            flexWrap="wrap"
                            sx={{ rowGap: 2 }}
                        >
                            {trustedCompanies.map((company) => (
                                <Stack
                                    key={company.name}
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    sx={{ opacity: 0.7 }}
                                >
                                    {company.icon}
                                    <Typography
                                        variant="body2"
                                        fontWeight={700}
                                        sx={{ color: 'text.secondary', fontSize: '0.95rem' }}
                                    >
                                        {company.name}
                                    </Typography>
                                </Stack>
                            ))}
                        </Stack>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

