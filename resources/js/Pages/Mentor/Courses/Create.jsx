import { Head, useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import { Box, Paper, keyframes, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';

import MentorCourseMilestone     from '@/Components/Mentor/Courses/MentorCourseMilestone';
import MentorCourseFooterActions from '@/Components/Mentor/Courses/MentorCourseFooterActions';
import CreatePageHeader          from '@/Components/Mentor/Courses/Create/CreatePageHeader';
import CourseDetailsFormFields   from '@/Components/Mentor/Courses/Create/CreateDetailsFormFields';
import CourseThumbnailUpload     from '@/Components/Mentor/Courses/Create/CreateThumbnailUpload';
import MentorLayout              from '@/Layouts/MentorLayout';

// ── Constants ────────────────────────────────────────────────────────────────

const SESSION_KEY = 'createCourse_thumbnail';

// ── Styled ────────────────────────────────────────────────────────────────────

const floatUp = keyframes`
  0%   { opacity: 0; transform: translateY(24px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const AnimatedPaper = styled(Paper)(() => ({
    animation: `${floatUp} 0.55s cubic-bezier(0.22,1,0.36,1) both`,
    transition: 'box-shadow 0.3s ease, transform 0.3s ease',
    '&:hover': {
        boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
        transform: 'translateY(-2px)',
    },
}));

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Create({ categories }) {
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [thumbnailRestored, setThumbnailRestored] = useState(false);
    const [mounted, setMounted] = useState(false);

    const { data, setData, post, processing, errors, transform } = useForm('CreateCourseWizard', {
        category_input:   '',
        category_id:      null,
        custom_category:  '',
        title:            '',
        description:      '',
        duration_value:   '',
        duration_unit:    'hours',
        course_thumbnail: null,
        is_draft:         true,
    });

    // ── Mount: restore thumbnail from sessionStorage ──────────────────────

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50);

        const saved = sessionStorage.getItem(SESSION_KEY);
        if (saved) {
            setThumbnailPreview(saved);
            setThumbnailRestored(true);

            // Re-hydrate the File object from the data URL so the form can submit it
            fetch(saved)
                .then((r) => r.blob())
                .then((blob) => {
                    const ext  = blob.type.split('/')[1] ?? 'jpg';
                    const file = new File([blob], `thumbnail.${ext}`, { type: blob.type });
                    setData('course_thumbnail', file);
                })
                .catch(() => {
                    // If conversion fails, clear the stale entry
                    sessionStorage.removeItem(SESSION_KEY);
                    setThumbnailPreview(null);
                    setThumbnailRestored(false);
                });
        }

        return () => clearTimeout(t);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Persist thumbnail preview whenever it changes ────────────────────

    useEffect(() => {
        if (thumbnailPreview) {
            try {
                sessionStorage.setItem(SESSION_KEY, thumbnailPreview);
            } catch {
                // sessionStorage quota exceeded — silently skip
            }
        } else {
            sessionStorage.removeItem(SESSION_KEY);
        }
    }, [thumbnailPreview]);

    // ── Derived ───────────────────────────────────────────────────────────

    const selectedCategoryOption = data.category_id
        ? (categories.find((c) => c.id === data.category_id) ?? null)
        : (data.category_input || null);

    // ── Thumbnail handlers ────────────────────────────────────────────────

    const applyFile = useCallback((file) => {
        setData('course_thumbnail', file);
        setThumbnailRestored(false);
        const reader = new FileReader();
        reader.onload = (e) => setThumbnailPreview(e.target.result);
        reader.readAsDataURL(file);
    }, [setData]);

    const removeThumbnail = useCallback(() => {
        setData('course_thumbnail', null);
        setThumbnailPreview(null);
        setThumbnailRestored(false);
        sessionStorage.removeItem(SESSION_KEY);
    }, [setData]);

    // ── Submit / Discard ──────────────────────────────────────────────────

    const clearSession = useCallback(() => {
        sessionStorage.removeItem(SESSION_KEY);
    }, []);

    const handleSubmit = useCallback((e, isDraft = true, redirectLocation = 'next') => {
        e.preventDefault();

        transform((d) => {
            const payload = {};
            if (d.title)       payload.title       = d.title;
            if (d.description) payload.description = d.description;

            const durNum = d.duration_value !== '' && d.duration_value != null
                ? Number(d.duration_value) : null;
            if (durNum && !Number.isNaN(durNum) && durNum > 0)
                payload.duration = d.duration_unit === 'minutes' ? `${durNum}m` : `${durNum}h`;

            if (d.course_thumbnail) payload.course_thumbnail = d.course_thumbnail;

            if (d.category_id) {
                payload.category_id     = d.category_id;
                payload.custom_category = null;
            } else if (d.category_input) {
                payload.category_id     = null;
                payload.custom_category = d.category_input;
            }

            payload.is_draft    = isDraft;
            payload.redirect_to = redirectLocation;
            return payload;
        });

        post(route('mentor.courses.store'), {
            forceFormData: true,
            onSuccess: clearSession,         // ← wipe session on successful save
        });
    }, [transform, post, clearSession]);

    const handleDiscard = useCallback(() => {
        if (confirm('Are you sure you want to discard this course? All progress will be lost.')) {
            clearSession();
            window.location.href = route('mentor.courses.index');
        }
    }, [clearSession]);

    // ── Render ────────────────────────────────────────────────────────────

    return (
        <>
            <Head title="Create Course - Details" />

            <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50', pb: 44 }}>
                <Box sx={{ flex: 1 }}>
                    {/* Step indicator */}
                    <Fade in={mounted} style={{ transitionDelay: '80ms' }}>
                        <Box
                            sx={{
                                mx: 'auto',
                                px: { xs: 2, sm: 3, lg: 4 },
                                mb: 2,
                                // STICKY LOGIC
                                position: 'sticky',
                                top: 0,
                                zIndex: 1000,
                                bgcolor: 'grey.50', // Matches page background to prevent text bleeding
                                py: 2, // Vertical padding for breathing room when stuck to the top
                            }}
                        >
                            <MentorCourseMilestone currentStep={0} />
                        </Box>
                    </Fade>

                    <Box sx={{ mx: 'auto', maxWidth: 960, px: { xs: 2, sm: 3, lg: 4 }, py: 4 }}>
                        <CreatePageHeader mounted={mounted} />

                        <Box component="form" onSubmit={(e) => e.preventDefault()}>
                            <AnimatedPaper sx={{ p: 4, borderRadius: 3 }}>
                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: { xs: '1fr', lg: '3fr 2fr' },
                                        gap: 4,
                                    }}
                                >
                                    <CourseDetailsFormFields
                                        data={data}
                                        setData={setData}
                                        errors={errors}
                                        categories={categories}
                                        selectedCategoryOption={selectedCategoryOption}
                                    />

                                    <CourseThumbnailUpload
                                        thumbnailPreview={thumbnailPreview}
                                        isRestored={thumbnailRestored}
                                        onFileChange={applyFile}
                                        onRemove={removeThumbnail}
                                        error={errors.course_thumbnail}
                                    />
                                </Box>
                            </AnimatedPaper>

                            <MentorCourseFooterActions
                                onDiscard={handleDiscard}
                                onSaveAsDraft={(e) => handleSubmit(e, true, 'index')}
                                onBack={() => router.visit(route('mentor.courses.index'))}
                                onNext={(e) => handleSubmit(e, true, 'next')}
                                nextLabel="Next Step"
                                processing={processing}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

Create.layout = (page) => (
    <MentorLayout auth={page.props.auth} activeTab="Courses">
        {page}
    </MentorLayout>
);
