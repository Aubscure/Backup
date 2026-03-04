import React from 'react';
import {
    Avatar,
    Box,
    CardMedia,
    Chip,
    Paper,
    Stack,
    Typography,
} from '@mui/material';

// Icons
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import LayersIcon from '@mui/icons-material/Layers';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PersonIcon from '@mui/icons-material/Person';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

const PALETTE = {
    green: { 50: '#ECFDF5', 100: '#D1FAE5', 600: '#059669', 700: '#047857', 800: '#065F46' },
    gray: { 50: '#F9FAFB', 100: '#F3F4F6', 200: '#E5E7EB', 600: '#4B5563', 800: '#1F2937', 900: '#111827' },
};

const StatBox = ({ icon, value, label }) => (
    <Stack spacing={0.5} alignItems="center" sx={{ minWidth: 70 }}>
        <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1 }}>
            {value ?? 0}
        </Typography>
        <Stack direction="row" spacing={0.5} alignItems="center">
            <Box sx={{ display: 'flex', '& svg': { fontSize: 14 }, color: 'text.disabled' }}>
                {icon}
            </Box>
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>
        </Stack>
    </Stack>
);

const MentorCoursePreviewCard = ({ course, mentor, checklist }) => {
    const plans = course.course_plans ?? course.coursePlans ?? [];

    const getDurationDisplay = () => {
        // Prefer course duration set on Create (e.g. "2h", "30m")
        if (course.duration && String(course.duration).trim()) return course.duration;
        if (course.duration_label && String(course.duration_label).trim()) return course.duration_label;

        const secs = checklist?.total_duration ?? 0;
        if (!secs) return '-';

        const hours = Math.floor(secs / 3600);
        const mins = Math.floor((secs % 3600) / 60);

        if (!hours) return `${mins}m`;
        if (!mins) return `${hours}h`;
        return `${hours}h ${mins}m`;
    };

    const formatPrice = (amount) => {
        const price = parseFloat(amount);
        return price === 0
            ? 'Free'
            : `₱ ${price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
    };

    return (
        <Paper
            elevation={2}
            sx={{
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    px: 3,
                    py: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    bgcolor: PALETTE.gray[50],
                }}
            >
                <OpenInNewIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                <Typography variant="subtitle2" fontWeight={600}>
                    Course Preview
                </Typography>
            </Box>

            {/* Body — horizontal row, space-between */}
            <Box
                sx={{
                    p: { xs: 2, md: 3 },
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'stretch',
                    gap: 3,
                }}
            >
                {/* LEFT — Thumbnail */}
                <Box
                    sx={{
                        flexShrink: 0,
                        width: { xs: '45%', md: '40%' },
                        minHeight: 220,
                        borderRadius: 2,
                        overflow: 'hidden',
                        bgcolor: PALETTE.gray[800],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {course.course_thumbnail_url ? (
                        <CardMedia
                            component="img"
                            image={course.course_thumbnail_url}
                            alt="Thumbnail"
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    ) : (
                        <Stack
                            alignItems="center"
                            justifyContent="center"
                            sx={{ color: 'rgba(255,255,255,0.35)' }}
                        >
                            <ImageNotSupportedIcon sx={{ fontSize: 48 }} />
                            <Typography variant="caption">No thumbnail</Typography>
                        </Stack>
                    )}
                </Box>

                {/* RIGHT — Course Info */}
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                >
                    {/* Top: Instructor & Title */}
                    <Box>
                        <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                            <Avatar
                                src={mentor?.profile_photo_url}
                                sx={{
                                    width: 44,
                                    height: 44,
                                    bgcolor: PALETTE.green[600],
                                }}
                            >
                                {mentor?.name?.[0]?.toUpperCase()}
                            </Avatar>

                            <Box>
                                <Typography fontWeight={700}>
                                    {mentor?.name ?? 'Unknown Mentor'}
                                </Typography>
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <PersonIcon sx={{ fontSize: 13, color: 'text.disabled' }} />
                                    <Typography variant="caption" color="text.secondary">
                                        Mentor
                                    </Typography>
                                </Stack>
                            </Box>
                        </Stack>

                        <Typography variant="h5" fontWeight={700} gutterBottom>
                            {course.title || 'Untitled Course'}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            component="div"
                            sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                '& *': { margin: 0, padding: 0 },
                            }}
                            dangerouslySetInnerHTML={{
                                __html: course.description || 'No description provided.',
                            }}
                        />
                    </Box>

                    {/* Bottom: Stats & Pricing */}
                    <Box>
                        <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="flex-start"
                            sx={{ mb: 3, mt: 2 }}
                        >
                            <StatBox
                                icon={<AccessTimeFilledIcon />}
                                value={getDurationDisplay()}
                                label="Duration"
                            />
                            <StatBox
                                icon={<LayersIcon />}
                                value={checklist?.syllabus_count ?? 0}
                                label="Modules"
                            />
                            <StatBox
                                icon={<PlayCircleIcon />}
                                value={checklist?.lesson_count ?? 0}
                                label="Lessons"
                            />
                        </Stack>

                        {/* Pricing */}
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: PALETTE.gray[50],
                                border: '1px dashed',
                                borderColor: PALETTE.gray[200],
                            }}
                        >
                            <Typography
                                variant="caption"
                                fontWeight={700}
                                color="text.disabled"
                                sx={{ display: 'block', mb: 1 }}
                            >
                                PRICING & ACCESS
                            </Typography>

                            {course.is_free ? (
                                <Chip label="Free Course" color="success" size="small" />
                            ) : plans.length ? (
                                <Stack spacing={1.5}>
                                    {plans.map((plan, index) => (
                                        <Stack
                                            key={index}
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >
                                            <Box>
                                                <Typography fontWeight={600}>{plan.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Access: {plan.duration}
                                                </Typography>
                                            </Box>
                                            <Typography fontWeight={700} sx={{ color: PALETTE.green[700] }}>
                                                {formatPrice(plan.price)}
                                            </Typography>
                                        </Stack>
                                    ))}
                                </Stack>
                            ) : (
                                <Typography variant="caption" color="text.secondary">
                                    No pricing plans configured yet.
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

export default MentorCoursePreviewCard;
