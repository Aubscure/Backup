import React from 'react';
import { Box, Grid, Typography, Chip, keyframes } from '@mui/material';
import { ActiveMentorBanner } from '@/Components/Mentor/Dashboards/HeroBanner';
import ActionCards            from '@/Components/Mentor/Dashboards/Overview/ActionCards';
import DashboardStatCards     from '@/Components/Mentor/Dashboards/Overview/DashboardStatCards';
import RevenueTrendsChart     from '@/Components/Mentor/Dashboards/Overview/RevenueTrendsChart';
import TopPerformingCourses   from '@/Components/Mentor/Dashboards/Overview/TopPerformingCourses';
import RecentActivity         from '@/Components/Mentor/Dashboards/Overview/RecentActivity';
import MentorLayout           from '@/Layouts/MentorLayout';
import Dashboard from '@/Pages/Dashboard';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
`;

const animBox = (delay = 0) => ({
    animation: `${fadeInUp} 0.55s ease-out both`,
    animationDelay: `${delay}s`,
});

export default function DashboardOverview({
    auth,
    stats,
    recentActivity,
    topCourses,
    revenueTrends,
    courseCount = 0,
}) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

            {/* ── Header row: title left, action buttons right — responsive ── */}
            <Box sx={{
                ...animBox(0),
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'stretch', md: 'center' },
                justifyContent: 'space-between',
                gap: 1,
                mb : { xs: 0, md: 3 }
            }}>
                <Box sx={{ flex: '1 1 auto', maxWidth: '400px',  }}>
                    <Typography variant="h3" fontWeight={600} color="text.primary" sx={{ letterSpacing: '-0.5px', fontSize: { xs: '1.75rem', md: '2rem' } }}>
                        Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.25 }}>
                        Welcome back, <Box component="span" fontWeight={600} fontSize={{ xs: '1.1rem', md: '22px' }} sx={{ color: '#15803d' }}>{auth.user.firstname}!</Box>{' '}
                        Manage and track your mentoring performance.
                    </Typography>
                </Box>
                    {/* ── Action Cards ── */}
                    <Box sx={{ flexShrink: 0, display: 'flex', flexDirection:{ xs: 'column', sm: 'column', md: 'row' }, justifyContent: { xs: 'stretch', md: 'flex-end' } }}>
                        <ActionCards />
                    </Box>
            </Box>


            {/* ── Motivational Banner (State 4) ── */}
            <Box sx={animBox(0.10)}>
                <ActiveMentorBanner courseCount={courseCount} />
            </Box>

            {/* ── Stat Cards ── */}
            <Box sx={animBox(0.15)}>
                <DashboardStatCards stats={stats} />
            </Box>

            {/* ── Revenue Chart ── */}
            <Box sx={animBox(0.20)}>
                <RevenueTrendsChart data={revenueTrends} />
            </Box>

            {/* ── Bottom Row ── */}
            <Box sx={animBox(0.25)}>
                <Grid container sx={{ flexGrow: 1, justifyContent: 'space-between', gap: 1 }}>
                    <Grid item xs={12} md={6} sx={{ minWidth: {md: '49%'} }}>
                        <TopPerformingCourses courses={topCourses} />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ minWidth: {md: '49%'} }}>
                        <RecentActivity activities={recentActivity} />
                    </Grid>
                </Grid>
            </Box>

        </Box>
    );

}
    DashboardOverview.layout = (page) => (
        <MentorLayout
            auth={page.props.auth}
            activeTab="Courses"
        >
            {page}
        </MentorLayout>
    );
