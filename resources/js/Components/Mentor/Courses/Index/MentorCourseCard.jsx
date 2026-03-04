// resources/js/Components/Mentor/Courses/Index/MentorCourseCard.jsx
//
//  Redesigned card — same width (354 px), all functions preserved.
//  Sub-components live in ./MentorCourseCardParts.jsx

import { useState } from 'react';
import { Link, router } from '@inertiajs/react';

import {
    Box, Card, CardContent, CardActionArea,
    Divider, IconButton, Menu, MenuItem,
    Stack, Tooltip, Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

// Icons
import MoreVertIcon              from '@mui/icons-material/MoreVert';
import DeleteOutlineRoundedIcon  from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon           from '@mui/icons-material/EditRounded';
import GroupRoundedIcon          from '@mui/icons-material/GroupRounded';
import AnalyticsRoundedIcon      from '@mui/icons-material/AnalyticsRounded';
import AttachMoneyRoundedIcon    from '@mui/icons-material/AttachMoneyRounded';
import ArchiveRoundedIcon        from '@mui/icons-material/ArchiveRounded';

import CourseWarningModal from '@/Components/Mentor/Courses/CourseWarningModal';

import {
    C,
    EASE,
    EASE_SPRING,
    CourseThumbnail,
    CategoryChip,
    StatsRow,
    PriceDisplay,
    UpdatedAt,
} from './MentorCourseCardParts';

// ─── Delete overlay shown when archived ───────────────────────────────────────
function ArchivedOverlay({ onDeleteClick }) {
    return (
        <Box
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            sx={{
                position:       'absolute',
                inset:           0,
                zIndex:          10,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                bgcolor:        'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(1px)',
                borderRadius:    3,
                cursor:         'default',
            }}
        >
            <Tooltip title="Delete permanently" placement="top" arrow>
                <IconButton
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDeleteClick(); }}
                    sx={{
                        width:   64,
                        height:  64,
                        bgcolor: 'rgba(255,255,255,0.9)',
                        boxShadow:`0 4px 20px ${alpha('#000', 0.15)}`,
                        color:    C.danger,
                        transition:`all 220ms ${EASE}`,
                        '&:hover': {
                            bgcolor:   alpha(C.danger, 0.08),
                            transform: 'scale(1.1)',
                            boxShadow:`0 8px 28px ${alpha(C.danger, 0.25)}`,
                        },
                        '&:active': { transform: 'scale(0.96)' },
                    }}
                >
                    <DeleteOutlineRoundedIcon sx={{ fontSize: 30 }} />
                </IconButton>
            </Tooltip>
        </Box>
    );
}

