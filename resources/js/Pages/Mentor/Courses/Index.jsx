// resources/js/Pages/Mentor/Courses/Index.jsx

import VerificationModal       from '@/Components/Mentor/Verifications/VerificationNotificationModal';
import CourseCard              from '@/Components/Mentor/Courses/Index/MentorCourseCard';
import MentorFilterBar         from '@/Components/Mentor/Courses/Index/MentorCoursesFilterBar';
import MentorCoursesPagination from '@/Components/Mentor/Courses/Index/MentorCoursesPagination';
import MentorLayout            from '@/Layouts/MentorLayout';

import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect }   from 'react';

import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    Stack,
    Fade,
    Grow,
    keyframes,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

import AddRoundedIcon         from '@mui/icons-material/AddRounded';
import MenuBookRoundedIcon    from '@mui/icons-material/MenuBookRounded';

// ─── Brand colours ────────────────────────────────────────────────────────────
const C = {
    green:     '#2e7d33',
    greenLight:'#edfbf3',
    amber:     '#f3a421',
    amberLight:'#fefbea',
    danger:    '#d32f2f',
};

// ─── Easing & Keyframes ───────────────────────────────────────────────────────
const EASE        = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
const EASE_SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

const floatUp = keyframes`
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const scaleReveal = keyframes`
  from { opacity: 0; transform: scale(0.82) translateY(16px); }
  to   { opacity: 1; transform: scale(1)    translateY(0); }
`;

const iconFloat = keyframes`
  0%, 100% { transform: translateY(0px)  rotate(0deg); }
  33%       { transform: translateY(-8px) rotate(-4deg); }
  66%       { transform: translateY(-4px) rotate(3deg); }
`;

const shimmerMove = keyframes`
  0%   { background-position: -300% center; }
  100% { background-position:  300% center; }
`;

const addBtnPulse = keyframes`
  0%, 100% { box-shadow: 0 4px 14px ${alpha(C.green, 0.22)}, 0 0 0 0   ${alpha(C.green, 0.18)}; }
  50%       { box-shadow: 0 4px 14px ${alpha(C.green, 0.22)}, 0 0 0 7px ${alpha(C.green, 0)}; }
