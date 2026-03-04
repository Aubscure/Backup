import { Box, Grid, keyframes } from '@mui/material';
import { Head } from '@inertiajs/react';
import MentorLayout from '@/Layouts/MentorLayout';

// ─── Analytics Components ─────────────────────────────────────────────────────
import AnalyticsPageHeader      from '@/Components/Mentor/Analytics/AnalyticsPageHeader';
import AnalyticsStatCards       from '@/Components/Mentor/Analytics/AnalyticsStatCards';
import AnalyticsEnrollmentChart from '@/Components/Mentor/Analytics/AnalyticsEnrollmentChart';
import AnalyticsStatusBreakdown from '@/Components/Mentor/Analytics/AnalyticsStatusBreakdown';
import AnalyticsRevenueChart    from '@/Components/Mentor/Analytics/AnalyticsRevenueChart';
import AnalyticsCourseTable     from '@/Components/Mentor/Analytics/AnalyticsCourseTable';

// ─── Animation ────────────────────────────────────────────────────────────────
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Animated section wrapper ─────────────────────────────────────────────────
const Section = ({ children, delay = '0s' }) => (
    <Box
        sx={{
            animation: `${fadeInUp} 0.45s ease-out both`,
            animationDelay: delay,
        }}
    >
        {children}
    </Box>
);

// ─── Default empty data arrays (filled by the Laravel controller) ─────────────
const DEFAULT_ENROLLMENT_TRENDS  = [];
const DEFAULT_REVENUE_TRENDS     = [];
const DEFAULT_STATUS_DATA        = [];
const DEFAULT_COURSE_PERFORMANCE = [];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AnalyticsIndex({
    metrics            = {},
    course_performance = DEFAULT_COURSE_PERFORMANCE,
    enrollment_trends  = undefined,
    revenue_trends     = undefined,
    status_breakdown   = undefined,
}) {
    const handleExport = () => {
        console.info('Export report triggered');
    };

    return (
        <>
            <Head title="Analytics" />

            <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh' }}>
                <Box
                    component="main"
                    sx={{
                       
                        p: { xs: 1.5, sm: 2.5, md: 4 },
                        maxWidth: 1440,
                        mx: 'auto',
                    }}
                >
                    {/* ── Header ─────────────────────────────────────── */}
                    <Section delay="0s">
                        <AnalyticsPageHeader onExport={handleExport} />
                    </Section>

                    {/* ── KPI Stat Cards ─────────────────────────────── */}
                    <Section delay="0.05s">
                        
                        <Box sx={{ mt: { xs: 2, sm: 2.5, md: 3 }, mb: { xs: 2, sm: 2.5, md: 3 } }}>
                            <AnalyticsStatCards metrics={metrics} />
                        </Box>
                    </Section>

                    {/* ── Charts ─────────────────────────────────────── */}
                    <Section delay="0.10s">

                        <Grid
                            container
                            // ── xs: tighter gap between chart cards; sm+: original 2.5
                            spacing={{ xs: 1.5, sm: 2, md: 2.5 }}
                            sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}
                            alignItems="stretch"
                        >

                            {/* ── Enrollment Trends ── */}
                            <Grid item xs={12} lg={8} sx={{ display: 'flex' }}>
                                <AnalyticsEnrollmentChart data={enrollment_trends} />
                            </Grid>

                            {/* ── Status Breakdown ── */}
                            <Grid item xs={12} sm={6} lg={4} sx={{ display: 'flex' }}>
                                <AnalyticsStatusBreakdown data={status_breakdown} />
                            </Grid>

                            {/* ── Revenue Trends ── */}
                            <Grid item xs={12} sm={6} lg={12} sx={{ display: 'flex' }}>
                                <AnalyticsRevenueChart data={revenue_trends} />
                            </Grid>

                        </Grid>
                    </Section>

                    {/* ── Course Performance Table ────────────────────── */}
                    <Section delay="0.15s">
                        {/*
                         *  Note: mt:8 that was on the Paper inside AnalyticsCourseTable
                         *  has been removed — spacing is handled here by the Section gap
                         *  produced by the mb on the charts Grid above.
                         */}
                        <AnalyticsCourseTable courses={course_performance} />
                    </Section>
                </Box>
            </Box>
        </>
    );
}

AnalyticsIndex.layout = (page) => (
    <MentorLayout auth={page.props.auth} activeTab="Analytics">
        {page}
    </MentorLayout>
);
