import RichTextEditor from '@/Components/Mentor/Courses/MentorRichTextEditor';
import MentorCourseMilestone from '@/Components/Mentor/Courses/MentorCourseMilestone';
import MentorCourseFooterActions from '@/Components/Mentor/Courses/MentorCourseFooterActions';
import SyllabusPageHeader from '@/Components/Mentor/Courses/Syllabus/SyllabusPageHeader';
import SyllabusModuleCard from '@/Components/Mentor/Courses/Syllabus/SyllabusModuleCard';
import SyllabusAddModuleButton from '@/Components/Mentor/Courses/Syllabus/SyllabusAddModuleButton';
import MentorLayout from '@/Layouts/MentorLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import { Fade, Box, Stack } from '@mui/material';
import { TransitionGroup } from 'react-transition-group';
import Collapse from '@mui/material/Collapse';

// ── Helpers ────────────────────────────────────────────────────────────────

const makeTmpId  = ()        => `tmp-${Date.now()}`;
const makeTmpLsn = ()        => ({ id: `tmp-lesson-${Date.now()}`, title: 'Lesson Title', description: '' });

const DEFAULT_MODULE = () => ({
    id:          makeTmpId(),
    title:       'Module Title (e.g. Core Concepts)',
    description: '',
    lessons:     [makeTmpLsn()],
});

const initModules = (syllabuses = []) => {
    if (syllabuses.length > 0) {
        return syllabuses.map((m) => ({
            id:          m.id,
            title:       m.title       || 'Untitled Module',
            description: m.description || '',
            lessons: (m.lessons ?? []).map((l) => ({
                id:          l.id,
                title:       l.title       || 'Lesson Title',
                description: l.description || '',
            })),
        }));
    }
    return [{
        id:          makeTmpId(),
        title:       'Introduction to the Course',
        description: 'This module covers the basics of the platform and sets expectations for the course.',
        lessons:     [{ id: `tmp-lesson-${Date.now()}`, title: 'Lesson 1', description: '' }],
    }];
};

// ── Page ──────────────────────────────────────────────────────────────────

