import { memo, useState } from 'react';
import RichTextEditor from '@/Components/Mentor/Courses/MentorRichTextEditor';
import SyllabusLessonItem from '@/Components/Mentor/Courses/Syllabus/SyllabusLessonItem';
import {
    Box, Typography, Button, Paper, TextField,
    IconButton, Tooltip, Stack, Collapse, Grow, Fade
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { TransitionGroup } from 'react-transition-group';

const SyllabusModuleCard = memo(function SyllabusModuleCard({
    module,
    index,
    errors,
    onTitleChange,
    onDescriptionChange,
    onRemove,
    onAddLesson,
    onLessonTitleChange,
    onLessonDescriptionChange,
    onRemoveLesson,
}) {
    const [cardHovered, setCardHovered] = useState(false);
    const [deleteHovered, setDeleteHovered] = useState(false);

    return (
        <Grow in timeout={300 + index * 80}>
            <Box sx={{ position: 'relative' }}>
                {/* Timeline dot */}
                <Box
                    sx={{
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
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        ...(cardHovered && {
                            transform: 'scale(1.3)',
                            boxShadow: '0 0 0 4px rgba(46,125,50,0.15)',
                        }),
                    }}
                />

                <Paper
                    variant="outlined"
                    onMouseEnter={() => setCardHovered(true)}
                    onMouseLeave={() => setCardHovered(false)}
                    sx={{
                        ml: 8,
                        p: 3,
                        borderRadius: 3,
                        borderColor: cardHovered ? 'success.light' : 'divider',
                        boxShadow: cardHovered
                            ? '0 4px 20px rgba(46,125,50,0.10)'
                            : '0 1px 4px rgba(0,0,0,0.04)',
                        transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.2s',
                        transform: cardHovered ? 'translateY(-2px)' : 'translateY(0)',
                    }}
                >
                    {/* ── Header ── */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            mb: 2,
                        }}
                    >
                        <Box sx={{ flex: 1 }}>
                            <Typography
                                variant="caption"
                                fontWeight="bold"
                                sx={{
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.08em',
                                    color: 'success.main',
                                    fontSize: '0.65rem',
                                }}
                            >
                                MODULE {index + 1}
                            </Typography>
                            <TextField
                                fullWidth
                                variant="standard"
                                value={module.title}
                                onChange={(e) => onTitleChange(module.id, e.target.value)}
                                placeholder="Module Title (e.g. Core Concepts)"
                                InputProps={{
                                    disableUnderline: true,
                                    sx: { fontSize: '1.125rem', fontWeight: 600 },
                                }}
                                sx={{
                                    '& input': {
                                        transition: 'color 0.2s',
                                        '&:focus': { color: 'success.dark' },
                                    },
                                }}
                            />
                        </Box>

                        <Tooltip title="Delete Module">
                            <IconButton
                                onClick={() => onRemove(module.id)}
                                onMouseEnter={() => setDeleteHovered(true)}
                                onMouseLeave={() => setDeleteHovered(false)}
                                sx={{
                                    ml: 2,
                                    color: deleteHovered ? 'error.main' : 'grey.400',
                                    bgcolor: deleteHovered ? 'error.50' : 'transparent',
                                    transform: deleteHovered ? 'rotate(10deg) scale(1.1)' : 'rotate(0) scale(1)',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {/* ── Description ── */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" fontWeight={500} sx={{ mb: 0.75 }}>
                            Description
                        </Typography>
                        <RichTextEditor
                            value={module.description}
                            onChange={(html) => onDescriptionChange(module.id, html)}
                            placeholder="What will students learn in this module?"
                            minHeight={100}
                            error={errors?.description}
                            sx={{
                                '& [contenteditable="true"]': {
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    overflowWrap: 'anywhere',
                                    maxWidth: '96%',
                                },
                            }}
                        />
                    </Box>

                    {/* ── Lessons ── */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
                            Lessons
                            <Typography
                                component="span"
                                variant="caption"
                                sx={{ ml: 1, color: 'text.disabled' }}
                            >
                                ({module.lessons.length})
                            </Typography>
                        </Typography>

                        {module.lessons.length === 0 ? (
                            <Fade in timeout={300}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mb: 1.5,
                                        fontStyle: 'italic',
                                        pl: 1,
                                        borderLeft: '3px solid',
                                        borderColor: 'divider',
                                    }}
                                >
                                    No lessons yet. Click "Add Lesson" to add one.
                                </Typography>
                            </Fade>
                        ) : (
                            <Stack
                                component={TransitionGroup}
                                spacing={1.25}
                            >
                                {module.lessons.map((lesson, lessonIndex) => (
                                    <Collapse key={lesson.id} timeout={250}>
                                        <SyllabusLessonItem
                                            lesson={lesson}
                                            lessonIndex={lessonIndex}
                                            moduleId={module.id}
                                            errors={errors}
                                            onTitleChange={onLessonTitleChange}
                                            onDescriptionChange={onLessonDescriptionChange}
                                            onRemove={onRemoveLesson}
                                        />
                                    </Collapse>
                                ))}
                            </Stack>
                        )}
                    </Box>

                    {/* ── Add Lesson ── */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            onClick={() => onAddLesson(module.id)}
                            variant="contained"
                            startIcon={<AddIcon />}
                            sx={{
                                bgcolor: 'success.main',
                                '&:hover': {
                                    bgcolor: 'success.dark',
                                    transform: 'scale(1.04)',
                                },
                                textTransform: 'none',
                                fontWeight: 500,
                                transition: 'transform 0.15s, background-color 0.2s',
                            }}
                        >
                            Add Lesson
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Grow>
    );
});

export default SyllabusModuleCard;