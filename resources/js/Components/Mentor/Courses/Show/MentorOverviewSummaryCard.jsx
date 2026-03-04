/**
 * resources/js/Components/Mentor/Courses/Show/MentorOverviewSummaryCard.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * RESPONSIVE: xs/sm breakpoints added — md/lg/xl behaviour is unchanged.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import {
    Box, Typography, Chip, Divider, Stack, Paper,
    Avatar, ButtonBase,
} from '@mui/material';

// Icons
import AccessTimeRoundedIcon        from '@mui/icons-material/AccessTimeRounded';
import FolderOpenRoundedIcon        from '@mui/icons-material/FolderOpenRounded';
import QuizRoundedIcon              from '@mui/icons-material/QuizRounded';
import GroupRoundedIcon             from '@mui/icons-material/GroupRounded';
import StarRoundedIcon              from '@mui/icons-material/StarRounded';
import PersonRoundedIcon            from '@mui/icons-material/PersonRounded';
import BusinessRoundedIcon          from '@mui/icons-material/BusinessRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

const EASE        = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
const EASE_SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

function stripHTML(html) {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
}

function formatDuration(seconds) {
    if (!seconds) return 'N/A';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (!h) return `${m}m`;
    if (!m) return `${h}h`;
    return `${h}h ${m}m`;
}

const STATUS_COLORS = {
    published:   { bg: '#e8f5e9', color: '#2e7d32', label: 'Published' },
    draft:       { bg: '#fff8e1', color: '#f57f17', label: 'Draft' },
    unpublished: { bg: '#fce4ec', color: '#c62828', label: 'Unpublished' },
    archived:    { bg: '#eeeeee', color: '#424242', label: 'Archived' },
};

function StatTile({ icon, label, value }) {
    return (
        <Box
            sx={{
                display:        'flex',
                flexDirection:  'column',
                alignItems:     'center',
                justifyContent: 'center',
                // xs: reduce padding so tiles don't overflow on small screens
                p:               { xs: 1.25, sm: 1.5, md: 2 },
                borderRadius:    4,
                bgcolor:        '#FFFFFF',
                border:         '1px solid',
                borderColor:    'grey.100',
                gap:             0.5,
                textAlign:      'center',
                transition:     `all 300ms ${EASE}`,
                height:         '70%',
                '&:hover': {
                    transform:   'translateY(-4px)',
                    boxShadow:   '0 12px 24px rgba(0,0,0,0.06)',
                    borderColor: 'success.light',
                    '& .stat-icon': { transform: 'scale(1.15)', color: 'success.main' },
                },
            }}
        >
            <Box
                className="stat-icon"
                sx={{
                    color: 'success.main',
                    mb: 0.5,
                    display: 'flex',
                    transition: `transform 300ms ${EASE_SPRING}`,
                }}
            >
                {/* xs: slightly smaller icon */}
                {React.cloneElement(icon, { sx: { fontSize: { xs: 18, sm: 20, md: 22 } } })}
            </Box>
            <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
                sx={{
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    opacity: 0.7,
                    // xs: tighter label
                    fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.75rem' },
                }}
            >
                {label}
            </Typography>
            <Typography
                variant="body2"
                fontWeight={600}
                color="text.primary"
                sx={{ fontSize: { xs: '0.72rem', sm: '0.8rem', md: '0.875rem' } }}
            >
                {value}
            </Typography>
        </Box>
    );
}

