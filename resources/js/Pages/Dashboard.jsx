/**
 * resources/js/Pages/Mentor/Dashboard.jsx
 */

import React, { useState } from 'react';
import MentorLayout from '@/Layouts/MentorLayout';
import { Head } from '@inertiajs/react';
import { Box, keyframes, Typography } from '@mui/material';

// Verification components
import ExpertiseVerificationModal  from '@/Components/Mentor/Verifications/ExpertiseVerificationModal';
import PendingVerificationSnackbar from '@/Components/Mentor/Verifications/MentorPendingVerificationSnackbar';
import MentorVerificationAlerts    from '@/Components/Mentor/Verifications/MentorVerificationAlerts';

// Pre-course onboarding components
import HeroBanner            from '@/Components/Mentor/Dashboards/HeroBanner';
import StatCards             from '@/Components/Mentor/Dashboards/StatCards';
import VerificationChecklist from '@/Components/Mentor/Dashboards/VerificationChecklist';

// Post-first-course overview
import DashboardOverview     from '@/Components/Mentor/Dashboards/DashboardOverview';

// Congratulations modal
import CongratulationsModal  from '@/Components/Mentor/Dashboards/CongratulationsModal';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Page component
// ─────────────────────────────────────────────────────────────────────────────

export default function Dashboard({
    auth,
    verificationSubmitted,
    openVerification   = false,
    hasCourses         = false,
    courseCount        = 0,
    hasCourse          = false,   // any course exists (draft/published/unpublished)
    hasPublishedCourse = false,   // at least one published course
    stats,
    recentActivity,
    topCourses,
    revenueTrends,
    ...props
}) {
    const isVerified      = auth.user.is_verified === true || auth.user.is_verified === 1;
    const shouldShowModal = openVerification && !verificationSubmitted && !isVerified;

    // ── Onboarding completion flag — persisted in localStorage per user ───────
    // Once set, the user always sees DashboardOverview regardless of course count.
    // This is intentional: the checklist is a one-time onboarding tool, not a
    // live state tracker. Deleting courses should never send a mentor back to
    // the beginner flow (industry standard: Teachable, Kajabi, Thinkific, etc.)
    const congratsStorageKey = `mentor_congrats_seen_${auth.user.id}`;

    const [congratsSeen, setCongatsSeen] = useState(() => {
        try {
            return localStorage.getItem(congratsStorageKey) === 'true';
        } catch {
            return false;
        }
    });

    // ── All 4 checklist steps complete ────────────────────────────────────────
    const allStepsComplete = isVerified && hasCourse && hasPublishedCourse;

    const [showCongrats, setShowCongrats] = useState(
        allStepsComplete && !congratsSeen
    );

    const handleCongratsClose = () => {
        setShowCongrats(false);
        try {
            localStorage.setItem(congratsStorageKey, 'true');
        } catch { /* localStorage unavailable — silently ignore */ }
        setCongatsSeen(true);
    };

    // Once the congrats flag is set in localStorage, always show the overview —
    // even if the user later deletes all their courses.
    const showOverview = hasCourses || congratsSeen;

    // ── Verification modal / snackbar ─────────────────────────────────────────
    const [showModal, setShowModal] = useState(shouldShowModal);
    const [showPendingSnackbar, setShowPendingSnackbar] = useState(
        openVerification && verificationSubmitted && !isVerified
    );

    const handleVerifyClick = () => {
        verificationSubmitted ? setShowPendingSnackbar(true) : setShowModal(true);
    };

    return (
        <>
            <Head title="Dashboard" />

            <Box
                component="section"
                sx={{
                    p:         { xs: 2, md: 4 },
                    maxWidth:  '1500px',
                    mx:        'auto',
                    width:     '100%',
                    boxSizing: 'border-box',
                }}
            >
                {/* Verification alerts — always visible */}
                <Box sx={{ animation: `${fadeInUp} 0.5s ease-out`, mb: 2 }}>
                    <MentorVerificationAlerts
                        isVerified={isVerified}
                        verificationSubmitted={verificationSubmitted}
                    />
                </Box>

                {showOverview ? (

                    /* ── Post-onboarding dashboard (permanent once seen) ─── */
                    <Box sx={{ animation: `${fadeInUp} 0.55s ease-out` }}>
                        <DashboardOverview
                            auth={auth}
                            stats={stats}
                            recentActivity={recentActivity}
                            topCourses={topCourses}
                            revenueTrends={revenueTrends}
                            courseCount={courseCount}
                        />
                    </Box>

                ) : (

                    /* ── Pre-course onboarding flow ─────────────────────── */
                    <>
                        <Box sx={{ mb: { xs: 2, md: 4 } }}>
                            <Typography
                                variant="h3"
                                fontWeight={700}
                                color="text.primary"
                                sx={{ letterSpacing: '-0.5px' }}
                            >
                                Dashboard
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.25 }}>
                                Welcome back,{' '}
                                <Box
                                    component="span"
                                    fontWeight={700}
                                    fontSize="22px"
                                    sx={{ color: '#15803d' }}
                                >
                                    {auth.user.firstname}!
                                </Box>{' '}
                                Manage and track your mentoring performance.
                            </Typography>
                        </Box>

                        <Box sx={{ animation: `${fadeInUp} 0.55s ease-out both`, animationDelay: '0.05s' }}>
                            <HeroBanner
                                isVerified={isVerified}
                                verificationSubmitted={verificationSubmitted}
                                onVerifyClick={handleVerifyClick}
                            />
                        </Box>

                        <Box sx={{ animation: `${fadeInUp} 0.55s ease-out both`, animationDelay: '0.15s' }}>
                            <StatCards isVerified={isVerified} />
                        </Box>

                        <Box sx={{ animation: `${fadeInUp} 0.55s ease-out both`, animationDelay: '0.25s' }}>
                            <VerificationChecklist
                                isVerified={isVerified}
                                verificationSubmitted={verificationSubmitted}
                                hasCourse={hasCourse}
                                hasPublishedCourse={hasPublishedCourse}
                            />
                        </Box>
                    </>
                )}
            </Box>

            {/* ── Congratulations modal ── */}
            <CongratulationsModal
                open={showCongrats}
                onClose={handleCongratsClose}
            />

            {/* ── Verification modals / Snackbars ── */}
            <PendingVerificationSnackbar
                open={showPendingSnackbar}
                onClose={() => setShowPendingSnackbar(false)}
            />
            <ExpertiseVerificationModal
                open={showModal}
                onClose={() => setShowModal(false)}
                auth={auth}
                {...props}
            />
        </>
    );
}

Dashboard.layout = (page) => (
    <MentorLayout
        auth={page.props.auth}
        activeTab="Dashboard"
    >
        {page}
    </MentorLayout>
);