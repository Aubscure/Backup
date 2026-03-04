import { memo, useState } from 'react';
import MentorMaterialItem from '@/Components/Mentor/Courses/MediaContents/MentorMaterialItem';
import {
    Box, Typography, Button, Stack, Chip,
    Accordion, AccordionSummary, AccordionDetails,
    Collapse, Fade,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import VideoLibraryOutlinedIcon from '@mui/icons-material/VideoLibraryOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

// ── Pure helper to safely strip HTML and decode entities ──────────────
const stripHtml = (html) => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
};

const MediaLessonAccordion = memo(function MediaLessonAccordion({
    lesson,
    lessonIndex,
    isLast,
    formatBytes,
    formatDuration,
    onOpenMenu,
    onDeleteMaterial,
    onDeleteVideo,
}) {
    const [hovered, setHovered] = useState(false);
    const [addHovered, setAddHovered] = useState(false);
    const isEmpty = lesson.materials.length === 0 && lesson.videos.length === 0;

    return (
        <Accordion
            defaultExpanded={lessonIndex === 0}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{
                boxShadow: 'none',
                borderBottom: !isLast ? 1 : 0,
                borderColor: 'divider',
                '&:before': { display: 'none' },
                transition: 'background-color 0.2s',
                bgcolor: hovered ? 'rgba(46,125,50,0.02)' : 'transparent',
            }}
        >
            <AccordionSummary
                expandIcon={
                    <ExpandMoreIcon
                        sx={{
                            color: hovered ? 'success.main' : 'text.secondary',
                            transition: 'color 0.2s',
                        }}
                    />
                }
                sx={{
                    px: 3,
                    py: 1.5,
                    '& .MuiAccordionSummary-content': { my: 0 },
                    '&:hover': { bgcolor: 'transparent' },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        mr: 2,
                    }}
                >
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                    color: hovered ? 'success.main' : 'text.disabled',
                                    transition: 'color 0.2s',
                                    fontSize: '0.65rem',
                                }}
                            >
                                Lesson {lessonIndex + 1}
                            </Typography>

                            {/* Mini pill counts */}
                            {lesson.videos.length > 0 && (
                                <Chip
                                    icon={<VideoLibraryOutlinedIcon sx={{ fontSize: '12px !important' }} />}
                                    label={lesson.videos.length}
                                    size="small"
                                    sx={{
                                        height: 18,
                                        fontSize: '0.65rem',
                                        bgcolor: '#fce4e4',
                                        color: '#c62828',
                                        '& .MuiChip-icon': { color: '#c62828' },
                                    }}
                                />
                            )}
                            {lesson.materials.length > 0 && (
                                <Chip
                                    icon={<ArticleOutlinedIcon sx={{ fontSize: '12px !important' }} />}
                                    label={lesson.materials.length}
                                    size="small"
                                    sx={{
                                        height: 18,
                                        fontSize: '0.65rem',
                                        bgcolor: '#e3f2fd',
                                        color: '#1565c0',
                                        '& .MuiChip-icon': { color: '#1565c0' },
                                    }}
                                />
                            )}
                        </Box>

                        <Typography
                            variant="subtitle1"
                            fontWeight={500}
                            sx={{
                                color: hovered ? 'text.primary' : 'text.primary',
                                transition: 'color 0.2s',
                            }}
                        >
                            {lesson.title}
                        </Typography>

                        {lesson.description && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: 'block', mt: 0.25 }}
                            >
                                {/* Strip the HTML tags here before rendering */}
                                {stripHtml(lesson.description)}
                            </Typography>
                        )}
                    </Box>

                    {isEmpty && (
                        <Chip
                            label="EMPTY"
                            size="small"
                            sx={{
                                bgcolor: 'grey.100',
                                color: 'text.disabled',
                                fontWeight: 700,
                                fontSize: '0.6rem',
                                letterSpacing: '0.06em',
                                border: '1px dashed',
                                borderColor: 'grey.300',
                            }}
                        />
                    )}
                </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                {/* Videos section */}
                {lesson.videos.length > 0 && (
                    <Fade in timeout={300}>
                        <Box sx={{ mb: lesson.materials.length > 0 ? 2.5 : 0 }}>
                            <Typography
                                variant="caption"
                                fontWeight={700}
                                sx={{
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                    color: '#c62828',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    mb: 1,
                                    fontSize: '0.65rem',
                                }}
                            >
                                <VideoLibraryOutlinedIcon sx={{ fontSize: 13 }} />
                                Videos
                            </Typography>
                            <Stack spacing={1.5}>
                                {lesson.videos.map((video) => (
                                    <MentorMaterialItem
                                        key={`video-${video.id}`}
                                        material={video}
                                        subtitle={formatDuration(video.duration)}
                                        onDelete={() => onDeleteVideo(video.id)}
                                        formatBytes={formatBytes}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    </Fade>
                )}

                {/* Materials section */}
                {lesson.materials.length > 0 && (
                    <Fade in timeout={300}>
                        <Box>
                            <Typography
                                variant="caption"
                                fontWeight={700}
                                sx={{
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                    color: '#1565c0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    mb: 1,
                                    fontSize: '0.65rem',
                                }}
                            >
                                <ArticleOutlinedIcon sx={{ fontSize: 13 }} />
                                Reading Materials
                            </Typography>
                            <Stack spacing={1.5}>
                                {lesson.materials.map((material) => (
                                    <MentorMaterialItem
                                        key={`material-${material.id}`}
                                        material={material}
                                        onDelete={onDeleteMaterial}
                                        formatBytes={formatBytes}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    </Fade>
                )}

                {/* Empty state */}
                {isEmpty && (
                    <Fade in timeout={400}>
                        <Box
                            sx={{
                                textAlign: 'center',
                                py: 3,
                                px: 2,
                                borderRadius: 2,
                                border: '2px dashed',
                                borderColor: 'grey.200',
                                bgcolor: 'grey.50',
                                mb: 2,
                            }}
                        >
                            <Typography variant="body2" color="text.disabled" fontStyle="italic">
                                No materials added yet — click below to get started.
                            </Typography>
                        </Box>
                    </Fade>
                )}

                {/* Add Material button */}
                <Box sx={{ mt: isEmpty ? 0 : 2.5 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={(e) => onOpenMenu(e, lesson)}
                        onMouseEnter={() => setAddHovered(true)}
                        onMouseLeave={() => setAddHovered(false)}
                        sx={{
                            bgcolor: 'success.main',
                            '&:hover': { bgcolor: 'success.dark' },
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                            px: 2.5,
                            transition: 'transform 0.15s, box-shadow 0.15s',
                            transform: addHovered ? 'scale(1.03)' : 'scale(1)',
                            boxShadow: addHovered
                                ? '0 4px 14px rgba(46,125,50,0.35)'
                                : '0 2px 6px rgba(46,125,50,0.2)',
                        }}
                    >
                        Add Material
                    </Button>
                </Box>
            </AccordionDetails>
        </Accordion>
    );
});

export default MediaLessonAccordion;
