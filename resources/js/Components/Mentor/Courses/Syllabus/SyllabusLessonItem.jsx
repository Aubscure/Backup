import { memo, useState } from 'react';
import RichTextEditor from '@/Components/Mentor/Courses/MentorRichTextEditor';
import {
    Box, Typography, TextField, IconButton, Tooltip, Stack, Collapse,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const SyllabusLessonItem = memo(function SyllabusLessonItem({
    lesson,
    lessonIndex,
    moduleId,
    errors,
    onTitleChange,
    onDescriptionChange,
    onRemove,
}) {
    const [hovered, setHovered] = useState(false);

    return (
        <Box
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.5,
                p: 1.25,
                border: 1,
                borderColor: hovered ? 'success.light' : 'divider',
                borderRadius: 2,
                bgcolor: hovered ? 'success.50' : 'grey.50',
                transition: 'all 0.2s ease',
                transform: hovered ? 'translateX(3px)' : 'translateX(0)',
            }}
        >
            <Typography
                variant="caption"
                sx={{
                    minWidth: 64,
                    color: 'text.secondary',
                    fontWeight: 600,
                    mt: 1,
                    transition: 'color 0.2s',
                    ...(hovered && { color: 'success.main' }),
                }}
            >
                Lesson {lessonIndex + 1}
            </Typography>

            <Stack spacing={1} sx={{ flex: 1 }}>
                <TextField
                    size="small"
                    fullWidth
                    value={lesson.title}
                    onChange={(e) => onTitleChange(moduleId, lesson.id, e.target.value)}
                    placeholder="Lesson Title"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            transition: 'box-shadow 0.2s',
                            '&:hover fieldset': { borderColor: 'success.main' },
                            '&.Mui-focused fieldset': { borderColor: 'success.main' },
                        },
                    }}
                />
                <RichTextEditor
                    value={lesson.description}
                    onChange={(html) => onDescriptionChange(moduleId, lesson.id, html)}
                    placeholder="Lesson Description (optional)"
                    minHeight={80}
                    error={errors?.description}
                    sx={{
                        '& [contenteditable="true"]': {
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            overflowWrap: 'anywhere',
                            maxWidth: '95.2%',
                        },
                    }}
                />
            </Stack>

            <Tooltip title="Remove Lesson">
                <IconButton
                    onClick={() => onRemove(moduleId, lesson.id)}
                    color="error"
                    size="small"
                    sx={{
                        mt: 0.5,
                        opacity: hovered ? 1 : 0.3,
                        transition: 'opacity 0.2s, transform 0.2s',
                        '&:hover': { transform: 'scale(1.2)' },
                    }}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </Box>
    );
});

export default SyllabusLessonItem;