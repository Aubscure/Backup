import RichTextEditor from '@/Components/Mentor/Courses/MentorRichTextEditor';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Box, Typography, Button, Paper, TextField, IconButton,
    Tooltip, Stack, Divider, useTheme, useMediaQuery,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import ContentRemovalWarningModal from '@/Components/Mentor/Courses/ContentRemovalWarningModal';

export default function EditSyllabusModal({ open, onClose, course }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // responsive helpers
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [modules, setModules] = useState(() => {
        const persisted = course?.syllabuses ?? [];
        if (persisted.length > 0) {
            return persisted.map((module) => ({
                id: module.id,
                title: module.title || 'Untitled Module',
                description: module.description || '',
                lessons: (module.lessons ?? []).map((lesson) => ({
                    id: lesson.id,
                    title: lesson.title || 'Lesson Title',
                    description: lesson.description || '',
                })),
            }));
        }
        return [
            {
                id: `tmp-${Date.now()}`,
                title: 'Introduction to the Course',
                description: '',
                lessons: [{ id: `tmp-lesson-${Date.now()}`, title: 'Lesson 1', description: '' }],
            },
        ];
    });

    // Content Removal State
    const [removalTarget, setRemovalTarget] = useState(null);

    const handleModuleDescriptionChange = (moduleId, html) =>
        setModules((prev) => prev.map((mod) => mod.id === moduleId ? { ...mod, description: html } : mod));

    const handleModuleTitleChange = (moduleId, value) =>
        setModules((prev) => prev.map((mod) => mod.id === moduleId ? { ...mod, title: value } : mod));

    const addModule = () => {
        setModules([...modules, {
            id: `tmp-${Date.now()}`,
            title: 'Module Title',
            description: '',
            lessons: [{ id: `tmp-lesson-${Date.now()}`, title: 'Lesson 1', description: '' }],
        }]);
    };

    const addLesson = (moduleId) => {
        setModules((prev) => prev.map((mod) =>
            mod.id === moduleId
                ? { ...mod, lessons: [...mod.lessons, { id: `tmp-lesson-${Date.now()}`, title: 'Lesson Title', description: '' }] }
                : mod
        ));
    };

    const handleLessonTitleChange = (moduleId, lessonId, value) =>
        setModules((prev) => prev.map((mod) =>
            mod.id === moduleId
                ? { ...mod, lessons: mod.lessons.map((l) => l.id === lessonId ? { ...l, title: value } : l) }
                : mod
        ));

    const handleLessonDescriptionChange = (moduleId, lessonId, html) =>
        setModules((prev) => prev.map((mod) =>
            mod.id === moduleId
                ? { ...mod, lessons: mod.lessons.map((l) => l.id === lessonId ? { ...l, description: html } : l) }
                : mod
        ));

    // Removal Target Setters
    const requestRemoveModule = (module) =>
        setRemovalTarget({ type: 'module', moduleId: module.id, name: module.title });

    const requestRemoveLesson = (module, lesson) =>
        setRemovalTarget({ type: 'lesson', moduleId: module.id, lessonId: lesson.id, name: lesson.title });

    // Removal Execution
    const handleConfirmSyllabusRemoval = () => {
        if (!removalTarget) return;

        if (removalTarget.type === 'module') {
            setModules((prev) => prev.filter((m) => m.id !== removalTarget.moduleId));
        }

        if (removalTarget.type === 'lesson') {
            setModules((prev) => prev.map((m) =>
                m.id === removalTarget.moduleId
                    ? { ...m, lessons: m.lessons.filter((l) => l.id !== removalTarget.lessonId) }
                    : m
            ));
        }

        setRemovalTarget(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const normalizedModules = modules.map((module) => ({
            id: Number.isInteger(module.id) ? module.id : null,
            title: module.title?.trim() || '',
            description: module.description || '',
            lessons: (module.lessons || []).map((lesson) => ({
                id: Number.isInteger(lesson.id) ? lesson.id : null,
                title: lesson.title?.trim() || '',
                description: lesson.description || '',
            })),
        })).filter((m) => m.title || m.description || m.lessons.length > 0);

        setIsSubmitting(true);
        router.post(
            route('mentor.courses.syllabus.save', course.id),
            { modules: normalizedModules, is_draft: false, next_step: false, from_edit: true },
            {
                preserveScroll: true,
                onFinish: () => setIsSubmitting(false),
                onSuccess: () => onClose(),
            }
        );
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="md"
                // xs/sm: go fullscreen so the form has the whole viewport
                fullScreen={isMobile}
                PaperProps={{ sx: { borderRadius: { xs: 0, sm: 0, md: 3 }, maxHeight: { xs: '100dvh', md: '90vh' } } }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">Edit Syllabus</Typography>
                        <Typography variant="caption" color="text.secondary">Manage modules and lessons</Typography>
                    </Box>
                    <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
                </DialogTitle>

                <Divider />

                <DialogContent sx={{ p: { xs: 1.5, sm: 2, md: 3 }, overflowY: 'auto' }}>
                    <Box component="form" id="syllabus-form" onSubmit={handleSubmit}>
                        <Box sx={{ position: 'relative' }}>
                            {/* vertical timeline line: hidden on mobile */}
                            <Box sx={{
                                position: 'absolute',
                                left: 32,
                                top: 0,
                                bottom: 0,
                                width: 2,
                                bgcolor: 'success.main',
                                display: { xs: 'none', md: 'block' },
                            }} />

                            <Stack spacing={{ xs: 2, md: 4 }}>
                                {modules.map((module, index) => (
                                    <Box key={module.id} sx={{ position: 'relative' }}>
                                        {/* timeline dot: hidden on mobile */}
                                        <Box sx={{
                                            position: 'absolute',
                                            left: 24,
                                            top: 24,
                                            width: 16,
                                            height: 16,
                                            borderRadius: '50%',
                                            border: '4px solid white',
                                            bgcolor: 'success.main',
                                            boxShadow: 2,
                                            zIndex: 1,
                                            display: { xs: 'none', md: 'block' },
                                        }} />

                                        {/*
                                         * xs/sm: no left margin (full width card)
                                         * md+  : original ml: 8 for timeline offset
                                         */}
                                        <Paper variant="outlined" sx={{
                                            ml: { xs: 0, md: 8 },
                                            p: { xs: 2, md: 3 },
                                            borderRadius: 3,
                                        }}>
                                            {/* module header row */}
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                                                <Box sx={{ flex: 1 }}>
                                                    {/* xs: small numbered circle badge before the label */}
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Box sx={{
                                                            display: { xs: 'flex', md: 'none' },
                                                            width: 22, height: 22, borderRadius: '50%',
                                                            bgcolor: 'success.main',
                                                            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                                        }}>
                                                            <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                                                                {index + 1}
                                                            </Typography>
                                                        </Box>
                                                        <Typography
                                                            variant="caption"
                                                            fontWeight="bold"
                                                            sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary' }}
                                                        >
                                                            MODULE {index + 1}
                                                        </Typography>
                                                    </Box>
                                                    <TextField
                                                        fullWidth variant="standard"
                                                        value={module.title}
                                                        onChange={(e) => handleModuleTitleChange(module.id, e.target.value)}
                                                        placeholder="Module Title"
                                                        InputProps={{ disableUnderline: true, sx: { fontSize: '1.1rem', fontWeight: 600 } }}
                                                    />
                                                </Box>
                                                <Tooltip title="Delete Module">
                                                    <IconButton onClick={() => requestRemoveModule(module)}
                                                        sx={{ ml: 1, color: 'grey.400', '&:hover': { bgcolor: 'error.50', color: 'error.main' } }}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>

                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.75 }}>Description</Typography>
                                                <RichTextEditor
                                                    value={module.description}
                                                    onChange={(html) => handleModuleDescriptionChange(module.id, html)}
                                                    placeholder="What will students learn in this module?"
                                                    minHeight={100}
                                                    sx={{ '& [contenteditable="true"]': { whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere', maxWidth: '96%' } }}
                                                />
                                            </Box>

                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>Lessons</Typography>
                                                {module.lessons.length === 0 ? (
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                                        No lessons yet.
                                                    </Typography>
                                                ) : (
                                                    <Stack spacing={1.25}>
                                                        {module.lessons.map((lesson, lessonIndex) => (
                                                            <Box key={lesson.id} sx={{
                                                                /*
                                                                 * xs/sm : stacked column, label+delete on top, fields below
                                                                 * md+   : original horizontal flex row
                                                                 */
                                                                display: 'flex',
                                                                flexDirection: { xs: 'column', md: 'row' },
                                                                alignItems: { xs: 'stretch', md: 'flex-start' },
                                                                gap: 1.5,
                                                                p: { xs: 1, md: 1.25 },
                                                                border: 1,
                                                                borderColor: 'divider',
                                                                borderRadius: 2,
                                                                bgcolor: 'grey.50',
                                                            }}>
                                                                {/* label row (always rendered; delete icon visibility toggled) */}
                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between',
                                                                }}>
                                                                    <Typography variant="caption" sx={{
                                                                        minWidth: { xs: 'unset', md: 64 },
                                                                        color: 'text.secondary',
                                                                        fontWeight: 600,
                                                                        mt: { xs: 0, md: 1 },
                                                                    }}>
                                                                        Lesson {lessonIndex + 1}
                                                                    </Typography>

                                                                    {/* mobile-only delete */}
                                                                    <Tooltip title="Remove Lesson">
                                                                        <IconButton
                                                                            onClick={() => requestRemoveLesson(module, lesson)}
                                                                            color="error" size="small"
                                                                            sx={{ display: { xs: 'inline-flex', md: 'none' } }}
                                                                        >
                                                                            <DeleteIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Box>

                                                                <Stack spacing={1} sx={{ flex: 1 }}>
                                                                    <TextField
                                                                        size="small" fullWidth
                                                                        value={lesson.title}
                                                                        onChange={(e) => handleLessonTitleChange(module.id, lesson.id, e.target.value)}
                                                                        placeholder="Lesson Title"
                                                                    />
                                                                    <RichTextEditor
                                                                        value={lesson.description}
                                                                        onChange={(html) => handleLessonDescriptionChange(module.id, lesson.id, html)}
                                                                        placeholder="Lesson Description (optional)"
                                                                        minHeight={80}
                                                                        sx={{ '& [contenteditable="true"]': { whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere', maxWidth: '95%' } }}
                                                                    />
                                                                </Stack>

                                                                {/* desktop-only delete */}
                                                                <Tooltip title="Remove Lesson">
                                                                    <IconButton
                                                                        onClick={() => requestRemoveLesson(module, lesson)}
                                                                        color="error" size="small"
                                                                        sx={{ mt: 0.5, display: { xs: 'none', md: 'inline-flex' } }}
                                                                    >
                                                                        <DeleteIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        ))}
                                                    </Stack>
                                                )}
                                            </Box>

                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <Button
                                                    onClick={() => addLesson(module.id)}
                                                    variant="contained"
                                                    startIcon={<AddIcon />}
                                                    fullWidth={isMobile}
                                                    sx={{ bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' }, textTransform: 'none', fontWeight: 500 }}
                                                >
                                                    Add Lesson
                                                </Button>
                                            </Box>
                                        </Paper>
                                    </Box>
                                ))}

                                {/* Add New Module */}
                                <Box sx={{ position: 'relative' }}>
                                    {/* desktop timeline node */}
                                    <Box sx={{
                                        position: 'absolute',
                                        left: 20, top: 0,
                                        width: 24, height: 24,
                                        borderRadius: '50%',
                                        border: '4px solid white',
                                        bgcolor: 'success.main',
                                        boxShadow: 2,
                                        display: { xs: 'none', md: 'flex' },
                                        alignItems: 'center', justifyContent: 'center',
                                        zIndex: 1,
                                    }}>
                                        <AddIcon sx={{ fontSize: 14, color: 'white' }} />
                                    </Box>
                                    <Button
                                        onClick={addModule}
                                        startIcon={<AddIcon />}
                                        variant={isMobile ? 'outlined' : 'text'}
                                        fullWidth={isMobile}
                                        sx={{
                                            ml: { xs: 0, md: 8 },
                                            color: 'success.main',
                                            borderColor: { xs: 'success.main', md: 'transparent' },
                                            textTransform: 'none',
                                            fontWeight: 500,
                                        }}
                                    >
                                        Add New Module
                                    </Button>
                                </Box>
                            </Stack>
                        </Box>
                    </Box>
                </DialogContent>

                <Divider />

                {/*
                 * xs/sm : buttons stack full-width, Save on top (column-reverse)
                 * md+   : original horizontal row
                 */}
                <DialogActions sx={{
                    px: { xs: 2, md: 3 },
                    py: 2,
                    gap: 1,
                    flexDirection: { xs: 'column-reverse', md: 'row' },
                }}>
                    <Button
                        onClick={onClose}
                        fullWidth={isMobile}
                        sx={{ textTransform: 'none', color: 'text.secondary' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="syllabus-form"
                        disabled={isSubmitting}
                        variant="contained"
                        startIcon={<SaveIcon />}
                        fullWidth={isMobile}
                        sx={{ bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' }, textTransform: 'none', fontWeight: 600, px: 3 }}
                    >
                        {isSubmitting ? 'Saving…' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>

            <ContentRemovalWarningModal
                open={Boolean(removalTarget)}
                onClose={() => setRemovalTarget(null)}
                onConfirm={handleConfirmSyllabusRemoval}
                itemType={removalTarget?.type ?? 'lesson'}
                itemName={removalTarget?.name ?? ''}
            />
        </>
    );
}
