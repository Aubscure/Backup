/**
 * resources/js/Pages/Enrollee/Courses/Show.jsx
 *
 * Layout shell only — every visual section lives under
 * resources/js/Components/Enrollee/Courses/Show/
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import EnrolleeSidebar from '@/Components/Enrollee/EnrolleeSidebar';
import {
    Box, Typography, Paper, Stack, Button,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, useMediaQuery, useTheme,
    Snackbar, Alert
} from '@mui/material';

import LockIcon                     from '@mui/icons-material/Lock';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import ArrowBackIosNewRoundedIcon   from '@mui/icons-material/ArrowBackIosNewRounded';

// ── Sub-components ────────────────────────────────────────────────────────────
import TopBar        from '@/Components/Enrollee/Courses/Show/TopBar';
import CourseHero    from '@/Components/Enrollee/Courses/Show/CourseHero'; // Replaces PlanCard
import OverviewTab   from '@/Components/Enrollee/Courses/Show/tabs/OverviewTab';
import CurriculumTab from '@/Components/Enrollee/Courses/Show/tabs/CurriculumTab';
import InstructorTab from '@/Components/Enrollee/Courses/Show/tabs/MentorTab';
import ReviewsTab    from '@/Components/Enrollee/Courses/Show/tabs/ReviewTab';
import { SIDEBAR_WIDTH, EASE, formatCurrency } from '@/Components/Enrollee/Courses/Show/Utils';

export default function EnrolleeCourseShow({ course, hasAccess, isFree, coursePrice, enrollment }) {
    const { props } = usePage();
    const flash    = props.flash    || {};
    const authUser = props.auth?.user || {};
    const theme    = useTheme();

    // ── UI state ──────────────────────────────────────────────────────────────
    const [mobileOpen,       setMobileOpen]       = useState(false);
    const [activeTab,        setActiveTab]         = useState('overview');
    const [lockModalOpen,    setLockModalOpen]     = useState(false);
    const [paymentModalOpen, setPaymentModalOpen]  = useState(false);
    const [amountPaid,       setAmountPaid]        = useState(coursePrice ? String(coursePrice) : '');
    const [amountError,      setAmountError]       = useState('');
    const [submitting,       setSubmitting]        = useState(false);
    const [snack,            setSnack]             = useState({ open: false, msg: '', severity: 'success' });
    const [userRating,       setUserRating]        = useState(0);
    const [reviewSubmitted,  setReviewSubmitted]   = useState(false);
    const [ratingHover,      setRatingHover]       = useState(0);

    useEffect(() => {
        if (flash.success) setSnack({ open: true, msg: flash.success, severity: 'success' });
        else if (flash.info)  setSnack({ open: true, msg: flash.info,  severity: 'info' });
        else if (flash.error) setSnack({ open: true, msg: flash.error, severity: 'error' });
    }, [flash.success, flash.info, flash.error]);

    const closeSnack = useCallback(() => setSnack((s) => ({ ...s, open: false })), []);

    // ── Derived data ──────────────────────────────────────────────────────────
    const plans          = course.course_plans || course.coursePlans || [];
    const mentorName     = course.user ? `${course.user.firstname || ''} ${course.user.lastname || ''}`.trim() : 'Unknown Mentor';
    const mentorInitial  = mentorName?.[0]?.toUpperCase() || 'M';
    const durationLabel  = course.duration_label || '-';
    const hasCertificate = !!course.certificate;
    const enrolleeCount  = course.students_count ?? course.enrollees_count ?? course.enrollments_count ?? null;
    const rating         = course.average_rating || course.rating || 0;
    const reviewCount    = course.ratings_count  || course.reviews_count || 0;
    const category       = course.category?.name || course.custom_category || null;
    const syllabuses     = course.syllabuses || [];

    const totalCourses = course.user?.courses_count || 0;
    const totalModules = syllabuses.length;
    const totalVideos   = syllabuses.reduce((a, s) => a + (s.lessons?.reduce((b, l) => b + (l.videos?.length || 0), 0) || 0), 0);
    const totalLessons = syllabuses.reduce((a, s) => a + (s.lessons?.length || 0), 0);
    const totalFiles   = syllabuses.reduce((a, s) => a + (s.lessons || []).reduce((b, l) => b + (l.materials?.length || 0), 0), 0);
    const totalAssessments = syllabuses.reduce(
        (a, s) => a + (s.assessments?.length || 0) + (s.lessons || []).reduce((b, l) => b + (l.assessments?.length || 0), 0), 0,
    );

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleProceedToPayment = useCallback(() => {
        setLockModalOpen(false);
        setAmountPaid(coursePrice ? String(coursePrice) : '');
        setAmountError('');
        setPaymentModalOpen(true);
    }, [coursePrice]);

    const handleSubmitPayment = useCallback((e) => {
        e.preventDefault();
        const num = parseFloat(amountPaid);
        if (Number.isNaN(num) || num < 0) { setAmountError('Please enter a valid amount.'); return; }
        setAmountError('');
        setSubmitting(true);
        router.post(
            route('enrollee.courses.record-payment', course.id),
            { amount_paid: num },
            {
                onFinish:  () => setSubmitting(false),
                onSuccess: () => { setPaymentModalOpen(false); setSnack({ open: true, msg: 'Payment recorded. You now have access!', severity: 'success' }); },
                onError:   (errors) => setAmountError(errors?.amount_paid?.[0] || 'Something went wrong. Please try again.'),
            }
        );
    }, [amountPaid, course.id]);

    const handleStartCourse  = useCallback(() => router.post(route('enrollee.courses.start',  course.id)), [course.id]);

    const handleSubmitReview = useCallback(() => {
        if (!userRating) return;
        setReviewSubmitted(true);
        setSnack({ open: true, msg: 'Thank you for your rating!', severity: 'success' });
    }, [userRating]);

    // ── CTA button ────────────────────────────────────────────────────────────
    const CtaButton = hasAccess ? (
        <Button fullWidth variant="contained" size="large" onClick={handleStartCourse}
            startIcon={<PlayCircleOutlineRoundedIcon />}
            sx={{ bgcolor: 'success.main', fontWeight: 800, textTransform: 'none', borderRadius: 2.5, py: 1.4, fontSize: '0.95rem', boxShadow: '0 4px 18px rgba(76,175,80,0.35)', transition: `all 250ms ${EASE}`, '&:hover': { bgcolor: 'success.dark', transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(76,175,80,0.4)' } }}>
            {enrollment ? 'Continue Learning' : 'Start Course'}
        </Button>
    ) : (
        <Button fullWidth variant="contained" size="large" onClick={() => setLockModalOpen(true)}
            sx={{ bgcolor: 'success.main', fontWeight: 800, textTransform: 'none', borderRadius: 2.5, py: 1.4, fontSize: '0.95rem', boxShadow: '0 4px 18px rgba(76,175,80,0.35)', transition: `all 250ms ${EASE}`, '&:hover': { bgcolor: 'success.dark', transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(76,175,80,0.4)' } }}>
            {isFree ? 'Enroll for Free' : 'Unlock Course'}
        </Button>
    );

    const TABS = [
        { key: 'overview',   label: 'Overview' },
        { key: 'curriculum', label: `Curriculum${totalLessons > 0 ? ` (${totalLessons})` : ''}` },
        { key: 'instructor', label: 'Instructor' },
        { key: 'reviews',    label: 'Reviews' },
    ];

    // ── Main content ──────────────────────────────────────────────────────────
    const mainContent = (
        <>
            <TopBar onMenuToggle={() => setMobileOpen((o) => !o)} />

            <Box sx={{ maxWidth: 1000, mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, pt: 3, pb: 5,  }}>
                <Button size="small"
                    startIcon={<ArrowBackIosNewRoundedIcon sx={{ fontSize: '0.7rem !important' }} />}
                    onClick={() => router.visit(route('enrollee.courses.index'))}
                    sx={{ textTransform: 'none', color: 'text.secondary', mb: 2.5, fontWeight: 500, '&:hover': { color: 'success.main', bgcolor: 'transparent' } }}>
                    Back to courses
                </Button>

                {/* Extracted Course Hero Component (Includes Pricing Plans) */}
                <CourseHero
                    course={course} category={category} hasAccess={hasAccess} isFree={isFree}
                    mentorName={mentorName} mentorInitial={mentorInitial} userRating={userRating}
                    rating={rating} reviewCount={reviewCount} durationLabel={durationLabel}
                    totalModules={totalModules} totalLessons={totalLessons} totalFiles={totalFiles}
                    totalAssessments={totalAssessments} enrolleeCount={enrolleeCount}
                    hasCertificate={hasCertificate} plans={plans} CtaButton={CtaButton} totalVideos={totalVideos}
                />

                {/* Tabs Layout */}
                <Box>
                    <Stack direction="row" sx={{ borderBottom: '1.5px solid', borderColor: 'divider', my: 3, overflowX: 'auto' }}>
                        {TABS.map((tab) => (
                            <Button key={tab.key} onClick={() => setActiveTab(tab.key)}
                                sx={{
                                    textTransform: 'none', fontWeight: 700, fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                    px: { xs: 1.5, sm: 2 }, borderRadius: 0, mb: '-1.5px', whiteSpace: 'nowrap',
                                    color: activeTab === tab.key ? 'success.main' : 'text.secondary',
                                    borderBottom: '2.5px solid', borderColor: activeTab === tab.key ? 'success.main' : 'transparent',
                                    transition: `color 150ms ${EASE}`,
                                    '&:hover': { color: 'success.main', bgcolor: 'transparent' },
                                }}>
                                {tab.label}
                            </Button>
                        ))}
                    </Stack>

                    {activeTab === 'overview'   && <OverviewTab   course={course} hasCertificate={hasCertificate} enrollment={enrollment} hasAccess={hasAccess} mentorName={mentorName} authUser={authUser} />}
                    {activeTab === 'curriculum' && <CurriculumTab syllabuses={syllabuses} hasAccess={hasAccess} />}
                    {activeTab === 'instructor' && <InstructorTab course={course} mentorName={mentorName} mentorInitial={mentorInitial} totalLessons={totalLessons} enrolleeCount={enrolleeCount} rating={rating} totalCourses={totalCourses} />}
                    {activeTab === 'reviews'    && <ReviewsTab    rating={rating} reviewCount={reviewCount} hasAccess={hasAccess} userRating={userRating} setUserRating={setUserRating} ratingHover={ratingHover} setRatingHover={setRatingHover} reviewSubmitted={reviewSubmitted} onSubmitReview={handleSubmitReview} />}
                </Box>
            </Box>
        </>
    );

    return (
        <>
            <Head title={course.title} />
            <Box sx={{ minHeight: '250vh', bgcolor: '#fafafa' }}>
                <EnrolleeSidebar activePage="courses" mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

                <Box sx={{ ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` }, transition: theme.transitions.create('margin') }}>
                    {!hasAccess && !isFree ? (
                        <Box sx={{ position: 'relative' }}>
                            <Box sx={{ filter: 'blur(4px)', pointerEvents: 'none', userSelect: 'none', opacity: 0.6 }}>{mainContent}</Box>
                            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(250,250,250,0.55)', zIndex: 10 }}>
                                <Paper elevation={8} sx={{ borderRadius: 4, p: { xs: 3, sm: 4 }, textAlign: 'center', maxWidth: 380, mx: 2 }}>
                                    <Box sx={{ width: 68, height: 68, borderRadius: '50%', bgcolor: 'success.50', border: '2px solid', borderColor: 'success.light', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, boxShadow: '0 8px 24px rgba(76,175,80,0.2)' }}>
                                        <LockIcon sx={{ fontSize: 32, color: 'success.main' }} />
                                    </Box>
                                    <Typography variant="h6" fontWeight={800} sx={{ mb: 0.75 }}>Course locked</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.75 }}>
                                        Unlock full access to all lessons, materials, and your certificate of completion.
                                    </Typography>
                                    {coursePrice > 0 && (
                                        <Typography variant="h5" fontWeight={900} color="success.main" sx={{ mb: 2.5 }}>
                                            {formatCurrency(coursePrice)}
                                        </Typography>
                                    )}
                                    <Button fullWidth variant="contained" size="large" onClick={() => setLockModalOpen(true)}
                                        sx={{ bgcolor: 'success.main', fontWeight: 800, textTransform: 'none', borderRadius: 2.5, py: 1.35, boxShadow: '0 4px 16px rgba(76,175,80,0.35)', '&:hover': { bgcolor: 'success.dark' } }}>
                                        Proceed to Payment
                                    </Button>
                                </Paper>
                            </Box>
                        </Box>
                    ) : mainContent}
                </Box>
            </Box>

            {/* Unlock Modal */}
            <Dialog open={lockModalOpen} onClose={() => setLockModalOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle sx={{ fontWeight: 800, pb: 0.5 }}>Unlock this course</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Access will be granted after your payment is recorded and confirmed by our team.
                    </Typography>
                    {coursePrice > 0 && (
                        <Paper elevation={0} sx={{ bgcolor: 'success.50', borderRadius: 2, p: 2, textAlign: 'center' }}>
                            <Typography variant="caption" color="success.dark" fontWeight={700} display="block">Course Price</Typography>
                            <Typography variant="h5" fontWeight={900} color="success.main">{formatCurrency(coursePrice)}</Typography>
                        </Paper>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button onClick={() => setLockModalOpen(false)} sx={{ textTransform: 'none', color: 'text.secondary' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleProceedToPayment}
                        sx={{ bgcolor: 'success.main', textTransform: 'none', fontWeight: 700, borderRadius: 2, '&:hover': { bgcolor: 'success.dark' } }}>
                        Proceed to Payment
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Payment Modal */}
            <Dialog open={paymentModalOpen} onClose={() => !submitting && setPaymentModalOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <Box component="form" onSubmit={handleSubmitPayment}>
                    <DialogTitle fontWeight={800}>Record your payment</DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                            Enter the exact amount you paid. Access is granted after submission and verification.
                        </Typography>
                        {coursePrice > 0 && (
                            <Paper elevation={0} sx={{ bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.200', borderRadius: 2, p: 1.5, mb: 2 }}>
                                <Typography variant="caption" color="text.disabled">Expected amount</Typography>
                                <Typography variant="body1" fontWeight={700}>{formatCurrency(coursePrice)}</Typography>
                            </Paper>
                        )}
                        <TextField fullWidth label="Amount paid (PHP)" type="number"
                            inputProps={{ min: 0, step: 0.01 }}
                            value={amountPaid}
                            onChange={(e) => { setAmountPaid(e.target.value); setAmountError(''); }}
                            error={!!amountError} helperText={amountError}
                            required autoFocus
                            sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'success.main' }, '& label.Mui-focused': { color: 'success.main' } }}
                        />
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                        <Button type="button" onClick={() => setPaymentModalOpen(false)} disabled={submitting} sx={{ textTransform: 'none', color: 'text.secondary' }}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={submitting}
                            sx={{ bgcolor: 'success.main', textTransform: 'none', fontWeight: 700, borderRadius: 2, minWidth: 140, '&:hover': { bgcolor: 'success.dark' } }}>
                            {submitting ? 'Submitting…' : 'Submit Payment'}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

            {/* Snackbar */}
            <Snackbar open={snack.open} autoHideDuration={5000} onClose={closeSnack} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={closeSnack} severity={snack.severity} variant="filled" sx={{ width: '100%', borderRadius: 2 }}>
                    {snack.msg}
                </Alert>
            </Snackbar>
        </>
    );
}
