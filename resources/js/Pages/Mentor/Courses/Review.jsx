/**
 * Mentor / Courses / Review  (wizard step 4)
 *
 * Final wizard step — shows a preview card + readiness checklist.
 *
 * Component map
 * ─────────────────────────────────────────────────────────────────
 *  ReviewPageHeader     ← NEW  (wraps CoursePageHeader + DraftChip)
 *  ReviewStatusAlerts   ← NEW  (animated info / success banners)
 *  MentorCoursePreviewCard   (existing)
 *  MentorCourseChecklist     (existing)
 *  MentorCourseMilestone     (existing)
 *  MentorCourseFooterActions (existing)
 *  PublishConfirmModal       (existing)
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Head, router }   from '@inertiajs/react';
import { Box, Fade, Grow } from '@mui/material';
import RocketLaunchIcon   from '@mui/icons-material/RocketLaunch';

// Layout
import MentorLayout from '@/Layouts/MentorLayout';

// ── Existing feature components ───────────────────────────────────
import MentorCoursePreviewCard   from '@/Components/Mentor/Courses/Reviews/MentorCoursePreviewCard';
import MentorCourseMilestone     from '@/Components/Mentor/Courses/MentorCourseMilestone';
import MentorCourseChecklist     from '@/Components/Mentor/Courses/Reviews/MentorCourseReviewChecklist';
import MentorCourseFooterActions from '@/Components/Mentor/Courses/MentorCourseFooterActions';
import PublishConfirmModal        from '@/Components/Mentor/Courses/PublishConfirmModal';

// ── New leaf components ───────────────────────────────────────────
import ReviewPageHeader    from '@/Components/Mentor/Courses/Reviews/ReviewPageHeader';
import ReviewStatusAlerts  from '@/Components/Mentor/Courses/Reviews/ReviewStatusAlerts';

// ─── Constants ────────────────────────────────────────────────────

const BG_PAGE = '#fafafa';

// ─── Page ─────────────────────────────────────────────────────────

export default function Review({ course, checklist, mentor, completeness_progress }) {

    const [mounted,          setMounted]          = useState(false);
    const [saving,           setSaving]           = useState(false);
    const [publishing,       setPublishing]       = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    // ── Derived flags (memoised to avoid recalculation on every render) ──
    const allContentReady = useMemo(() => (
        checklist.has_basic_info &&
        checklist.has_curriculum &&
        checklist.has_media      &&
        checklist.has_pricing
    ), [checklist]);

    const readyToPublish = useMemo(() => (
        allContentReady && checklist.has_certificate
    ), [allContentReady, checklist.has_certificate]);

    // ── Handlers ──────────────────────────────────────────────────
    const handleSaveDraft = useCallback(() => {
        setSaving(true);
        router.visit(route('mentor.courses.index'), {
            onFinish: () => setSaving(false),
        });
    }, []);

    const handlePublishConfirm = useCallback(() => {
        setPublishing(true);
        router.post(
            route('mentor.courses.publish', course.id),
            {},
            {
                onSuccess: () => { setShowPublishModal(false); setPublishing(false); },
                onError:   () => { setShowPublishModal(false); setPublishing(false); },
                onFinish:  () => setPublishing(false),
            },
        );
    }, [course.id]);

    const handleDiscard = useCallback(() => {
        if (confirm('Are you sure you want to discard this draft?')) {
            router.delete(route('mentor.courses.destroy', course.id));
        }
    }, [course.id]);

    const openPublishModal  = useCallback(() => setShowPublishModal(true),  []);
    const closePublishModal = useCallback(() => setShowPublishModal(false), []);

    // ── Render ────────────────────────────────────────────────────
    return (
        <>
            <Head title="Create Course – Review" />

            <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: BG_PAGE, pb: 22 }}>
                <Box sx={{ flex: 1, width: { xs: '100%', md: 'calc(100% - 256px)' } }}>

                    {/* ── Milestone stepper ── */}
                    <Fade in={mounted} style={{ transitionDelay: '80ms' }}>
                        <Box sx={{ mx: 'auto', px: { xs: 2, sm: 3, lg: 4 } }}>
                            <MentorCourseMilestone currentStep={4} />
                        </Box>
                    </Fade>

                    {/* ── Main content area ── */}
                    <Box sx={{
                        mx:  'auto',
                        maxWidth: 1280,
                        px: { xs: 2, sm: 4, lg: 6 },
                        py: { xs: 4, md: 6 },
                    }}>

                        {/* 1 ── Page header (title + subtitle + DRAFT chip) */}
                        <ReviewPageHeader
                            mounted={mounted}
                            readyToPublish={readyToPublish}
                        />

                        {/* 2 ── Animated status alerts */}
                        <ReviewStatusAlerts
                            allContentReady={allContentReady}
                            readyToPublish={readyToPublish}
                            hasCertificate={checklist.has_certificate}
                        />

                        {/* 3 ── Preview card */}
                        <Grow
                            in={mounted}
                            timeout={500}
                            style={{ transformOrigin: 'top center', transitionDelay: '200ms' }}
                        >
                            <Box sx={{ mb: 4 }}>
                                <MentorCoursePreviewCard
                                    course={course}
                                    mentor={mentor}
                                    checklist={checklist}
                                />
                            </Box>
                        </Grow>

                        {/* 4 ── Checklist */}
                        <Grow
                            in={mounted}
                            timeout={500}
                            style={{ transformOrigin: 'top center', transitionDelay: '320ms' }}
                        >
                            <Box sx={{ mb: 4 }}>
                                <MentorCourseChecklist
                                    checklist={checklist}
                                    course={course}
                                    progress={completeness_progress}
                                />
                            </Box>
                        </Grow>
                    </Box>
                </Box>
            </Box>

            {/* ── Fixed footer ── */}
            {readyToPublish ? (
                <MentorCourseFooterActions
                    onDiscard={handleDiscard}
                    onSaveAsDraft={handleSaveDraft}
                    onNext={openPublishModal}
                    nextLabel="Publish Now"
                    nextIcon={<RocketLaunchIcon sx={{ fontSize: '18px !important' }} />}
                    nextDisabled={false}
                    processing={saving}
                    discardLabel="Discard Draft"
                    saveLabel="Save as Draft"
                />
            ) : (
                <MentorCourseFooterActions
                    onDiscard={handleDiscard}
                    onSaveAsDraft={handleSaveDraft}
                    onNext={handleSaveDraft}
                    nextLabel="Save Course"
                    nextDisabled={false}
                    processing={saving}
                    discardLabel="Discard Draft"
                />
            )}

            {/* ── Shared publish confirmation modal ── */}
            <PublishConfirmModal
                open={showPublishModal}
                onClose={closePublishModal}
                onConfirm={handlePublishConfirm}
                processing={publishing}
                courseTitle={course.title}
            />
        </>
    );
}

Review.layout = (page) => (
    <MentorLayout auth={page.props.auth} activeTab="Courses">
        {page}
    </MentorLayout>
);
