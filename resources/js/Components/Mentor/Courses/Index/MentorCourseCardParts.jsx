// resources/js/Components/Mentor/Courses/Index/MentorCourseCardParts.jsx
//
//  Atomic sub-components consumed by MentorCourseCard.
//  Keep this file co-located with MentorCourseCard.jsx.

import {
    Box, Chip, Stack, Typography, Tooltip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

import CircleIcon                  from '@mui/icons-material/Circle';
import CategoryRoundedIcon         from '@mui/icons-material/CategoryRounded';
import PersonOutlineRoundedIcon    from '@mui/icons-material/PersonOutlineRounded';
import StarRoundedIcon             from '@mui/icons-material/StarRounded';
import LayersRoundedIcon           from '@mui/icons-material/LayersRounded';
import QuizRoundedIcon             from '@mui/icons-material/QuizRounded';
import AccessTimeRoundedIcon       from '@mui/icons-material/AccessTimeRounded';
import HourglassTopRoundedIcon     from '@mui/icons-material/HourglassTopRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import CalendarTodayRoundedIcon    from '@mui/icons-material/CalendarTodayRounded';
import ImageRoundedIcon            from '@mui/icons-material/ImageRounded';
import CorporateFareRoundedIcon    from '@mui/icons-material/CorporateFareRounded';

// ─── Brand tokens ─────────────────────────────────────────────────────────────
export const C = {
    green:      '#2e7d33',
    greenLight: '#edfbf3',
    amber:      '#f3a421',
    amberLight: '#fef8e7',
    danger:     '#d32f2f',
    dangerLight:'#fce8e6',
    surface:    '#f8faf8',
};

// shared easing
export const EASE        = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
export const EASE_SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

// ─── STATUS CHIP ─────────────────────────────────────────────────────────────
const STATUS_MAP = {
    published:   { bg: C.greenLight,  color: C.green,   dot: C.green  },
    draft:       { bg: C.amberLight,  color: '#92510a', dot: C.amber  },
    unpublished: { bg: '#fce8e6',     color: C.danger,  dot: C.danger },
    archived:    { bg: '#f1f3f4',     color: '#5f6368', dot: '#9aa0a6'},
};

export function StatusBadge({ status }) {
    const s = STATUS_MAP[status?.toLowerCase()] ?? STATUS_MAP.archived;
    return (
        <Chip
            icon={
                <CircleIcon
                    sx={{
                        fontSize:   '7px !important',
                        color:      `${s.dot} !important`,
                        ml:         '6px !important',
                        flexShrink:  0,
                    }}
                />
            }
            label={status}
            size="small"
            sx={{
                backgroundColor: s.bg,
                color:           s.color,
                fontWeight:      600,
                border:         'none',
                height:          22,
                backdropFilter: 'blur(6px)',
                boxShadow:      `0 1px 4px ${alpha('#000', 0.08)}`,
                '& .MuiChip-label': {
                    px:            1,
                    textTransform:'capitalize',
                    fontSize:     '0.7rem',
                    letterSpacing: 0.3,
                },
            }}
        />
    );
}

// ─── CERTIFICATE BADGE ────────────────────────────────────────────────────────
export function NeedsCertBadge() {
    return (
        <Tooltip title="Needs Certificate" placement="left" arrow>
            <Box
                sx={{
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    width:           28,
                    height:          28,
                    bgcolor:         C.amberLight,
                    border:         `1.5px solid ${alpha(C.amber, 0.55)}`,
                    borderRadius:   '50%',
                    boxShadow:      `0 2px 8px ${alpha(C.amber, 0.2)}`,
                    cursor:         'default',
                    transition:     `transform 220ms ${EASE_SPRING}, box-shadow 200ms ${EASE}`,
                    '&:hover': {
                        transform:  'scale(1.15)',
                        boxShadow: `0 4px 14px ${alpha(C.amber, 0.35)}`,
                    },
                }}
            >
                <WorkspacePremiumRoundedIcon sx={{ fontSize: 14, color: C.amber }} />
            </Box>
        </Tooltip>
    );
}

// ─── THUMBNAIL ───────────────────────────────────────────────────────────────
export function CourseThumbnail({ url, title, status, showCertBadge }) {
    return (
        <Box
            sx={{
                position:  'relative',
                height:     170,
                overflow:  'hidden',
                flexShrink: 0,
                '& img': {
                    width:      '100%',
                    height:     '100%',
                    objectFit: 'cover',
                    display:   'block',
                    transition:`transform 480ms ${EASE}`,
                },
                '.card-root:hover & img': {
                    transform: 'scale(1.04)',
                },
            }}
        >
            {url ? (
                <Box component="img" src={url} alt={title} />
            ) : (
                <Box
                    sx={{
                        height:         '100%',
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: 'center',
                        bgcolor:         C.amberLight,
                        backgroundImage:`radial-gradient(circle at 30% 50%, ${alpha(C.amber, 0.12)} 0%, transparent 60%)`,
                    }}
                >
                    <ImageRoundedIcon
                        sx={{
                            fontSize: 52,
                            color:    alpha(C.amber, 0.6),
                            filter:  `drop-shadow(0 2px 6px ${alpha(C.amber, 0.2)})`,
                        }}
                    />
                </Box>
            )}

            {/* Bottom gradient for legibility */}
            <Box
                sx={{
                    position:     'absolute',
                    bottom:        0,
                    left:          0,
                    right:         0,
                    height:        56,
                    background:   'linear-gradient(to top, rgba(0,0,0,0.22) 0%, transparent 100%)',
                    pointerEvents:'none',
                }}
            />

            {/* Status chip – top-left */}
            <Box sx={{ position: 'absolute', top: 10, left: 10, zIndex: 2 }}>
                <StatusBadge status={status} />
            </Box>

            {/* Cert badge – top-right */}
            {showCertBadge && (
                <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
                    <NeedsCertBadge />
                </Box>
            )}
        </Box>
    );
}

// ─── CATEGORY CHIP ───────────────────────────────────────────────────────────
export function CategoryChip({ name }) {
    if (!name) return null;
    return (
        <Chip
            icon={
                <CategoryRoundedIcon
                    sx={{ fontSize: '11px !important', color: `${C.green} !important`, ml: '5px !important' }}
                />
            }
            label={name}
            size="small"
            sx={{
                bgcolor:    C.greenLight,
                color:      C.green,
                fontWeight: 600,
                border:    `1px solid ${alpha(C.green, 0.15)}`,
                height:     20,
                '& .MuiChip-label': {
                    px:           0.8,
                    fontSize:    '0.65rem',
                    letterSpacing: 0.25,
                },
            }}
        />
    );
}

// ─── STAT PILL ────────────────────────────────────────────────────────────────
export function StatPill({ icon, label, tooltip }) {
    const el = (
        <Stack
            direction="row"
            alignItems="center"
            spacing={0.35}
            sx={{
                px:          0.9,
                py:          0.25,
                borderRadius: 10,
                bgcolor:     alpha('#000', 0.032),
                transition: `background-color 180ms ${EASE}`,
                '&:hover': {
                    bgcolor: alpha(C.green, 0.07),
                },
            }}
        >
            {icon}
            <Typography
                variant="caption"
                fontWeight={600}
                sx={{ fontSize: '0.7rem', color: 'text.secondary', lineHeight: 1 }}
            >
                {label}
            </Typography>
        </Stack>
    );
    return tooltip ? <Tooltip title={tooltip} placement="top" arrow>{el}</Tooltip> : el;
}

// ─── PRICE DISPLAY ───────────────────────────────────────────────────────────
const fmt = (amount) =>
    new Intl.NumberFormat('en-PH', {
        style: 'currency', currency: 'PHP', minimumFractionDigits: 0,
    }).format(amount);


function PlanRow({ plan }) {
    const isFree   = !plan.price || parseFloat(plan.price) === 0;
    const isIndi   = plan.type === 'individual';
    const TypeIcon = isIndi ? PersonOutlineRoundedIcon : CorporateFareRoundedIcon;
    const typeLabel = isIndi ? 'Individual' : 'Organization';

    return (
        <Tooltip title={typeLabel} placement="left" arrow>
            <Stack direction="row" alignItems="center" spacing={0.5}>
                {/* Type icon */}
                <TypeIcon
                    sx={{
                        fontSize: 13,
                        color:    isFree ? C.green : 'text.secondary',
                        flexShrink: 0,
                    }}
                />

                {/* Price */}
                <Typography
                    variant="caption"
                    fontWeight={600}
                    sx={{
                        fontSize:      isFree ? '0.78rem' : '0.82rem',
                        letterSpacing: '-0.2px',
                        color:          isFree ? C.green : 'text.primary',
                        lineHeight:     1,
                    }}
                >
                    {isFree ? 'FREE' : fmt(parseFloat(plan.price))}
                </Typography>

                {/* Access duration */}
                {plan.access_duration_label && (
                    <Stack direction="row" alignItems="center" spacing={0.25}>
                        <HourglassTopRoundedIcon sx={{ fontSize: 9, color: 'text.disabled' }} />
                        <Typography
                            variant="caption"
                            sx={{ fontSize: '0.62rem', color: 'text.disabled', lineHeight: 1 }}
                        >
                            {plan.access_duration_label}
                        </Typography>
                    </Stack>
                )}
            </Stack>
        </Tooltip>
    );
}

export function PriceDisplay({ course }) {
    // FIX: Laravel serialises the `coursePlans()` relation as `coursePlans`
    // (camelCase), not `course_plans`. Falling back to the snake_case key
    // keeps this safe if the shape ever changes elsewhere.
    const plans    = course.coursePlans ?? course.course_plans ?? [];
    const indiPlan = plans.find(p => p.type === 'individual');
    const orgPlan  = plans.find(p => p.type === 'organization');

    // No plans at all
    if (!indiPlan && !orgPlan) {
        return (
            <Typography variant="subtitle2" fontWeight={600} color="text.disabled" sx={{ fontSize: '0.8rem' }}>
                —
            </Typography>
        );
    }

    const indiIsFree = !indiPlan || !indiPlan.price || parseFloat(indiPlan.price) === 0;
    const orgIsFree  = !orgPlan  || !orgPlan.price  || parseFloat(orgPlan.price)  === 0;

    // Both plans exist and both are free → single FREE label + two duration rows
    if (indiPlan && orgPlan && indiIsFree && orgIsFree) {
        return (
            <Stack alignItems="flex-end" spacing={0.3}>
                <Typography
                    variant="caption"
                    fontWeight={600}
                    sx={{ fontSize: '0.85rem', letterSpacing: '-0.3px', color: C.green, lineHeight: 1 }}
                >
                    FREE
                </Typography>
                {[indiPlan, orgPlan].map((p) => {
                    if (!p.access_duration_label) return null;
                    const isIndi   = p.type === 'individual';
                    const TypeIcon = isIndi ? PersonOutlineRoundedIcon : CorporateFareRoundedIcon;
                    return (
                        <Tooltip key={p.id} title={isIndi ? 'Individual' : 'Organization'} placement="left" arrow>
                            <Stack direction="row" alignItems="center" spacing={0.3}>
                                <TypeIcon sx={{ fontSize: 10, color: 'text.disabled' }} />
                                <HourglassTopRoundedIcon sx={{ fontSize: 9, color: 'text.disabled' }} />
                                <Typography variant="caption" sx={{ fontSize: '0.62rem', color: 'text.disabled', lineHeight: 1 }}>
                                    {p.access_duration_label}
                                </Typography>
                            </Stack>
                        </Tooltip>
                    );
                })}
            </Stack>
        );
    }

    // Otherwise render each plan as its own row (handles mixed or both paid)
    return (
        <Stack alignItems="flex-end" spacing={0.45}>
            {indiPlan && <PlanRow plan={indiPlan} />}
            {orgPlan  && <PlanRow plan={orgPlan}  />}
        </Stack>
    );
}

// ─── UPDATED AT ───────────────────────────────────────────────────────────────
export function UpdatedAt({ label, formatted }) {
    if (!label && !formatted) {
        return (
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
                Last updated: —
            </Typography>
        );
    }
    return (
        <Stack spacing={0.15}>
            {label && (
                <Stack direction="row" spacing={0.35} alignItems="center">
                    <CalendarTodayRoundedIcon sx={{ fontSize: 10, color: C.green }} />
                    <Typography
                        variant="caption"
                        sx={{ fontSize: '0.65rem', color: C.green, fontWeight: 600 }}
                    >
                        Updated {label}
                    </Typography>
                </Stack>
            )}
            {formatted && (
                <Typography variant="caption" sx={{ fontSize: '0.62rem', color: 'text.disabled' }}>
                    {formatted}
                </Typography>
            )}
        </Stack>
    );
}

// ─── STATS ROW ────────────────────────────────────────────────────────────────
export function StatsRow({ students, ratings, resourcesCount, assessmentsCount, durationLabel }) {
    const avgRating = ratings?.length > 0 ? '0.0' : '0.0'; // extend when real data arrives
    return (
        <Stack direction="row" flexWrap="wrap" alignItems="center" gap={0.6}>
            <StatPill
                icon={<PersonOutlineRoundedIcon sx={{ fontSize: 13, color: 'text.disabled' }} />}
                label={`${students?.length ?? 0} students`}
                tooltip="Enrolled students"
            />
            <StatPill
                icon={<StarRoundedIcon sx={{ fontSize: 13, color: C.amber }} />}
                label={avgRating}
                tooltip="Average rating"
            />
            <StatPill
                icon={<LayersRoundedIcon sx={{ fontSize: 13, color: 'text.disabled' }} />}
                label={`${resourcesCount} ${resourcesCount === 1 ? 'Material' : 'Materials'}`}
                tooltip="Learning materials"
            />
            <StatPill
                icon={<QuizRoundedIcon sx={{ fontSize: 13, color: 'text.disabled' }} />}
                label={`${assessmentsCount} ${assessmentsCount === 1 ? 'Assessment' : 'Assessments'}`}
                tooltip="Assessments"
            />
            {durationLabel && (
                <StatPill
                    icon={<AccessTimeRoundedIcon sx={{ fontSize: 13, color: 'text.disabled' }} />}
                    label={durationLabel}
                    tooltip="Total duration"
                />
            )}
        </Stack>
    );
}
