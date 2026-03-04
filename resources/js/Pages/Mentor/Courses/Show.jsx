/**
 * Mentor / Courses / Show  (Course Overview)
 *
 * Displays a read-only summary of the course.
 * When the course is a draft AND all five requirements are met
 * (basic info · curriculum · media · pricing · certificate),
 * a "Publish Course" button appears in the header.
 * The button opens the shared <PublishConfirmModal>.
 *
 * Readiness is computed client-side from the course prop so the page
 * stays lightweight — no extra server round-trip needed.
 *
 * Security note:
 *   The actual publication is gated server-side by CoursePolicy@publish.
 *   The button being visible in the UI is purely UX sugar; the backend
 *   will reject the request if any requirement is unmet.
 *
 * RESPONSIVE: xs/sm breakpoints added — md/lg/xl behaviour is unchanged.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link, router }                   from '@inertiajs/react';
import {
    Fade,
    Box,
    Chip,
    Stack,
    Typography,
    Button,
    Paper,
    keyframes,
    Alert,
    Tooltip,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

// Icons
import ArrowBackIcon        from '@mui/icons-material/ArrowBack';
import EditIcon             from '@mui/icons-material/Edit';
import ViewListIcon         from '@mui/icons-material/ViewList';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import RocketLaunchIcon     from '@mui/icons-material/RocketLaunch';

// Layout
import MentorLayout from '@/Layouts/MentorLayout';

// Page components
import MentorOverviewSummaryCard from '@/Components/Mentor/Courses/Show/MentorOverviewSummaryCard';
import MentorSyllabusAccordion   from '@/Components/Mentor/Courses/Show/MentorSyllabusAccordion';
import PublishConfirmModal       from '@/Components/Mentor/Courses/PublishConfirmModal';

// Certificate
import CertificateContent, {
    CERT_W,
    CERT_H,
    PALETTES,
} from '@/Components/Mentor/Certificates/MentorCertificateContent';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useCourseReadiness(course) {
    return useMemo(() => {
        const syllabuses    = course.syllabuses ?? [];
        const coursePlans   = course.coursePlans ?? course.course_plans ?? [];

        const hasBasicInfo = !!(
            course.title?.trim() &&
            course.description?.trim() &&
            (course.category_id || course.custom_category?.trim()) &&
            course.duration?.trim()
        );

        const hasCurriculum =
            syllabuses.length > 0 &&
            syllabuses.some(s => (s.lessons ?? []).length > 0);

        const hasMedia = syllabuses.some(s =>
            (s.lessons ?? []).some(l =>
                (l.materials?.length ?? 0) > 0 || (l.videos?.length ?? 0) > 0,
            ),
        );

        const hasPricing = coursePlans.length > 0;

        const hasCertificate = !!course.certificate;

        return {
            hasBasicInfo,
            hasCurriculum,
            hasMedia,
            hasPricing,
            hasCertificate,
            all: hasBasicInfo && hasCurriculum && hasMedia && hasPricing && hasCertificate,
        };
    }, [course]);
}

// ─── Keyframes ────────────────────────────────────────────────────────────────

const fadeSlideDown  = keyframes`
  from { opacity: 0; transform: translateY(-18px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const fadeSlideUp    = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const fadeSlideLeft  = keyframes`
  from { opacity: 0; transform: translateX(-28px); }
  to   { opacity: 1; transform: translateX(0); }
`;
const fadeSlideRight = keyframes`
  from { opacity: 0; transform: translateX(28px); }
  to   { opacity: 1; transform: translateX(0); }
`;
const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(76,175,80,0.18); }
  50%       { box-shadow: 0 0 0 8px rgba(76,175,80,0); }
`;
const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;
const floatBadge = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-4px); }
`;
const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.88); }
  to   { opacity: 1; transform: scale(1); }
`;
const readyPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(21,128,61,0.35); }
  50%       { box-shadow: 0 0 0 8px rgba(21,128,61,0); }
`;

// ─── CourseTitlePill ──────────────────────────────────────────────────────────

function CourseTitlePill({ title }) {
    return (
        <Box sx={{
            display:        'inline-flex',
            alignItems:     'center',
            px:              1.5,
            py:              0.4,
            borderRadius:   '20px',
            background:     'linear-gradient(90deg,#e8f5e9 0%,#f1f8e9 40%,#e8f5e9 100%)',
            backgroundSize: '200% auto',
            animation:      `${shimmer} 3s linear infinite`,
            border:         '1px solid',
            borderColor:    'success.light',
            // xs/sm: slightly tighter caps so it never wraps past the pill
            maxWidth:       { xs: 140, sm: 200, md: 400 },
            overflow:       'hidden',
        }}>
            <Typography
                variant="body2"
                fontWeight={600}
                color="success.dark"
                noWrap
                sx={{
                    letterSpacing: 0.3,
                    // xs/sm: slightly smaller text so long titles don't clip badly
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                }}
            >
                {title}
            </Typography>
        </Box>
    );
}

// ─── FloatingStatBadge ────────────────────────────────────────────────────────

function FloatingStatBadge({ count, label }) {
    return (
        <Box sx={{
            display:     'inline-flex',
            alignItems:  'center',
            gap:          0.5,
            // xs/sm: smaller horizontal padding so the badges fit side-by-side
            px:           { xs: 1, sm: 1.5 },
            py:           0.5,
            borderRadius: 2,
            bgcolor:     (t) => alpha(t.palette.success.main, 0.08),
            border:      '1px solid',
            borderColor: (t) => alpha(t.palette.success.main, 0.22),
            animation:   `${floatBadge} 3.4s ease-in-out infinite`,
            cursor:      'default',
            transition:  'background 0.3s, box-shadow 0.3s',
            '&:hover': {
                bgcolor:   (t) => alpha(t.palette.success.main, 0.16),
                boxShadow: (t) => `0 2px 12px ${alpha(t.palette.success.main, 0.22)}`,
            },
        }}>
            <Typography variant="caption" fontWeight={700} color="success.dark">{count}</Typography>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
        </Box>
    );
}

// ─── ReadinessHint ────────────────────────────────────────────────────────────

function ReadinessHint({ readiness, mounted }) {
    const missing = [
        !readiness.hasBasicInfo   && 'Complete basic course info (title, description, category, duration)',
        !readiness.hasCurriculum  && 'Add at least one module with one lesson',
        !readiness.hasMedia       && 'Upload at least one media file or video',
        !readiness.hasPricing     && 'Configure pricing plans',
        !readiness.hasCertificate && 'Assign a completion certificate',
    ].filter(Boolean);

    if (missing.length === 0) return null;

    return (
        <Fade in={mounted} style={{ transitionDelay: '300ms' }}>
            <Alert
                severity="warning"
                sx={{
                    mb: 3,
                    borderRadius: 2,
                    // xs/sm: tighter padding so the alert doesn't crowd the screen
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 1,   sm: 1.5 },
                    '& .MuiAlert-message': { width: '100%' },
                }}
            >
                <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    Complete the following before publishing:
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2 }}>
                    {missing.map((item, i) => (
                        <li key={i}>
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>{item}</Typography>
                        </li>
                    ))}
                </Box>
            </Alert>
        </Fade>
    );
}

// ─── CertificateSection ───────────────────────────────────────────────────────

function CertificateSection({ certificate, course, mentorName, mounted }) {
    const pal       = certificate
        ? (PALETTES.find(p => p.id === certificate.color_palette) || PALETTES[0])
        : null;
    const dateLabel = certificate?.date_issued
        ? new Date(certificate.date_issued).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
          })
        : new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
          });

    const thumbScale = Math.min(700 / CERT_W, 1);

    return (
        <Box sx={{
            mt:        3,
            animation: mounted
                ? `${fadeSlideUp} 0.65s cubic-bezier(0.22,1,0.36,1) 0.4s both`
                : 'none',
        }}>
            {/* ── Header ──────────────────────────────────────────────── */}
            <Box sx={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
                flexWrap:       'wrap',
                gap:             1,
                mb:              2,
                // xs/sm: reduce padding
                p:               { xs: 1.5, sm: 2 },
                borderRadius:    3,
                bgcolor:        '#fff',
                border:         '1px solid',
                borderColor:    certificate
                    ? alpha(pal.primary, 0.22)
                    : alpha('#f0b429', 0.45),
                boxShadow:      certificate
                    ? `0 2px 12px ${alpha(pal.primary, 0.06)}`
                    : '0 2px 8px rgba(0,0,0,0.04)',
                transition:     'box-shadow 0.3s ease, border-color 0.3s ease',
                '&:hover': {
                    borderColor: certificate ? pal.primary : '#d97706',
                    boxShadow:   certificate
                        ? `0 4px 24px ${alpha(pal.primary, 0.14)}`
                        : '0 4px 16px rgba(240,180,41,0.18)',
                },
            }}>
                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                        display:    'flex',
                        alignItems: 'center',
                        gap:         1,
                        // xs: slightly smaller heading
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                        '& .cert-icon': {
                            color:      certificate ? pal.primary : '#d97706',
                            transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                        },
                        '&:hover .cert-icon': { transform: 'scale(1.3) rotate(-8deg)' },
                    }}
                >
                    <WorkspacePremiumIcon className="cert-icon" />
                    Course Certificate
                </Typography>

                <Button
                    component={Link}
                    href={route('certificates.index')}
                    size="small"
                    sx={{
                        textTransform: 'none',
                        fontWeight:     600,
                        fontSize:      { xs: '0.72rem', sm: '0.78rem' },
                        borderRadius:   2,
                        color:          certificate ? 'success.main' : 'text.secondary',
                        transition:    'all 0.2s',
                        '&:hover': {
                            bgcolor: certificate
                                ? alpha('#1e4d2b', 0.06)
                                : 'rgba(0,0,0,0.04)',
                            color: certificate ? 'success.dark' : 'text.primary',
                        },
                    }}
                >
                    {certificate ? 'Manage Certificates →' : 'Create Certificate →'}
                </Button>
            </Box>

            {/* ── Preview or empty state ───────────────────────────── */}
            {certificate ? (
                <Paper
                    variant="outlined"
                    sx={{
                        borderRadius: 3,
                        overflow:     'hidden',
                        bgcolor:      '#fff',
                        borderColor:  alpha(pal.primary, 0.18),
                        transition:   'box-shadow 0.35s ease, transform 0.35s ease',
                        '&:hover': {
                            boxShadow: `0 12px 40px ${alpha(pal.primary, 0.14)}`,
                            transform: 'translateY(-2px)',
                        },
                    }}
                >
                    {/* Meta bar */}
                    <Box sx={{
                        display:     'flex',
                        alignItems:  'center',
                        gap:          { xs: 0.75, sm: 1.5 },
                        px:           { xs: 1.5, sm: 2.5 },
                        py:           { xs: 1,   sm: 1.25 },
                        borderBottom: '1px solid',
                        borderColor:  alpha(pal.primary, 0.1),
                        background:  `linear-gradient(135deg,#fff 0%,${pal.bg} 100%)`,
                        flexWrap:    'wrap',
                    }}>
                        <Box sx={{
                            width: 22, height: 22, borderRadius: '50%',
                            overflow: 'hidden', display: 'flex', flexShrink: 0,
                            border: `2px solid ${alpha(pal.primary, 0.3)}`,
                        }}>
                            <Box sx={{ flex: 1, bgcolor: pal.primary }} />
                            <Box sx={{ flex: 1, bgcolor: pal.secondary }} />
                        </Box>
                        <Chip
                            label={certificate.design_layout.toUpperCase()}
                            size="small"
                            sx={{
                                bgcolor:      alpha(pal.primary, 0.1),
                                color:        pal.primary,
                                fontWeight:   700,
                                fontSize:    '0.65rem',
                                letterSpacing: 0.8,
                                height:       20,
                                border:      `1px solid ${alpha(pal.primary, 0.2)}`,
                            }}
                        />
                        <Chip
                            label={pal.label}
                            size="small"
                            sx={{
                                bgcolor:    alpha(pal.secondary, 0.15),
                                color:      'text.secondary',
                                fontWeight:  600,
                                fontSize:  '0.65rem',
                                height:     20,
                            }}
                        />
                        <Box sx={{ flex: 1 }} />
                        {/* xs: hide the date label to save space, show on sm+ */}
                        <Typography
                            variant="caption"
                            color="text.disabled"
                            sx={{
                                fontSize:  '0.68rem',
                                display:   { xs: 'none', sm: 'block' },
                            }}
                        >
                            Issued: {dateLabel}
                        </Typography>
                    </Box>

                    {/* Scaled render — on xs/sm we reduce the inner padding */}
                    <Box sx={{
                        display:        'flex',
                        alignItems:     'flex-start',
                        justifyContent: 'center',
                        p:               { xs: 1.5, sm: 2, md: 3 },
                        bgcolor:        '#f8f8f8',
                        overflowX:      'auto',
                        minHeight:      CERT_H * thumbScale + 48,
                    }}>
                        <Box sx={{
                            transform:       `scale(${thumbScale})`,
                            transformOrigin: 'top center',
                            width:            CERT_W,
                            flexShrink:       0,
                            pointerEvents:   'none',
                            animation:       `${scaleIn} 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.5s both`,
                            filter:          'drop-shadow(0 8px 32px rgba(0,0,0,0.12))',
                        }}>
                            <CertificateContent
                                template={certificate.design_layout}
                                palette={certificate.color_palette}
                                courseName={course.title}
                                instructorName={mentorName}
                                dateLabel={dateLabel}
                                certId={`CRT-${certificate.id}`}
                            />
                        </Box>
                    </Box>
                </Paper>
            ) : (
                <Paper
                    variant="outlined"
                    sx={{
                        borderRadius:  3,
                        // xs/sm: tighter padding
                        p:              { xs: 2.5, sm: 3, md: 4 },
                        textAlign:     'center',
                        bgcolor:       '#fffbf0',
                        border:        '1px dashed #f0b429',
                        display:       'flex',
                        flexDirection: 'column',
                        alignItems:    'center',
                        gap:            1.5,
                    }}
                >
                    <Box sx={{
                        width:          52,
                        height:         52,
                        borderRadius:  '50%',
                        bgcolor:       'rgba(240,180,41,0.12)',
                        display:       'flex',
                        alignItems:    'center',
                        justifyContent:'center',
                    }}>
                        <WorkspacePremiumIcon sx={{ color: '#d97706', fontSize: 26 }} />
                    </Box>
                    <Typography variant="subtitle2" fontWeight={700} color="#92400e">
                        No Certificate Assigned
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            maxWidth: 380,
                            lineHeight: 1.6,
                            // xs: slightly smaller body copy
                            fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        }}
                    >
                        This course doesn't have a completion certificate yet.
                        Head to the Certificate Generator to design one and assign it here.
                    </Typography>
                </Paper>
            )}
        </Box>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Show({ course, mentor, students = [], ratings = [] }) {
    const theme      = useTheme();
    const isXs       = useMediaQuery(theme.breakpoints.only('xs'));

    const moduleCount = (course.syllabuses || []).length;
    const lessonCount = (course.syllabuses || []).reduce(
        (sum, mod) => sum + (mod.lessons || []).length,
        0,
    );

    const [editHover,        setEditHover]        = useState(false);
    const [mounted,          setMounted]          = useState(false);
    const [publishModalOpen, setPublishModalOpen] = useState(false);
    const [publishing,       setPublishing]       = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(t);
    }, []);

    const readiness  = useCourseReadiness(course);
    const isDraft    = course.draft_status === 'draft';
    const canPublish = isDraft && readiness.all;

    const certificate = course.certificate || null;
    const mentorName  = mentor?.name || '';

    // ── Publish handler ───────────────────────────────────────────────────────
    const handlePublishConfirm = () => {
        setPublishing(true);
        router.post(
            route('mentor.courses.publish', course.id),
            {},
            {
                onSuccess: () => {
                    setPublishModalOpen(false);
                    setPublishing(false);
                },
                onError: () => {
                    setPublishModalOpen(false);
                    setPublishing(false);
                },
                onFinish: () => setPublishing(false),
            },
        );
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <>
            <Head title={`Overview – ${course.title}`} />

            <Box
                component="section"
                sx={{
                    // xs/sm: reduce outer padding so content has more room
                    p:         { xs: 1.5, sm: 2, md: 3, lg: 4 },
                    maxWidth:  '100%',
                    width:     '100%',
                    boxSizing: 'border-box',
                    backgroundImage: `
                        radial-gradient(circle at 15% 20%, rgba(76,175,80,0.04) 0%, transparent 50%),
                        radial-gradient(circle at 85% 80%, rgba(33,150,243,0.04) 0%, transparent 50%)
                    `,
                }}
            >
                {/* ── Header row ──────────────────────────────────────────── */}
                <Box sx={{
                    display:        'flex',
                    // xs: stack breadcrumb above buttons so neither gets squashed
                    flexDirection:  { xs: 'column', sm: 'row' },
                    alignItems:     { xs: 'flex-start', sm: 'center' },
                    justifyContent: 'space-between',
                    mb:              { xs: 2, sm: 2.5, md: 3 },
                    flexWrap:       'wrap',
                    gap:             { xs: 1, sm: 1 },
                    animation:      mounted
                        ? `${fadeSlideDown} 0.5s cubic-bezier(0.22,1,0.36,1) both`
                        : 'none',
                }}>
                    {/* Breadcrumb */}
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.5}
                        sx={{ flexWrap: 'wrap', minWidth: 0, flex: 1 }}
                    >
                        <Button
                            component={Link}
                            href={route('mentor.courses.index')}
                            startIcon={<ArrowBackIcon fontSize="small" />}
                            size="small"
                            sx={{
                                color:         'text.secondary',
                                textTransform: 'none',
                                fontWeight:     400,
                                borderRadius:   2,
                                // xs: tighter font
                                fontSize:      { xs: '0.78rem', sm: '0.875rem' },
                                transition:    'all 0.25s ease',
                                whiteSpace:    'nowrap',
                                '&:hover': {
                                    color:   'primary.main',
                                    bgcolor: (t) => alpha(t.palette.primary.main, 0.07),
                                    transform:'translateX(-3px)',
                                    '& .MuiButton-startIcon': { transform: 'translateX(-3px)' },
                                },
                                '& .MuiButton-startIcon': { transition: 'transform 0.25s ease' },
                            }}
                        >
                            {/* xs: shorten label to "Back" to save space */}
                            {isXs ? 'Back' : 'Back to Courses'}
                        </Button>
                        <Typography color="text.disabled" sx={{ userSelect: 'none' }}>/</Typography>
                        <CourseTitlePill title={course.title} />
                    </Stack>

                    {/* Action buttons */}
                    <Stack
                        direction="row"
                        spacing={{ xs: 1, sm: 1.5 }}
                        alignItems="center"
                        flexWrap="wrap"
                        // xs: push buttons to start so they sit under the breadcrumb neatly
                        sx={{ width: { xs: '100%', sm: 'auto' } }}
                    >

                        {/* ── Publish Course — only draft + all requirements met ── */}
                        {canPublish && (
                            <Fade in={canPublish}>
                                <Button
                                    variant="contained"
                                    startIcon={<RocketLaunchIcon sx={{ fontSize: '18px !important' }} />}
                                    onClick={() => setPublishModalOpen(true)}
                                    // xs: fill remaining space; sm+: auto width
                                    size={isXs ? 'small' : 'medium'}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight:     700,
                                        borderRadius:   2,
                                        bgcolor:       '#15803d',
                                        color:         '#fff',
                                        // xs: a bit less padding
                                        px:             { xs: 1.5, sm: 2.5 },
                                        fontSize:      { xs: '0.78rem', sm: '0.875rem' },
                                        animation:     `${readyPulse} 3s ease-in-out infinite`,
                                        transition:    'all 0.28s cubic-bezier(0.34,1.56,0.64,1)',
                                        '&:hover': {
                                            bgcolor:   '#166534',
                                            transform: 'translateY(-2px) scale(1.03)',
                                            boxShadow: '0 4px 16px rgba(21,128,61,0.35)',
                                            animation: 'none',
                                        },
                                        '&:active': { transform: 'translateY(0px) scale(0.98)' },
                                    }}
                                >
                                    {/* xs: shorten label */}
                                    {isXs ? 'Publish' : 'Publish Course'}
                                </Button>
                            </Fade>
                        )}

                        {/* ── Edit Course ── */}
                        <Button
                            component={Link}
                            href={route('mentor.courses.edit', course.id)}
                            variant="outlined"
                            startIcon={
                                <EditIcon sx={{
                                    transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                                    transform:  editHover
                                        ? 'rotate(-15deg) scale(1.2)'
                                        : 'rotate(0deg) scale(1)',
                                }} />
                            }
                            size="small"
                            onMouseEnter={() => setEditHover(true)}
                            onMouseLeave={() => setEditHover(false)}
                            sx={{
                                textTransform: 'none',
                                borderRadius:   2,
                                fontWeight:     600,
                                boxShadow:     'none',
                                color:         '#317c32',
                                borderColor:   '#317c32',
                                fontSize:      { xs: '0.78rem', sm: '0.875rem' },
                                px:             { xs: 1.5, sm: 2 },
                                transition:    'all 0.28s cubic-bezier(0.34,1.56,0.64,1)',
                                '&:hover': {
                                    transform:   'translateY(-2px) scale(1.03)',
                                    boxShadow:   (t) => `0 4px 16px ${alpha(t.palette.primary.main, 0.22)}`,
                                    bgcolor:     '#317c32',
                                    color:       '#d7d7d7',
                                    borderColor: '#317c32',
                                },
                                '&:active': { transform: 'translateY(0px) scale(0.98)' },
                            }}
                        >
                            Edit Course
                        </Button>
                    </Stack>
                </Box>

                {/* ── Readiness hint (only when draft and incomplete) ──────── */}
                {isDraft && !readiness.all && (
                    <ReadinessHint readiness={readiness} mounted={mounted} />
                )}

                {/* ── All requirements met but not yet published ───────────── */}
                {isDraft && readiness.all && (
                    <Fade in={mounted} style={{ transitionDelay: '250ms' }}>
                        <Alert
                            severity="success"
                            sx={{
                                mb: 3,
                                borderRadius: 2,
                                px: { xs: 1.5, sm: 2 },
                                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                            }}
                        >
                            <strong>All requirements met!</strong> Your course is ready to go live.
                            Click <strong>Publish Course</strong> above whenever you're ready.
                        </Alert>
                    </Fade>
                )}

                {/* ── Two-column grid ─────────────────────────────────────── */}
                <Box sx={{
                    display:             'grid',
                    gridTemplateColumns: { xs: '1fr', lg: 'minmax(320px, 520px) 1fr' },
                    gap:                  { xs: 2, sm: 2.5, md: 3, lg: 4 },
                    alignItems:          'start',
                }}>
                    {/* LEFT: Summary card */}
                    <Box sx={{
                        position:  { lg: 'sticky' },
                        top:       { lg: 80 },
                        animation: mounted
                            ? `${fadeSlideLeft} 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s both`
                            : 'none',
                        transition:'transform 0.35s ease, filter 0.35s ease',
                        '&:hover': {
                            transform: 'translateY(-3px)',
                            filter:    'drop-shadow(0 12px 28px rgba(0,0,0,0.10))',
                        },
                    }}>
                        <MentorOverviewSummaryCard
                            course={course}
                            mentor={mentor}
                            students={students}
                            ratings={ratings}
                        />
                    </Box>

                    {/* RIGHT: Syllabus + certificate */}
                    <Box sx={{
                        minWidth:  0,
                        animation: mounted
                            ? `${fadeSlideRight} 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s both`
                            : 'none',
                    }}>
                        {/* Syllabus header */}
                        <Box sx={{
                            display:        'flex',
                            alignItems:     'center',
                            justifyContent: 'space-between',
                            flexWrap:       'wrap',
                            gap:             1,
                            mb:              2,
                            // xs/sm: tighter padding
                            p:               { xs: 1.5, sm: 2 },
                            borderRadius:    3,
                            bgcolor:        '#fff',
                            border:         '1px solid',
                            borderColor:    (t) => alpha(t.palette.success.main, 0.18),
                            boxShadow:      (t) => `0 2px 12px ${alpha(t.palette.success.main, 0.06)}`,
                            transition:     'box-shadow 0.3s ease, border-color 0.3s ease',
                            animation:      `${pulseGlow} 4s ease-in-out infinite`,
                            '&:hover': {
                                borderColor: 'success.main',
                                boxShadow:   (t) => `0 4px 24px ${alpha(t.palette.success.main, 0.14)}`,
                            },
                        }}>
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{
                                    display:    'flex',
                                    alignItems: 'center',
                                    gap:         1,
                                    // xs: slightly smaller
                                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                                    '& .syllabus-icon': {
                                        color:      'success.main',
                                        transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                                    },
                                    '&:hover .syllabus-icon': { transform: 'scale(1.3) rotate(-8deg)' },
                                }}
                            >
                                <ViewListIcon className="syllabus-icon" />
                                Syllabus
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={{ xs: 0.5, sm: 1 }}
                                alignItems="center"
                                flexWrap="wrap"
                            >
                                <FloatingStatBadge
                                    count={moduleCount}
                                    label={moduleCount === 1 ? 'Module' : 'Modules'}
                                />
                                <Typography
                                    color="text.disabled"
                                    sx={{
                                        alignSelf: 'center',
                                        fontWeight: 700,
                                        // xs: hide the × separator to save space
                                        display: { xs: 'none', sm: 'block' },
                                    }}
                                >
                                    ×
                                </Typography>
                                <Box sx={{ animation: `${floatBadge} 3.4s ease-in-out 0.7s infinite` }}>
                                    <FloatingStatBadge
                                        count={lessonCount}
                                        label={lessonCount === 1 ? 'Lesson' : 'Lessons'}
                                    />
                                </Box>
                            </Stack>
                        </Box>

                        {/* Syllabus accordion */}
                        <Box sx={{
                            animation: mounted
                                ? `${fadeSlideUp} 0.65s cubic-bezier(0.22,1,0.36,1) 0.35s both`
                                : 'none',
                            '& > *':       { transition: 'transform 0.28s ease, box-shadow 0.28s ease' },
                            // xs: disable translateX micro-animation (feels odd on touch)
                            '& > *:hover': { transform: { xs: 'none', sm: 'translateX(3px)' } },
                        }}>
                            <MentorSyllabusAccordion
                                syllabuses={course.syllabuses}
                                courseId={course.id}
                            />
                        </Box>

                        {/* Certificate section */}
                        <CertificateSection
                            certificate={certificate}
                            course={course}
                            mentorName={mentorName}
                            mounted={mounted}
                        />
                    </Box>
                </Box>
            </Box>

            {/* ── Publish confirmation modal ───────────────────────────── */}
            <PublishConfirmModal
                open={publishModalOpen}
                onClose={() => setPublishModalOpen(false)}
                onConfirm={handlePublishConfirm}
                processing={publishing}
                courseTitle={course.title}
            />
        </>
    );
}

Show.layout = (page) => (
    <MentorLayout auth={page.props.auth} activeTab="Courses">
        {page}
    </MentorLayout>
);
