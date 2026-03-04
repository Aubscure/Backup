/**
 * resources/js/Components/Enrollee/EnrolleeCourseCard.jsx
 *
 * Hover behaviour:
 *   - NOT enrolled → description fades out, stats slide up, "Buy/Enroll" button appears
 *   - Enrolled      → description stays visible, no slide-up, no button (enrolled badge shown instead)
 */

import { Link, router } from '@inertiajs/react';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Stack,
    Tooltip,
    Typography,
    Button,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useState, useCallback } from 'react';

// Icons
import AccessTimeRoundedIcon     from '@mui/icons-material/AccessTimeRounded';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import CorporateFareRoundedIcon  from '@mui/icons-material/CorporateFareRounded';
import HourglassTopRoundedIcon   from '@mui/icons-material/HourglassTopRounded';
import ImageRoundedIcon          from '@mui/icons-material/ImageRounded';
import MenuBookOutlinedIcon      from '@mui/icons-material/MenuBookOutlined';
import PeopleAltOutlinedIcon     from '@mui/icons-material/PeopleAltOutlined';
import PersonOutlineRoundedIcon  from '@mui/icons-material/PersonOutlineRounded';
import QuizOutlinedIcon          from '@mui/icons-material/QuizOutlined';
import StarBorderRoundedIcon     from '@mui/icons-material/StarBorderRounded';
import UpdateOutlinedIcon        from '@mui/icons-material/UpdateOutlined';
import CheckCircleOutlinedIcon   from '@mui/icons-material/CheckCircleOutlined';

import CoursePurchaseModal from '@/Components/Enrollee/Courses/CoursePurchaseModal';

// ── Theme constants ───────────────────────────────────────────────────────────

const G = {
    main:          '#166534',
    hover:         '#14532d',
    bg:            '#ffffff',
    textSecondary: '#6b7280',
};

const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
    }).format(amount);

// ── Tiny stat icon ────────────────────────────────────────────────────────────

function StatIcon({ icon, value, tooltip }) {
    return (
        <Tooltip title={tooltip} arrow placement="top">
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: G.textSecondary }}>
                {icon}
                <Typography variant="caption" fontWeight={600}>{value}</Typography>
            </Stack>
        </Tooltip>
    );
}

// ── Price display (card footer) ───────────────────────────────────────────────

function PriceDisplay({ indiPlan, orgPlan }) {
    const indiIsFree = !indiPlan || parseFloat(indiPlan.price ?? 0) === 0;
    const orgIsFree  = !orgPlan  || parseFloat(orgPlan.price  ?? 0) === 0;

    if (!indiPlan && !orgPlan) {
        return (
            <Stack alignItems="flex-end" sx={{ width: '100%' }}>
                <Typography variant="caption" sx={{ color: G.textSecondary }}>Lifetime Access</Typography>
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: G.main }}>Free</Typography>
            </Stack>
        );
    }

    if (indiPlan && orgPlan && indiIsFree && orgIsFree) {
        return (
            <Stack alignItems="flex-end" sx={{ width: '100%' }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: G.main, lineHeight: 1, mb: 0.5 }}>
                    Free
                </Typography>
                <Stack spacing={0.25} alignItems="flex-end">
                    {[
                        { plan: indiPlan, Icon: PersonOutlineRoundedIcon, label: 'Individual Plan' },
                        { plan: orgPlan,  Icon: CorporateFareRoundedIcon, label: 'Organization Plan' },
                    ].map(({ plan, Icon, label }) => (
                        <Tooltip key={label} title={label} placement="left" arrow>
                            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: G.textSecondary }}>
                                <Icon sx={{ fontSize: 12 }} />
                                <HourglassTopRoundedIcon sx={{ fontSize: 10 }} />
                                <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                                    {plan.access_duration_label || 'Lifetime'}
                                </Typography>
                            </Stack>
                        </Tooltip>
                    ))}
                </Stack>
            </Stack>
        );
    }

    const renderRow = (plan) => {
        if (!plan) return null;
        const isPlanFree = !plan.price || parseFloat(plan.price) === 0;
        const Icon = plan.type === 'individual' ? PersonOutlineRoundedIcon : CorporateFareRoundedIcon;
        const tipLabel = plan.type === 'individual' ? 'Individual Plan' : 'Organization Plan';

        return (
            <Stack
                key={plan.id ?? plan.type}
                direction="row" justifyContent="space-between" alignItems="flex-end"
                sx={{ width: '100%', mt: 0.5 }}
            >
                <Tooltip title={tipLabel} placement="right" arrow>
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: G.textSecondary, mb: 0.25 }}>
                        <Icon sx={{ fontSize: 14 }} />
                        <HourglassTopRoundedIcon sx={{ fontSize: 12 }} />
                        <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                            {plan.access_duration_label || 'Lifetime'}
                        </Typography>
                    </Stack>
                </Tooltip>
                <Typography variant="subtitle2" fontWeight={600} sx={{ color: isPlanFree ? G.main : '#111827' }}>
                    {isPlanFree ? 'Free' : formatCurrency(parseFloat(plan.price))}
                </Typography>
            </Stack>
        );
    };

    return (
        <Stack spacing={0.5} sx={{ width: '100%' }}>
            {renderRow(indiPlan)}
            {renderRow(orgPlan)}
        </Stack>
    );
}