export default function MentorOverviewSummaryCard({ course, mentor, students = [], ratings = [] }) {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    const statusCfg     = STATUS_COLORS[course.draft_status] || STATUS_COLORS.draft;
    const categoryLabel = course.category?.name || course.custom_category || 'N/A';
    const authorName    = mentor
        ? `${mentor.firstname} ${mentor.lastname}`
        : course.user
            ? `${course.user.firstname} ${course.user.lastname}`
            : 'Unknown';

    let filesCount    = 0;
    let totalDuration = 0;
    let quizCount     = (course.assessments_count != null)
        ? course.assessments_count
        : (course.syllabuses || []).reduce((sum, mod) => {
            const syllabusAssessments = (mod.assessments || []).length;
            const lessonAssessments   = (mod.lessons || []).reduce(
                (ls, lesson) => ls + (lesson.assessments || []).length, 0,
            );
            return sum + syllabusAssessments + lessonAssessments;
        }, 0);

    (course.syllabuses || []).forEach(mod => {
        (mod.lessons || []).forEach(lesson => {
            filesCount    += (lesson.materials || []).length;
            totalDuration += (lesson.materials || []).reduce(
                (s, m) => s + (m.duration_seconds || 0), 0,
            );
        });
    });

    const getDurationDisplay = () => {
        if (course.duration && course.duration.trim() !== '') return course.duration;
        if (totalDuration > 0) return formatDuration(totalDuration);
        return 'N/A';
    };

    const averageRating = ratings.length > 0
        ? (ratings.reduce((s, r) => s + (r.rating || r), 0) / ratings.length).toFixed(1)
        : course.average_rating ?? 'N/A';
    const studentCount = students.length > 0 ? students.length : (course.students_count ?? 0);

    const plans          = course.coursePlans || course.course_plans || [];
    const isFree         = Boolean(course.is_free);
    const individualPlan = plans.find(p => p.type === 'individual');
    const orgPlan        = plans.find(p => p.type === 'organization');

    const formatPrice = (plan) => {
        if (!plan) return null;
        if (isFree || plan.price === 0 || plan.price === '0.00') return 'FREE';
        return `₱${parseFloat(plan.price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
    };

    const PlanRow = ({ icon: Icon, title, subtitle, price, color, bgColor }) => (
        <Box
            sx={{
                display:     'flex',
                alignItems:  'center',
                justifyContent:'space-between',
                // xs: tighter padding
                p:            { xs: 1.25, sm: 1.5, md: 2 },
                borderRadius: 4,
                border:      '1px solid',
                borderColor: 'divider',
                bgcolor:     'background.paper',
                transition:  `all 280ms ${EASE}`,
                position:    'relative',
                overflow:    'hidden',
                gap:          1,
                '&:hover': {
                    borderColor: color,
                    transform:   'translateX(4px)',
                    boxShadow:   `0 4px 20px -5px ${color}33`,
                    '& .plan-avatar': { transform: 'scale(1.1)' },
                },
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                // xs: reduce spacing so icon + text don't overflow
                spacing={{ xs: 1.5, sm: 2, md: 2.5 }}
                sx={{ minWidth: 0 }}
            >
                <Avatar
                    className="plan-avatar"
                    sx={{
                        bgcolor:    bgColor,
                        // xs: smaller avatar
                        width:      { xs: 36, sm: 40, md: 44 },
                        height:     { xs: 36, sm: 40, md: 44 },
                        flexShrink: 0,
                        transition: `transform 300ms ${EASE_SPRING}`,
                    }}
                >
                    <Icon sx={{ color, fontSize: { xs: 20, sm: 22, md: 24 } }} />
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        variant="body2"
                        fontWeight={600}
                        color="text.primary"
                        noWrap
                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={600}
                        noWrap
                        sx={{ fontSize: { xs: '0.68rem', sm: '0.75rem' } }}
                    >
                        {subtitle}
                    </Typography>
                </Box>
            </Stack>
            <Typography
                fontWeight={700}
                color={color}
                // xs: slightly smaller price text so it doesn't overflow
                variant="h6"
                sx={{
                    flexShrink: 0,
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                }}
            >
                {price}
            </Typography>
        </Box>
    );

    return (
        <Paper
            elevation={0}
            sx={{
                border:      '1px solid',
                borderColor: 'divider',
                borderRadius: 5,
                overflow:    'hidden',
                width:       '100%',
                boxShadow:   '0 20px 60px -12px rgba(0,0,0,0.08)',
                bgcolor:     '#FFFFFF',
            }}
        >
            {/* Thumbnail */}
            <Box sx={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', bgcolor: 'grey.100' }}>
                {course.course_thumbnail_url ? (
                    <Box
                        component="img"
                        src={course.course_thumbnail_url}
                        alt={course.title}
                        sx={{
                            width:       '100%',
                            height:      '100%',
                            objectFit:   'cover',
                            transition:  `transform 1.2s ${EASE}`,
                            '&:hover':   { transform: 'scale(1.06)' },
                        }}
                    />
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <Typography color="text.disabled" fontWeight={700} variant="button">
                            Preview Unavailable
                        </Typography>
                    </Box>
                )}

                <Chip
                    label={statusCfg.label}
                    size="small"
                    sx={{
                        position:        'absolute',
                        top:              { xs: 12, sm: 20 },
                        left:             { xs: 12, sm: 20 },
                        bgcolor:          statusCfg.bg,
                        color:            statusCfg.color,
                        fontWeight:       900,
                        fontSize:         10,
                        height:           26,
                        px:               1,
                        textTransform:   'uppercase',
                        letterSpacing:    1,
                        backdropFilter:  'blur(8px)',
                        boxShadow:       '0 8px 16px rgba(0,0,0,0.1)',
                        border:          '1px solid rgba(255,255,255,0.4)',
                    }}
                />
            </Box>

            <Box sx={{ p: { xs: 2, sm: 2.5, md: 3, lg: 4 } }}>
                {/* Category */}
                <Typography
                    variant="caption"
                    fontWeight={600}
                    sx={{
                        color:          'success.main',
                        textTransform:  'uppercase',
                        letterSpacing:   1.5,
                        display:        'block',
                        mb:              1,
                        fontSize:       { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                    }}
                >
                    {categoryLabel}
                </Typography>

                {/* Title — scale down on xs/sm so it never overflows */}
                <Typography
                    variant="h4"
                    fontWeight={600}
                    sx={{
                        lineHeight: 1.1,
                        mb: 2,
                        color: 'text.primary',
                        letterSpacing: -1,
                        // xs: shrink aggressively; sm: mid-size; md+: original h4
                        fontSize: { xs: '1.35rem', sm: '1.6rem', md: '2.125rem' },
                    }}
                >
                    {course.title}
                </Typography>

                {/* Author */}
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: { xs: 2, sm: 3 } }}>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: 'grey.100' }}>
                        <PersonRoundedIcon sx={{ fontSize: 14, color: 'grey.600' }} />
                    </Avatar>
                    <Typography
                        variant="caption"
                        fontWeight={600}
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.72rem', sm: '0.75rem' } }}
                    >
                        By{' '}
                        <span style={{ color: '#187604', fontWeight: 600 }}>{authorName}</span>
                    </Typography>
                </Stack>

                {/* Description */}
                <Box sx={{ mb: { xs: 2.5, sm: 3, md: 4 } }}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            lineHeight:        1.8,
                            display:          '-webkit-box',
                            WebkitLineClamp:   isDescriptionExpanded ? 'unset' : 3,
                            WebkitBoxOrient:  'vertical',
                            overflow:         'hidden',
                            transition:       `all 400ms ${EASE}`,
                            fontSize:         { xs: '0.8rem', sm: '0.875rem' },
                        }}
                    >
                        {stripHTML(course.description)}
                    </Typography>
                    {stripHTML(course.description).length > 120 && (
                        <ButtonBase
                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                            sx={{
                                color:         'success.main',
                                fontWeight:     600,
                                mt:             1.5,
                                fontSize:      '0.7rem',
                                letterSpacing:  0.5,
                                borderRadius:   1,
                                transition:    `color 200ms ${EASE}`,
                                '&:hover': { color: 'success.dark' },
                            }}
                        >
                            {isDescriptionExpanded ? 'Hide' : 'Read more'}
                            <KeyboardArrowDownRoundedIcon
                                sx={{
                                    fontSize:   16,
                                    ml:          0.5,
                                    transform:  isDescriptionExpanded ? 'rotate(180deg)' : 'none',
                                    transition: `transform 300ms ${EASE_SPRING}`,
                                }}
                            />
                        </ButtonBase>
                    )}
                </Box>

                {/* Stats grid
                 *   xs: 2 columns
                 *   sm+: 3 columns (same as original)
                 */}
                <Box
                    sx={{
                        display:             'grid',
                        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
                        gap:                  { xs: 0.75, sm: 1 },
                        mb:                   { xs: 2.5, sm: 3, md: 4 },
                    }}
                >
                    <StatTile
                        icon={<AccessTimeRoundedIcon />}
                        label="Duration"
                        value={getDurationDisplay()}
                    />
                    <StatTile
                        icon={<FolderOpenRoundedIcon />}
                        label="Materials"
                        value={`${filesCount} Files`}
                    />
                    <StatTile
                        icon={<QuizRoundedIcon />}
                        label="Tasks"
                        value={quizCount > 0 ? `${quizCount} Assessment/s` : 'N/A'}
                    />
                    <StatTile
                        icon={<GroupRoundedIcon />}
                        label="Enrollment"
                        value={studentCount.toLocaleString()}
                    />
                    {/* Performance tile: full width on xs (2-col grid); span 2 cols on sm+ */}
                    <Box sx={{ gridColumn: { xs: '1 / -1', sm: 'span 2' } }}>
                        <StatTile
                            icon={<StarRoundedIcon />}
                            label="Performance"
                            value={`${averageRating} / 5.0 Rating`}
                        />
                    </Box>
                </Box>

                <Divider sx={{ mb: { xs: 2.5, sm: 3, md: 4 }, opacity: 0.5 }} />

                {/* Pricing */}
                <Typography
                    variant="caption"
                    fontWeight={600}
                    sx={{
                        textTransform: 'uppercase',
                        color:         'text.disabled',
                        letterSpacing:  1,
                        mb:             2,
                        display:       'block',
                        fontSize:      { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                    }}
                >
                    Available Licenses
                </Typography>
                <Stack spacing={2}>
                    {isFree && (
                        <PlanRow
                            icon={PersonRoundedIcon}
                            title="Community Access"
                            subtitle="Free for all authenticated users"
                            price="FREE"
                            color="#187604"
                            bgColor="#e8f5e9"
                        />
                    )}
                    {!isFree && individualPlan && (
                        <PlanRow
                            icon={PersonRoundedIcon}
                            title="Individual"
                            subtitle={`Full Access • ${individualPlan.duration || 'Lifetime'}`}
                            price={formatPrice(individualPlan)}
                            color="#187604"
                            bgColor="#e8f5e9"
                        />
                    )}
                    {!isFree && orgPlan && (
                        <PlanRow
                            icon={BusinessRoundedIcon}
                            title="Organization"
                            subtitle={`Multi-user • ${orgPlan.duration || '1 Year'}`}
                            price={formatPrice(orgPlan)}
                            color="#187604"
                            bgColor="#e8f5e9"
                        />
                    )}
                </Stack>
            </Box>
        </Paper>
    );
}