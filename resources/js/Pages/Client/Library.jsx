import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import ClientSidebar from '@/Components/Client/ClientSidebar';
import {
    Box,
    Typography,
    Paper,
    InputBase,
    Stack,
    Button,
    IconButton,
    useMediaQuery,
    useTheme,
    LinearProgress,
    Card,
    CardContent,
    CardMedia,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';

const SIDEBAR_WIDTH = 240;

const STATIC_LICENSE_STATS = [
    { label: 'TOTAL LICENSES PURCHASED', value: 500, change: '+0%', progress: 100, color: 'success' },
    { label: 'ACTIVE LICENSES', value: 342, change: '+5%', progress: 68.4, color: 'success' },
    { label: 'AVAILABLE LICENSES', value: 158, change: '~2%', progress: 31.6, color: 'grey' },
];

const STATIC_COURSES = [
    { id: 1, title: 'Enterprise Cybersecurity Essentials', tag: 'PREMIUM', total: 100, allocated: 82, remaining: 18, image: null },
    { id: 2, title: 'Advanced Data Analytics 2024', tag: null, total: 250, allocated: 156, remaining: 94, image: null },
    { id: 3, title: 'Agile Leadership & Management', tag: null, total: 150, allocated: 104, remaining: 46, image: null },
];

export default function ClientLibrary() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <>
            <Head title="Admin Course Library & Licensing" />
            <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
                <ClientSidebar activePage="library" mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
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

                    <Box sx={{ p: { xs: 2, sm: 3, lg: 4 }, maxWidth: 1400, mx: 'auto' }}>
                        <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>Admin Course Library & Licensing</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>Manage your organization&apos;s course licenses and employee assignments globally.</Typography>

                        {/* License stats */}
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 4 }}>
                            {STATIC_LICENSE_STATS.map((stat) => (
                                <Paper key={stat.label} elevation={0} sx={{ flex: 1, p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>{stat.label}</Typography>
                                    <Stack direction="row" alignItems="baseline" spacing={1}>
                                        <Typography variant="h4" fontWeight={800}>{stat.value}</Typography>
                                        <Typography variant="body2" color={stat.change.startsWith('+') ? 'success.main' : 'text.secondary'}>{stat.change}</Typography>
                                    </Stack>
                                    <LinearProgress variant="determinate" value={stat.progress} sx={{ mt: 1.5, height: 6, borderRadius: 3, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: stat.color === 'success' ? 'success.main' : 'grey.500' } }} />
                                </Paper>
                            ))}
                        </Stack>

                        {/* Organization Course Library */}
                        <Stack direction="row" flexWrap="wrap" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                            <Typography variant="h6" fontWeight={700}>Organization Course Library</Typography>
                            <Stack direction="row" spacing={1.5}>
                                <Button startIcon={<FilterListIcon />} variant="outlined" sx={{ textTransform: 'none', fontWeight: 600 }}>Filter</Button>
                                <Button component={Link} href="#" variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: 'success.main', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: 'success.dark' } }}>+ Purchase More</Button>
                            </Stack>
                        </Stack>

                        <Stack direction="row" flexWrap="wrap" useFlexGap spacing={3}>
                            {STATIC_COURSES.map((course) => (
                                <Card key={course.id} sx={{ width: { xs: '100%', sm: 280 }, borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                                    <Box sx={{ position: 'relative' }}>
                                        {course.image ? (
                                            <CardMedia component="img" height="140" image={course.image} alt={course.title} sx={{ objectFit: 'cover' }} />
                                        ) : (
                                            <Box sx={{ height: 140, bgcolor: course.id === 3 ? 'grey.700' : 'grey.300', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <ImageRoundedIcon sx={{ fontSize: 48, color: 'grey.500' }} />
                                            </Box>
                                        )}
                                        {course.tag && (
                                            <Box sx={{ position: 'absolute', top: 12, left: 12, bgcolor: 'grey.900', color: 'white', px: 1.5, py: 0.5, borderRadius: 1 }}>
                                                <Typography variant="caption" fontWeight={700}>{course.tag}</Typography>
                                            </Box>
                                        )}
                                    </Box>
                                    <CardContent sx={{ p: 2 }}>
                                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{course.title}</Typography>
                                        <Stack spacing={0.5} sx={{ mb: 2 }}>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="caption" color="text.secondary">TOTAL</Typography>
                                                <Typography variant="caption" fontWeight={600}>{course.total}</Typography>
                                            </Stack>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="caption" color="text.secondary">ALLOCATED</Typography>
                                                <Typography variant="caption" fontWeight={600}>{course.allocated}</Typography>
                                            </Stack>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="caption" color="text.secondary">REM.</Typography>
                                                <Typography variant="caption" fontWeight={600} color="success.main">{course.remaining}</Typography>
                                            </Stack>
                                        </Stack>
                                        <Button fullWidth variant="contained" startIcon={<GroupAddIcon />} sx={{ bgcolor: 'success.main', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: 'success.dark' } }}>Allocate Licenses</Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>

                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <Button variant="outlined" sx={{ textTransform: 'none', fontWeight: 600, borderColor: 'divider', color: 'text.secondary' }}>Load More Courses</Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
}