export default function Syllabus({ course, errors }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mounted,      setMounted]      = useState(false);
    const [modules,      setModules]      = useState(() => initModules(course?.syllabuses));

    useEffect(() => { setMounted(true); }, []);

    // ── Module handlers ──────────────────────────────────────────────────

    const handleModuleTitleChange = useCallback((moduleId, value) =>
        setModules((prev) => prev.map((m) => m.id === moduleId ? { ...m, title: value } : m)),
    []);

    const handleModuleDescriptionChange = useCallback((moduleId, html) =>
        setModules((prev) => prev.map((m) => m.id === moduleId ? { ...m, description: html } : m)),
    []);

    const addModule = useCallback(() =>
        setModules((prev) => [...prev, DEFAULT_MODULE()]),
    []);

    const removeModule = useCallback((moduleId) => {
        if (confirm('Are you sure you want to remove this module?'))
            setModules((prev) => prev.filter((m) => m.id !== moduleId));
    }, []);

    // ── Lesson handlers ──────────────────────────────────────────────────

    const addLesson = useCallback((moduleId) =>
        setModules((prev) => prev.map((m) =>
            m.id === moduleId
                ? { ...m, lessons: [...m.lessons, makeTmpLsn()] }
                : m,
        )),
    []);

    const handleLessonTitleChange = useCallback((moduleId, lessonId, value) =>
        setModules((prev) => prev.map((m) =>
            m.id === moduleId
                ? { ...m, lessons: m.lessons.map((l) => l.id === lessonId ? { ...l, title: value } : l) }
                : m,
        )),
    []);

    const handleLessonDescriptionChange = useCallback((moduleId, lessonId, html) =>
        setModules((prev) => prev.map((m) =>
            m.id === moduleId
                ? { ...m, lessons: m.lessons.map((l) => l.id === lessonId ? { ...l, description: html } : l) }
                : m,
        )),
    []);

    const removeLesson = useCallback((moduleId, lessonId) =>
        setModules((prev) => prev.map((m) =>
            m.id === moduleId
                ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
                : m,
        )),
    []);

    // ── Submit / Discard ─────────────────────────────────────────────────

    const handleSubmit = useCallback((e, isDraft = false) => {
        e.preventDefault();

        const normalizedModules = modules
            .map((m) => ({
                id:          Number.isInteger(m.id) ? m.id : null,
                title:       m.title?.trim()        || '',
                description: m.description          || '',
                lessons: (m.lessons || []).map((l) => ({
                    id:          Number.isInteger(l.id) ? l.id : null,
                    title:       l.title?.trim()        || '',
                    description: l.description          || '',
                })),
            }))
            .filter((m) => m.title || m.description || m.lessons.length > 0);

        setIsSubmitting(true);
        router.post(
            route('mentor.courses.syllabus.save', course.id),
            { modules: normalizedModules, is_draft: isDraft, next_step: !isDraft, redirect_to: isDraft ? 'index' : undefined },
            {
                preserveScroll: true,
                onFinish:  () => setIsSubmitting(false),
                onSuccess: () => { if (isDraft) window.location.href = route('mentor.courses.index'); },
            },
        );
    }, [modules, course.id]);

    const handleDiscard = useCallback(() => {
        if (confirm('Are you sure you want to discard this syllabus? All progress will be lost.'))
            window.location.href = route('mentor.courses.index');
    }, []);

    // ── Render ───────────────────────────────────────────────────────────

    return (
        <>
            <Head title="Course Creation: Phase 2 Syllabus" />

            <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', pb: 22 }}>
                <Box>
                    {/* Milestone progress */}
                    <Fade in={mounted} style={{ transitionDelay: '80ms' }}>
                        <Box sx={{ mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, mb: 2 }}>
                            <MentorCourseMilestone currentStep={1} />
                        </Box>
                    </Fade>

                    <Box sx={{ mx: 'auto', maxWidth: 960, px: { xs: 2, sm: 3, lg: 4 }, py: 4 }}>

                        <SyllabusPageHeader mounted={mounted} />

                        <Box component="form" onSubmit={(e) => handleSubmit(e, false)}>

                            {/* ── Timeline wrapper ── */}
                            <Box sx={{ position: 'relative' }}>
                                {/* Vertical green line */}
                                <Box sx={{
                                    position: 'absolute',
                                    left: 32, top: 0, bottom: 0, width: 2,
                                    background: 'linear-gradient(to bottom, #66bb6a, #2e7d32)',
                                    borderRadius: 1,
                                }} />

                                <Stack
                                    component={TransitionGroup}
                                    spacing={4}
                                >
                                    {modules.map((module, index) => (
                                        <Collapse key={module.id} timeout={300}>
                                            <SyllabusModuleCard
                                                module={module}
                                                index={index}
                                                errors={errors}
                                                onTitleChange={handleModuleTitleChange}
                                                onDescriptionChange={handleModuleDescriptionChange}
                                                onRemove={removeModule}
                                                onAddLesson={addLesson}
                                                onLessonTitleChange={handleLessonTitleChange}
                                                onLessonDescriptionChange={handleLessonDescriptionChange}
                                                onRemoveLesson={removeLesson}
                                            />
                                        </Collapse>
                                    ))}

                                    {/* Add module row — outside TransitionGroup so it doesn't animate away */}
                                </Stack>

                                <Box sx={{ mt: 4 }}>
                                    <SyllabusAddModuleButton onAdd={addModule} />
                                </Box>
                            </Box>

                            <MentorCourseFooterActions
                                onDiscard={handleDiscard}
                                onSaveAsDraft={(e) => handleSubmit(e, true)}
                                onBack={() => (window.location.href = route('mentor.courses.create', course.id))}
                                onNext={handleSubmit}
                                nextLabel="Next Step"
                                processing={isSubmitting}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

Syllabus.layout = (page) => (
    <MentorLayout auth={page.props.auth} activeTab="Courses">
        {page}
    </MentorLayout>
);
