import { router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Box, Typography, Button, Paper, Stack, Divider, IconButton, Chip,
    useMediaQuery, useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentRemovalWarningModal from '@/Components/Mentor/Courses/ContentRemovalWarningModal';

export default function EditAssessmentModal({ open, onClose, course }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Modal state for deletion
    const [pendingAssessment, setPendingAssessment] = useState(null);

    // Flatten assessments from both modules (syllabuses) and lessons for easy mapping
    const assessmentsList = useMemo(() => {
        const list = [];
        if (!course?.syllabuses) return list;

        course.syllabuses.forEach(syllabus => {
            if (syllabus.assessments) {
                syllabus.assessments.forEach(assessment => {
                    list.push({ ...assessment, assignedLevel: 'Module', assignedName: syllabus.title });
                });
            }
            if (syllabus.lessons) {
                syllabus.lessons.forEach(lesson => {
                    if (lesson.assessments) {
                        lesson.assessments.forEach(assessment => {
                            list.push({ ...assessment, assignedLevel: 'Lesson', assignedName: lesson.title });
                        });
                    }
                });
            }
        });
        return list;
    }, [course]);

    const requestDeleteAssessment = (assessment) =>
        setPendingAssessment({ id: assessment.id, name: assessment.title });

    const handleConfirmDeleteAssessment = () => {
        if (!pendingAssessment) return;
        router.delete(route('assessment.destroy', pendingAssessment.id), {
            preserveScroll: true,
            data: { from_edit: true },
            onFinish: () => setPendingAssessment(null),
        });
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="md"
                fullScreen={isMobile}
                PaperProps={{
                    sx: {
                        borderRadius: { xs: 0, sm: 3 },
                        maxHeight: { xs: '100dvh', sm: '90vh' },
                        margin: { xs: 0, sm: 2 },
                        alignSelf: { xs: 'flex-end', sm: 'center' },
                        width: { xs: '100%', sm: undefined },
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        pb: 1,
                        px: { xs: 2, sm: 3 },
                        pt: { xs: 2, sm: 2 },
                    }}
                >
                    <Box>
                        <Typography variant="h6" fontWeight="bold">Course Assessments</Typography>
                        <Typography variant="caption" color="text.secondary">View and remove assigned assessments</Typography>
                    </Box>
                    <IconButton onClick={onClose} size="small" sx={{ flexShrink: 0, ml: 1 }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <Divider />

                <DialogContent sx={{ p: { xs: 1.5, sm: 3 }, overflowY: 'auto' }}>
                    {assessmentsList.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Typography variant="body2" color="text.secondary">
                                No assessments are currently assigned to this course.
                            </Typography>
                        </Box>
                    ) : (
                        <Stack spacing={2}>
                            {assessmentsList.map((assessment) => (
                                <Paper
                                    key={`assessment-${assessment.id}`}
                                    variant="outlined"
                                    sx={{
                                        p: { xs: 1.5, sm: 2 },
                                        borderRadius: 2,
                                        // On mobile: stack content + delete button vertically
                                        // On desktop: keep side-by-side row
                                        display: 'flex',
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        alignItems: { xs: 'flex-start', sm: 'center' },
                                        justifyContent: 'space-between',
                                        gap: { xs: 1.5, sm: 0 },
                                    }}
                                >
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            {assessment.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mb: 1,
                                                // Prevent long descriptions from overflowing on mobile
                                                wordBreak: 'break-word',
                                            }}
                                        >
                                            {assessment.description || 'No description provided.'}
                                        </Typography>
                                        {/* On mobile: wrap chips so they don't overflow */}
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            sx={{ flexWrap: 'wrap', gap: { xs: '6px !important', sm: undefined } }}
                                        >
                                            <Chip
                                                label={`${assessment.assignedLevel}: ${assessment.assignedName}`}
                                                size="small"
                                                sx={{
                                                    bgcolor: 'grey.100',
                                                    color: 'text.secondary',
                                                    fontWeight: 500,
                                                    // Allow chip label to truncate on very small screens
                                                    maxWidth: { xs: '100%', sm: 'none' },
                                                }}
                                            />
                                            <Chip
                                                label={`Passing Grade: ${assessment.passing_grade}%`}
                                                size="small"
                                                sx={{ bgcolor: 'success.50', color: 'success.dark', fontWeight: 500 }}
                                            />
                                        </Stack>
                                    </Box>

                                    {/* On mobile: full-width outlined delete button with label for clarity */}
                                    {isMobile ? (
                                        <Button
                                            onClick={() => requestDeleteAssessment(assessment)}
                                            color="error"
                                            variant="outlined"
                                            startIcon={<DeleteIcon />}
                                            fullWidth
                                            size="small"
                                            sx={{ textTransform: 'none', fontWeight: 500 }}
                                        >
                                            Remove Assessment
                                        </Button>
                                    ) : (
                                        <IconButton
                                            onClick={() => requestDeleteAssessment(assessment)}
                                            color="error"
                                            sx={{ bgcolor: 'error.50', '&:hover': { bgcolor: 'error.100' } }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </Paper>
                            ))}
                        </Stack>
                    )}
                </DialogContent>

                <Divider />

                <DialogActions
                    sx={{
                        px: { xs: 2, sm: 3 },
                        py: { xs: 1.5, sm: 2 },
                    }}
                >
                    <Button
                        onClick={onClose}
                        variant="contained"
                        fullWidth={isMobile}
                        sx={{
                            bgcolor: 'success.main',
                            '&:hover': { bgcolor: 'success.dark' },
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <ContentRemovalWarningModal
                open={Boolean(pendingAssessment)}
                onClose={() => setPendingAssessment(null)}
                onConfirm={handleConfirmDeleteAssessment}
                itemType="assessment"
                itemName={pendingAssessment?.name ?? ''}
                description="This assessment will be permanently unlinked from the course. Learner results tied to it will also be removed."
            />
        </>
    );
}
