import EnrolleeSidebar from '@/Components/Enrollee/EnrolleeSidebar';
import EnrolleeCourseCard from '@/Components/Enrollee/EnrolleeCourseCard';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    InputBase,
    Stack,
    Grid,
    Chip,
    IconButton,
    useMediaQuery,
    useTheme,
    Container,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const SIDEBAR_WIDTH = 240;

const FILTER_TYPES = [
    { key: 'all', label: 'All Courses' },
    { key: 'role-based', label: 'Role-Based' },
    { key: 'career-growth', label: 'Career Growth' },
    { key: 'skill-gap', label: 'Skill Gap Focused' },
    { key: 'in-demand', label: 'Most In-Demand' },
    { key: 'manager-recommended', label: 'Manager Recommended' },
    { key: 'day-to-day', label: 'Day-to-day Work Skills' },
];

export default function CoursesIndex({ courses = [], categories = [], filters = {}, mentorName = [], pageTitle = null }) {
    const isMyCourses = pageTitle === 'My Courses';
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedFilter, setSelectedFilter] = useState(filters.type || 'all');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));


    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            router.get(route('enrollee.courses.index'), {
                search: searchQuery,
                type: selectedFilter !== 'all' ? selectedFilter : null,
                category: filters.category || null,
            }, {
                preserveState: true,
                replace: true,
            });
        }
    };

    const handleFilterChange = (filterKey) => {
        setSelectedFilter(filterKey);
        router.get(route('enrollee.courses.index'), {
            search: searchQuery || null,
            type: filterKey !== 'all' ? filterKey : null,
            category: filters.category || null,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <>
            <Head title={isMyCourses ? 'My Courses' : 'Explore Courses'} />

            <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa', minWidth: '90vw'}}>
                {/* Sidebar */}
                <EnrolleeSidebar activePage={isMyCourses ? 'my-courses' : 'courses'} mobileOpen={mobileOpen} onMobileClose={handleDrawerToggle} />

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
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={handleSearch}
                                    sx={{ fontSize: '0.875rem', flex: 1 }}
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

                    {/* Main Content Area */}
                    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 }, px: { xs: 3, sm: 4, lg: 6 } }}>


                        {/* Header Section */}
                        <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
                            <Box>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 800,
                                        mb: 1.5,
                                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                    }}
                                >
                                    {isMyCourses ? 'My Courses' : 'Explore Courses'}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: 'text.secondary',
                                        maxWidth: 600,
                                        fontSize: '1rem',
                                        lineHeight: 1.6,
                                    }}
                                >
                                    {isMyCourses
                                        ? "Courses you've enrolled in. Continue learning or start a new lesson."
                                        : 'Find the perfect course to upskill, reskill, and advance your career with expert guidance.'}
                                </Typography>
                            </Box>
                            {isMyCourses && (
                                <Button
                                    component={Link}
                                    href={route('enrollee.courses.index')}
                                    variant="outlined"
                                    sx={{ textTransform: 'none', fontWeight: 600, borderColor: 'success.main', color: 'success.main', '&:hover': { borderColor: 'success.dark', bgcolor: 'success.50' } }}
                                >
                                    Browse all courses
                                </Button>
                            )}
                        </Box>

                        {/* Filter Buttons - hide on My Courses */}
                        {!isMyCourses && (
                        <Box
                            sx={{
                                mb: 4,
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1.5,
                            }}
                        >
                            {FILTER_TYPES.map((filter) => (
                                <Chip
                                    key={filter.key}
                                    label={filter.label}
                                    onClick={() => handleFilterChange(filter.key)}
                                    sx={{
                                        px: 2,
                                        py: 2.5,
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        borderRadius: 50,
                                        bgcolor: selectedFilter === filter.key ? '#166534' : 'white',
                                        color: selectedFilter === filter.key ? 'white' : 'text.primary',
                                        border: '1px solid',
                                        borderColor: selectedFilter === filter.key ? '#166534' : 'divider',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            bgcolor: selectedFilter === filter.key ? '#14532d' : 'grey.50',
                                            borderColor: selectedFilter === filter.key ? '#14532d' : 'grey.300',
                                        },
                                    }}
                                />
                            ))}
                        </Box>
                        )}

                        {/* Courses Grid */}
                        {courses.length === 0 ? (
                            <Paper
                                sx={{
                                    p: 6,
                                    textAlign: 'center',
                                    bgcolor: 'grey.50',
                                    borderRadius: 3,
                                }}
                            >
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    {isMyCourses ? "You haven't enrolled in any courses yet" : 'No courses found'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {isMyCourses
                                        ? 'Explore the catalogue and start a course to see it here.'
                                        : 'Try adjusting your search or filter criteria.'}
                                </Typography>
                                {isMyCourses && (
                                    <Button component={Link} href={route('enrollee.courses.index')} variant="contained" sx={{ bgcolor: 'success.main', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: 'success.dark' } }}>
                                        Explore courses
                                    </Button>
                                )}
                            </Paper>
                        ) : (
                            <Grid container spacing={3}>
                                {courses.map((course) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
                                        <EnrolleeCourseCard course={course} />
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Container>
                </Box>
            </Box>
        </>
    );
}