// ─── Kebab menu ───────────────────────────────────────────────────────────────
function CourseMenu({ anchorEl, open, onClose, courseId, isArchived, onUnpublishClick }) {
    const navigate = (path) => { onClose(); router.get(route(path, courseId)); };

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            transitionDuration={160}
            PaperProps={{
                elevation: 4,
                sx: {
                    mt:           1.2,
                    borderRadius: 3,
                    minWidth:     192,
                    border:      `1px solid ${alpha('#000', 0.06)}`,
                    boxShadow:   `0 8px 32px ${alpha('#000', 0.12)}`,
                    overflow:    'visible',
                    // stagger item entrance
                    '& .MuiMenuItem-root': {
                        fontSize:  '0.875rem',
                        py:         1,
                        gap:        1.25,
                        borderRadius: 2,
                        mx:          0.5,
                        my:          0.15,
                        transition: `background-color 140ms ${EASE}`,
                    },
                },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <MenuItem onClick={() => navigate('mentor.courses.edit')}>
                <EditRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                Edit Course
            </MenuItem>
            <MenuItem onClick={onClose}>
                <GroupRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                View Enrollees
            </MenuItem>
            <MenuItem onClick={onClose}>
                <AnalyticsRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                Analytics
            </MenuItem>
            <MenuItem onClick={onClose}>
                <AttachMoneyRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                Pricing
            </MenuItem>

            <Divider sx={{ my: 0.5, mx: 1 }} />

            <MenuItem
                disabled={isArchived}
                onClick={() => { onClose(); onUnpublishClick(); }}
                sx={{
                    color:   '#b45309',
                    '&:hover': { bgcolor: C.amberLight },
                    '& .MuiSvgIcon-root': { color: '#b45309 !important' },
                }}
            >
                <ArchiveRoundedIcon fontSize="small" />
                Unpublish
            </MenuItem>
        </Menu>
    );
}

// ─── Main card ────────────────────────────────────────────────────────────────
export default function CourseCard({ course }) {
    const [anchorEl,      setAnchorEl]      = useState(null);
    const [unpublishOpen, setUnpublishOpen] = useState(false);
    const [deleteOpen,    setDeleteOpen]    = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const menuOpen   = Boolean(anchorEl);
    const isArchived = course.draft_status === 'archived';

    // ── menu ──────────────────────────────────────────────────────────────────
    const openMenu  = (e) => { e.preventDefault(); e.stopPropagation(); setAnchorEl(e.currentTarget); };
    const closeMenu = (e) => { if (e) { e.preventDefault(); e.stopPropagation(); } setAnchorEl(null); };

    // ── unpublish ─────────────────────────────────────────────────────────────
    const handleUnpublishConfirm = () => {
        if (actionLoading) return;
        setActionLoading(true);
        router.post(route('mentor.courses.archive', course.id), {}, {
            onFinish: () => { setActionLoading(false); setUnpublishOpen(false); },
        });
    };

    // ── permanent delete ──────────────────────────────────────────────────────
    const handleDeleteConfirm = () => {
        if (actionLoading) return;
        setActionLoading(true);
        router.delete(route('mentor.courses.destroy', course.id), {
            onFinish: () => { setActionLoading(false); setDeleteOpen(false); },
        });
    };

    // ── derived ───────────────────────────────────────────────────────────────
    const students         = course.students          ?? [];
    const ratings          = course.ratings           ?? [];
    const resourcesCount   = course.resources_count   ?? 0;
    const assessmentsCount = course.assessments_count ?? 0;
    const durationLabel    = course.duration_label    ?? null;
    const categoryName     = course.category_name     ?? null;

    return (
        <>
            <Card
                className="card-root"   // used by CourseThumbnail CSS selector
                sx={{
                    width:        { xs: '100%', sm: 'auto', md: '350px', lg: '350px', xl: '365px' },
                    height:      '100%',
                    display:     'flex',
                    flexDirection:'column',
                    borderRadius:  3,
                    border:       `1px solid ${alpha('#000', 0.055)}`,
                    boxShadow:    `0 2px 10px ${alpha('#000', 0.06)}`,
                    position:    'relative',
                    overflow:    'hidden',
                    bgcolor:     '#fff',
                    filter:       isArchived ? 'grayscale(90%)' : 'none',
                    opacity:      isArchived ? 0.75 : 1,
                    // All transitions in one declaration = better performance
                    transition:  `transform 300ms ${EASE}, box-shadow 300ms ${EASE}, opacity 250ms ${EASE}`,
                    '&:hover': isArchived ? {} : {
                        transform: 'translateY(-5px)',
                        boxShadow:`0 16px 40px ${alpha('#000', 0.1)}, 0 0 0 1px ${alpha(C.green, 0.12)}`,
                    },
                }}
            >
                {/* Archived delete overlay */}
                {isArchived && (
                    <ArchivedOverlay onDeleteClick={() => setDeleteOpen(true)} />
                )}

                {/* ── Clickable body ──────────────────────────────────────── */}
                <CardActionArea
                    component={isArchived ? 'div' : Link}
                    href={isArchived ? undefined : route('mentor.courses.show', course.id)}
                    disableRipple={isArchived}
                    sx={{
                        flexGrow:      1,
                        display:      'flex',
                        flexDirection:'column',
                        alignItems:   'stretch',
                        cursor:        isArchived ? 'default' : 'pointer',
                        pointerEvents: isArchived ? 'none'    : 'auto',
                        // Override MUI ActionArea overlay
                        '& .MuiCardActionArea-focusHighlight': { opacity: 0 },
                        '&:hover .MuiCardActionArea-focusHighlight': { opacity: 0.03 },
                    }}
                >
                    {/* Thumbnail */}
                    <CourseThumbnail
                        url={course.course_thumbnail_url}
                        title={course.title}
                        status={course.draft_status}
                        showCertBadge={!course.certificate && !isArchived}
                    />

                    {/* ── Card body ─────────────────────────────────────── */}
                    <CardContent
                        sx={{
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            pt: 1.75,
                            pb: '14px !important',
                            px: 2,
                            gap: 0,
                        }}
                    >
                        {/* Category */}
                        {categoryName && (
                            <Box sx={{ mb: 0.9 }}>
                                <CategoryChip name={categoryName} />
                            </Box>
                        )}

                        {/* Title row + kebab */}
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 0.6 }}>
                            <Typography
                                variant="subtitle2"
                                fontWeight={700}
                                sx={{
                                    lineHeight:          1.35,
                                    display:            '-webkit-box',
                                    WebkitLineClamp:     2,
                                    WebkitBoxOrient:    'vertical',
                                    overflow:           'hidden',
                                    fontSize:           '0.88rem',
                                    letterSpacing:      '-0.1px',
                                    color:              'text.primary',
                                    flex:                1,
                                    mr:                  0.5,
                                    // Subtle colour shift on card hover
                                    transition:         `color 200ms ${EASE}`,
                                    '.card-root:hover &': {
                                        color: C.green,
                                    },
                                }}
                            >
                                {course.title}
                            </Typography>

                            <IconButton
                                size="small"
                                onClick={openMenu}
                                sx={{
                                    mt:           -0.5,
                                    mr:           -0.75,
                                    flexShrink:    0,
                                    color:        'text.disabled',
                                    borderRadius:  2,
                                    transition:   `color 160ms ${EASE}, background-color 160ms ${EASE}`,
                                    pointerEvents:'auto',
                                    zIndex:        isArchived ? 11 : 'auto',
                                    '&:hover': {
                                        color:  'text.primary',
                                        bgcolor: alpha(C.green, 0.07),
                                    },
                                }}
                            >
                                <MoreVertIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                        </Stack>

                        {/* Description */}
                        <Typography
                            variant="body2"
                            component="div"
                            dangerouslySetInnerHTML={{
                                __html: course.description || 'No description provided yet.',
                            }}
                            sx={{
                                mb:              1.5,
                                display:        '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient:'vertical',
                                overflow:       'hidden',
                                fontSize:       '0.775rem',
                                lineHeight:      1.55,
                                color:          'text.secondary',
                                minHeight:      '2.4em',
                                '& *':          { margin: 0, padding: 0 },
                            }}
                        />

                        {/* Stats */}
                        <StatsRow
                            students={students}
                            ratings={ratings}
                            resourcesCount={resourcesCount}
                            assessmentsCount={assessmentsCount}
                            durationLabel={durationLabel}
                        />

                        {/* Push footer to bottom */}
                        <Box sx={{ flex: 1 }} />

                        <Divider sx={{ mt: 1.25, mb: 1.1, borderColor: alpha('#000', 0.05) }} />

                        {/* Footer: date + price */}
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                            <UpdatedAt
                                label={course.updated_at_label}
                                formatted={course.updated_at_formatted}
                            />
                            <PriceDisplay course={course} />
                        </Stack>
                    </CardContent>
                </CardActionArea>
            </Card>

            {/* Menu */}
            <CourseMenu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={closeMenu}
                courseId={course.id}
                isArchived={isArchived}
                onUnpublishClick={() => setUnpublishOpen(true)}
            />

            {/* Modals */}
            <CourseWarningModal
                open={unpublishOpen}
                onClose={() => !actionLoading && setUnpublishOpen(false)}
                onConfirm={handleUnpublishConfirm}
                variant="unpublish"
                courseTitle={course.title}
                loading={actionLoading}
            />
            <CourseWarningModal
                open={deleteOpen}
                onClose={() => !actionLoading && setDeleteOpen(false)}
                onConfirm={handleDeleteConfirm}
                variant="delete"
                courseTitle={course.title}
                loading={actionLoading}
            />
        </>
    );
}