// ── Main card ─────────────────────────────────────────────────────────────────

export default function EnrolleeCourseCard({ course }) {
    const [modalOpen, setModalOpen] = useState(false);

    // ── Derived values ────────────────────────────────────────────────────────

    const stripHtml = (html) => {
        if (!html) return '';
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
    };

    const categoryName     = course.category?.name || course.custom_category || 'Uncategorized';
    const description      = stripHtml(course.description || '');
    const mentorName       = course.user
        ? `${course.user.firstname || ''} ${course.user.lastname || ''}`.trim()
        : 'Unknown Mentor';
    const mentorAvatar     = course.user?.avatar_url || null;
    const studentsCount    = course.students_count    || 0;
    const ratingsCount     = course.ratings_count     || 0;
    const materialsCount   = course.materials_count   || course.files_count || 0;
    const assessmentsCount = course.assessments_count || 0;
    const durationLabel    = course.duration_label    || course.duration || '0h';
    const dateCreated      = course.created_at
        ? new Date(course.created_at).toLocaleDateString()
        : 'Unknown';
    const updatedMinutes   = course.updated_at_diff || 'Recently';

    // Plans
    const plans    = course.course_plans || course.coursePlans || [];
    const indiPlan = plans.find((p) => p.type === 'individual');
    const orgPlan  = plans.find((p) => p.type === 'organization');

    const indiIsFree   = !indiPlan || parseFloat(indiPlan.price ?? 0) === 0;
    const orgIsFree    = !orgPlan  || parseFloat(orgPlan.price  ?? 0) === 0;
    const bothFree     = indiIsFree && orgIsFree;
    const isFreeCourse = course.is_free || bothFree;

    /**
     * `is_enrolled` is set server-side in decorateForEnrollee().
     * When true:
     *   - The hover slide-up + description-fade effects are disabled
     *   - The "Buy/Enroll" button is not rendered
     *   - An "ENROLLED" badge is shown on the thumbnail instead
     */
    const isEnrolled = Boolean(course.is_enrolled);

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleCtaClick = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isEnrolled) return; // safety guard — button is not rendered when enrolled

        if (bothFree) {
            router.visit(route('enrollee.courses.show', course.id));
        } else {
            setModalOpen(true);
        }
    }, [isEnrolled, bothFree, course.id]);

    const handleCloseModal = useCallback(() => setModalOpen(false), []);

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <>
            <Card
                component={Link}
                href={route('enrollee.courses.show', course.id)}
                sx={{
                    borderRadius: 4,
                    height: '100%',
                    width: { xs: '100%', sm: 'auto', md: '340px', lg: '340px', xl: '360px' },
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    bgcolor: G.bg,
                    border: `1px solid ${alpha(G.main, 0.1)}`,
                    boxShadow: `0 4px 12px ${alpha('#000', 0.05)}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'scale(1.02) translateY(-4px)',
                        boxShadow: `0 20px 40px ${alpha(G.main, 0.15)}`,
                        borderColor: alpha(G.main, 0.3),

                        // Only apply slide/fade effects when NOT enrolled
                        ...(!isEnrolled && {
                            '& .hover-button':       { transform: 'translateY(0)', opacity: 1 },
                            '& .course-description': { opacity: 0, transform: 'translateY(-10px)' },
                            '& .slide-up-content':   { transform: 'translateY(-60px)' },
                        }),

                        // Thumbnail zoom applies regardless
                        '& .thumbnail-img': { transform: 'scale(1.05)' },
                    },
                }}
            >
                {/* ── Thumbnail ── */}
                <Box sx={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                    {course.course_thumbnail_url ? (
                        <CardMedia
                            component="img"
                            image={course.course_thumbnail_url}
                            alt={course.title}
                            className="thumbnail-img"
                            sx={{ height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        />
                    ) : (
                        <Box sx={{
                            height: '100%', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', bgcolor: alpha(G.main, 0.05),
                        }}>
                            <ImageRoundedIcon sx={{ fontSize: 60, color: alpha(G.main, 0.2) }} />
                        </Box>
                    )}

                    {/* Category chip */}
                    <Chip
                        label={categoryName.toUpperCase()}
                        size="small"
                        sx={{
                            position: 'absolute', top: 12, left: 12, zIndex: 2,
                            bgcolor: 'rgba(255,255,255,0.58)',
                            backdropFilter: 'blur(4px)',
                            WebkitBackdropFilter: 'blur(44px)',
                            border: '2px solid rgba(255,255,255,0)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            color: '#111827', fontWeight: 600,
                            fontSize: '0.65rem', letterSpacing: '0.5px',
                        }}
                    />

                    {/* Enrolled badge — replaces the hover button */}
                    {isEnrolled && (
                        <Box sx={{
                            position: 'absolute', top: 12, right: 12, zIndex: 2,
                            display: 'flex', alignItems: 'center', gap: 0.5,
                            bgcolor: alpha(G.main, 0.9),
                            backdropFilter: 'blur(4px)',
                            borderRadius: 2, px: 1, py: 0.4,
                        }}>
                            <CheckCircleOutlinedIcon sx={{ fontSize: 13, color: '#fff' }} />
                            <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.4px' }}>
                                ENROLLED
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* ── Content ── */}
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5, position: 'relative' }}>

                    {/* Mentor row */}
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5, mt: -4, position: 'relative', zIndex: 3 }}>
                        <Avatar
                            src={mentorAvatar}
                            sx={{
                                width: 44, height: 44,
                                border: `3px solid ${G.bg}`,
                                boxShadow: `0 2px 8px ${alpha('#000', 0.1)}`,
                                bgcolor: G.main,
                            }}
                        >
                            {mentorName.charAt(0)}
                        </Avatar>
                        <Typography variant="caption" fontWeight={600} sx={{ pt: 2, color: G.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            {mentorName}
                        </Typography>
                    </Stack>

                    {/* Title */}
                    <Typography variant="h6" fontWeight={600} sx={{
                        lineHeight: 1.3, color: '#111827',
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        position: 'relative', zIndex: 2,
                    }}>
                        {course.title}
                    </Typography>

                    {/*
                     * Description:
                     *   - Not enrolled → participates in the hover fade-out (className + transition)
                     *   - Enrolled     → static, always visible, no animation
                     */}
                    <Typography
                        className={!isEnrolled ? 'course-description' : undefined}
                        variant="body2"
                        sx={{
                            mb: 2.5,
                            color: G.textSecondary,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.6,
                            minHeight: '3.2em',
                            // Transition only needed when the class is active
                            ...(!isEnrolled && {
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                opacity: 1,
                            }),
                        }}
                    >
                        {description || 'No description provided.'}
                    </Typography>

                    {/*
                     * Slide-up block (stats + footer):
                     *   - Not enrolled → slide-up on hover (className + transition)
                     *   - Enrolled     → static, no transition
                     */}
                    <Box
                        className={!isEnrolled ? 'slide-up-content' : undefined}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                            ...(!isEnrolled && {
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }),
                        }}
                    >
                        {/* Stats row */}
                        <Stack direction="row" flexWrap="wrap" gap={2} sx={{ mb: 1 }}>
                            <StatIcon icon={<PeopleAltOutlinedIcon fontSize="small" />}  value={studentsCount}    tooltip="Enrolled Students" />
                            <StatIcon icon={<StarBorderRoundedIcon fontSize="small" />}  value={ratingsCount}     tooltip="Ratings" />
                            <StatIcon icon={<MenuBookOutlinedIcon fontSize="small" />}   value={materialsCount}   tooltip="Learning Materials" />
                            <StatIcon icon={<QuizOutlinedIcon fontSize="small" />}        value={assessmentsCount} tooltip="Assessments" />
                            <StatIcon icon={<AccessTimeRoundedIcon fontSize="small" />}  value={durationLabel}   tooltip="Total Duration" />
                        </Stack>

                        <Box sx={{ flexGrow: 1 }} />

                        {/* Footer: price + dates */}
                        <Stack spacing={1} sx={{ pt: 2, borderTop: `1px solid ${alpha(G.textSecondary, 0.1)}` }}>
                            <Box sx={{ width: '100%' }}>
                                <PriceDisplay indiPlan={indiPlan} orgPlan={orgPlan} />
                            </Box>

                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: G.textSecondary }}>
                                    <CalendarTodayOutlinedIcon sx={{ fontSize: 12 }} />
                                    <Typography variant="caption">{dateCreated}</Typography>
                                </Stack>
                                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: G.textSecondary }}>
                                    <UpdateOutlinedIcon sx={{ fontSize: 12 }} />
                                    <Typography variant="caption">Updated {updatedMinutes}</Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Box>
                </CardContent>

                {/*
                 * Hover CTA button — only rendered when NOT enrolled.
                 * The CSS class "hover-button" is targeted by the card's &:hover
                 * selector above (also gated by !isEnrolled via the spread).
                 */}
                {!isEnrolled && (
                    <Box
                        className="hover-button"
                        sx={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            p: 2, pt: 6,
                            background: `linear-gradient(to top, ${G.bg} 40%, transparent 100%)`,
                            transform: 'translateY(100%)', opacity: 0,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
                            zIndex: 10,
                        }}
                    >
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleCtaClick}
                            sx={{
                                bgcolor: G.main, color: G.bg, fontWeight: 600,
                                py: 1.2, borderRadius: 2, textTransform: 'none',
                                boxShadow: `0 4px 12px ${alpha(G.main, 0.4)}`,
                                '&:hover': { bgcolor: G.hover },
                            }}
                        >
                            {isFreeCourse ? 'Enroll now' : 'Buy now'}
                        </Button>
                    </Box>
                )}
            </Card>

            {/* Purchase modal — rendered outside Card/Link to avoid nested navigation */}
            {!isEnrolled && (
                <CoursePurchaseModal
                    open={modalOpen}
                    onClose={handleCloseModal}
                    course={course}
                    indiPlan={indiPlan}
                    orgPlan={orgPlan}
                />
            )}
        </>
    );
}