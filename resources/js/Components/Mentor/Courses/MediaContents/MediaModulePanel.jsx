import { memo, useState } from 'react';
import MediaLessonAccordion from '@/Components/Mentor/Courses/MediaContents/MediaLessonAccordion';
import MentorModuleHeader from '@/Components/Mentor/Courses/MediaContents/MentorModuleHeader';
import { Paper, Grow } from '@mui/material';

const MediaModulePanel = memo(function MediaModulePanel({
    module,
    index,
    courseId,
    getModuleSummary,
    formatBytes,
    formatDuration,
    onOpenMenu,
    onDeleteMaterial,
    onDeleteVideo,
}) {
    const [hovered, setHovered] = useState(false);

    return (
        <Grow in timeout={300 + index * 100}>
            <Paper
                variant="outlined"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    borderColor: hovered ? 'success.light' : 'divider',
                    boxShadow: hovered
                        ? '0 6px 24px rgba(46,125,50,0.10)'
                        : '0 1px 4px rgba(0,0,0,0.04)',
                    transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.2s',
                    transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
                }}
            >
                <MentorModuleHeader
                    module={module}
                    courseId={courseId}
                    getModuleSummary={getModuleSummary}
                />

                {module.lessons.map((lesson, lessonIndex) => (
                    <MediaLessonAccordion
                        key={lesson.id}
                        lesson={lesson}
                        lessonIndex={lessonIndex}
                        isLast={lessonIndex === module.lessons.length - 1}
                        formatBytes={formatBytes}
                        formatDuration={formatDuration}
                        onOpenMenu={onOpenMenu}
                        onDeleteMaterial={onDeleteMaterial}
                        onDeleteVideo={onDeleteVideo}
                    />
                ))}
            </Paper>
        </Grow>
    );
});

export default MediaModulePanel;