`;

const cardEntrance = keyframes`
  from { opacity: 0; transform: translateY(28px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
`;

const rippleBurst = keyframes`
  0%   { transform: scale(0); opacity: 0.35; }
  100% { transform: scale(4); opacity: 0; }
`;

const sparkle = keyframes`
  0%,100% { opacity: 0; transform: scale(0); }
  50%      { opacity: 1; transform: scale(1); }
`;

// ─── Animated Add Button ──────────────────────────────────────────────────────
function AnimatedAddButton({ onClick, label = 'Add another course', size = 'medium' }) {
    const [hovered,  setHovered]  = useState(false);
    const [rippling, setRippling] = useState(false);

    const handleClick = (e) => {
        setRippling(true);
        setTimeout(() => setRippling(false), 700);
        onClick(e);
    };

    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            {rippling && (
                <Box sx={{
                    position:      'absolute',
                    inset:          0,
                    borderRadius:   3,
                    bgcolor:       alpha(C.green, 0.35),
                    animation:     `${rippleBurst} 0.65s ease-out forwards`,
                    pointerEvents: 'none',
                    zIndex:         0,

                }} />
            )}
            <Button
                variant="contained"
                size={size}
                onClick={handleClick}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                startIcon={
                    <AddRoundedIcon sx={{
                        transition: `transform 320ms ${EASE_SPRING}`,
                        transform:   hovered ? 'rotate(90deg) scale(1.15)' : 'rotate(0deg) scale(1)',
                    }} />
                }
                sx={{
                    position:        'relative',
                    zIndex:           1,
                    backgroundColor:  C.green,
                    textTransform:   'none',
                    fontWeight:       700,
                    borderRadius:     3,
                    px:               size === 'large' ? 4 : 2.5,
                    py:               size === 'large' ? 1.5 : undefined,
                    letterSpacing:    0.3,
                    animation:       `${addBtnPulse} 3.5s ease-in-out infinite`,
                    transition:      `background-color 220ms ${EASE}, transform 280ms ${EASE_SPRING}`,
                    '&:hover': {
                        backgroundColor: '#1b5e20',
                        transform:       'translateY(-4px) scale(1.03)',
                        animation:       'none',
                        boxShadow:       `0 12px 32px ${alpha(C.green, 0.34)}`,
                    },
                    '&:active': {
                        transform:  'translateY(-1px) scale(0.98)',
                        transition: `transform 80ms ${EASE}`,
                    },
                }}
            >
                {label}
            </Button>
        </Box>
    );
}

// ─── Shimmer page heading ─────────────────────────────────────────────────────
function PageHeading() {
    const [hovered, setHovered] = useState(false);
    return (
        <Typography
            variant="h4"
            fontWeight={700}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{
                cursor:        'default',
                userSelect:    'none',
                display:       'inline-block',
                transition:    `letter-spacing 300ms ${EASE}`,
                letterSpacing:  hovered ? 1.5 : 0,
                background:     hovered
                    ? `linear-gradient(90deg, ${C.green} 0%, #4caf50 35%, #1b5e20 65%, ${C.green} 100%)`
                    : 'none',
                backgroundSize:       '300% auto',
                WebkitBackgroundClip:  hovered ? 'text'        : 'unset',
                WebkitTextFillColor:   hovered ? 'transparent' : 'unset',
                color:                 hovered ? 'transparent' : 'text.primary',
                animation:             hovered ? `${shimmerMove} 2s linear infinite` : 'none',
            }}
        >
            Courses
        </Typography>
    );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyStateCard({ isFiltering, onCreateClick }) {
    const [iconHovered, setIconHovered] = useState(false);
    const sparkles = [
        { top: '18%', left: '22%', size: 6, delay: '0s'   },
        { top: '14%', left: '72%', size: 5, delay: '0.4s' },
        { top: '72%', left: '15%', size: 4, delay: '0.8s' },
        { top: '78%', left: '78%', size: 7, delay: '1.2s' },
        { top: '45%', left: '88%', size: 4, delay: '0.6s' },
        { top: '50%', left:  '8%', size: 5, delay: '1s'   },
    ];

    return (
        <Fade in timeout={600} style={{ transitionTimingFunction: EASE }}>
            <Card sx={{
                textAlign:       'center',
                p:                { xs: 4, sm: 8 },
                borderRadius:     5,
                backgroundColor:  '#fff',
                boxShadow:       '0 4px 24px rgba(0,0,0,0.04)',
                position:        'relative',
                overflow:        'hidden',
                animation:       `${scaleReveal} 0.55s ${EASE_SPRING} both`,
                transition:      `transform 320ms ${EASE_SPRING}, box-shadow 320ms ${EASE}`,
                '&:hover': {
                    boxShadow: '0 24px 56px rgba(0,0,0,0.09)',
                    transform: 'translateY(-6px)',
                },
                '&::before': {
                    content:       '""',
                    position:      'absolute',
                    inset:          0,
                    background:    `radial-gradient(ellipse at 50% 30%, ${alpha(C.green, 0.04)} 0%, transparent 65%)`,
                    pointerEvents: 'none',
                },
            }}>
                {sparkles.map((s, i) => (
                    <Box key={i} sx={{
                        position:      'absolute',
                        top:            s.top,
                        left:           s.left,
                        width:          s.size,
                        height:         s.size,
                        borderRadius:  '50%',
                        bgcolor:        C.amber,
                        opacity:        0.6,
                        animation:     `${sparkle} ${1.8 + i * 0.3}s ease-in-out ${s.delay} infinite`,
                        pointerEvents: 'none',
                    }} />
                ))}

                <Fade in timeout={700} style={{ transitionDelay: '150ms', transitionTimingFunction: EASE }}>
                    <Box
                        onMouseEnter={() => setIconHovered(true)}
                        onMouseLeave={() => setIconHovered(false)}
                        sx={{ display: 'inline-block', mb: 3, cursor: 'default' }}
                    >
                        <MenuBookRoundedIcon sx={{
                            fontSize:   74,
                            color:      C.amber,
                            filter:    `drop-shadow(0px 6px 14px ${alpha(C.amber, 0.28)})`,
                            animation:  iconHovered ? 'none' : `${iconFloat} 4s ease-in-out infinite`,
                            transition:`transform 350ms ${EASE_SPRING}`,
                            transform:  iconHovered ? 'scale(1.18) rotate(-8deg)' : 'none',
                            display:   'block',
                        }} />
                    </Box>
                </Fade>

                <Fade in timeout={600} style={{ transitionDelay: '230ms', transitionTimingFunction: EASE }}>
                    <Box>
                        <Typography variant="h5" fontWeight={700} gutterBottom
                            sx={{ animation: `${floatUp} 0.5s ${EASE} 0.3s both` }}
                        >
                            No courses found
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{
                            mb: 4, maxWidth: 420, mx: 'auto', lineHeight: 1.7,
                            animation: `${floatUp} 0.5s ${EASE} 0.42s both`,
                        }}>
                            {isFiltering
                                ? "We couldn't find any courses matching your filters. Try adjusting your search criteria."
                                : "You haven't created any courses yet. Get started by sharing your knowledge with the world."}
                        </Typography>
                        <Box sx={{ animation: `${floatUp} 0.5s ${EASE} 0.54s both` }}>
                            <AnimatedAddButton onClick={onCreateClick} label="Create Course" size="large" />
                        </Box>
                    </Box>
                </Fade>
            </Card>
        </Fade>
    );
}

// ─── Animated course card wrapper ─────────────────────────────────────────────
function AnimatedCourseCard({ course, index }) {
    const [hovered, setHovered] = useState(false);

    return (
        <Grow
            in
            timeout={400 + index * 55}
            style={{ transformOrigin: 'top center', transitionDelay: `${index * 55}ms` }}
        >
            <Box
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                sx={{
                    height:     '100%',
                    position:   'relative',
                    borderRadius: 4,
                    animation:  `${cardEntrance} 0.55s ${EASE_SPRING} ${index * 55}ms both`,
                    transition: `transform 320ms ${EASE_SPRING}, filter 300ms ${EASE}`,
                    transform:   hovered ? 'translateY(-10px)' : 'translateY(0)',
                    filter:      hovered
                        ? 'drop-shadow(0 20px 40px rgba(0,0,0,0.12))'
                        : 'drop-shadow(0 2px 8px rgba(0,0,0,0.05))',
                    zIndex: hovered ? 2 : 1,
                }}
            >
                <CourseCard course={course} showUnpublish={true} />
            </Box>
        </Grow>
    );
}

// ─── Main page component ──────────────────────────────────────────────────────
export default function Index({ courses, categories, filters, pagination }) {
    const { auth } = usePage().props;
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 40);
        return () => clearTimeout(t);
    }, []);

    const handleCreateClick = (e) => {
        if (e) e.preventDefault();
        const isVerified = auth?.user?.is_verified == 1 || auth?.user?.is_verified === true;
        if (isVerified) {
            router.visit(route('mentor.courses.create'));
        } else {
            setShowVerifyModal(true);
        }
    };

    const isFiltering = filters.search || filters.status || filters.category;

    const handlePageChange = (page) => {
        router.get(route('mentor.courses.index'), { ...filters, page }, {
            preserveScroll: true,
            preserveState:  true,
        });
    };

    return (
        <>
            <Head title="Courses" />

            <VerificationModal
                show={showVerifyModal}
                onClose={() => setShowVerifyModal(false)}
            />

            <Box sx={{
                pt:              4,
                px:              { xs: 2, sm: 3 },
                pb:              18,
                backgroundColor:'#F7F7F7',
                minHeight:      '80vh',
                backgroundImage:`
                    radial-gradient(ellipse at 8%  12%,  ${alpha(C.green, 0.035)} 0%, transparent 48%),
                    radial-gradient(ellipse at 92% 88%,  ${alpha(C.amber, 0.03)}  0%, transparent 48%)
                `,
            }}>
                <Container maxWidth="xl">

                    {/* ── Page header ───────────────────────────────────────── */}
                    <Box sx={{
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: 'space-between',
                        flexWrap:       'wrap',
                        gap:             2,
                        mb:              3,
                        animation:       mounted ? `${floatUp} 0.45s ${EASE} both` : 'none',
                    }}>
                        <PageHeading />

                        {/* Right side: Add button */}
                        {/* Right side: Add button — hidden when empty state (Create Course) is visible */}
                        {courses.length > 0 && (
                            <AnimatedAddButton
                                onClick={handleCreateClick}
                                label="Add another course"
                            />
                        )}
                    </Box>

                    {/* ── Filter bar ────────────────────────────────────────── */}
                    <Box sx={{ animation: mounted ? `${floatUp} 0.5s ${EASE} 0.1s both` : 'none' }}>
                        <MentorFilterBar filters={filters} categories={categories} />
                    </Box>

                    {/* ── Content ───────────────────────────────────────────── */}
                    {courses.length === 0 ? (
                        <EmptyStateCard isFiltering={isFiltering} onCreateClick={handleCreateClick} />
                    ) : (
                        <>
                            {/* 4 columns on md/lg, 1 column on xs */}
                            <Grid container spacing={3} sx={{ mt: 0.5 }}>
                                {courses.map((course, index) => (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        md={3}
                                        key={course.id}
                                        sx={{ display: 'flex' }}
                                    >
                                        <Box sx={{ width: '100%' }}>
                                            <AnimatedCourseCard course={course} index={index} />
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>

                            {pagination?.last_page > 1 && (
                                <MentorCoursesPagination
                                    currentPage={pagination.current_page}
                                    lastPage={pagination.last_page}
                                    onPageChange={handlePageChange}
                                    total={pagination.total}
                                    perPage={pagination.per_page}
                                />
                            )}
                        </>
                    )}
                </Container>
            </Box>
        </>
    );
}

Index.layout = (page) => (
    <MentorLayout auth={page.props.auth} activeTab="Courses">
        {page}
    </MentorLayout>
);
