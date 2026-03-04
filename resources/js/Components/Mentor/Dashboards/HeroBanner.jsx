import React from 'react';
import {
    Box, Paper, Typography, Button,
    Grid, Chip, keyframes, Stack,
} from '@mui/material';
import VerifiedUserIcon     from '@mui/icons-material/VerifiedUser';
import HourglassEmptyIcon   from '@mui/icons-material/HourglassEmpty';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SchoolIcon           from '@mui/icons-material/School';
import EmojiEventsIcon      from '@mui/icons-material/EmojiEvents';
import AutoAwesomeIcon      from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon       from '@mui/icons-material/TrendingUp';
import PeopleAltIcon        from '@mui/icons-material/PeopleAlt';
import { Link } from '@inertiajs/react';

// ─── Animations ───────────────────────────────────────────────────────────────

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%   { box-shadow: 0 0 0 0   rgba(255,255,255,0.45); }
  70%  { box-shadow: 0 0 0 12px rgba(255,255,255,0); }
  100% { box-shadow: 0 0 0 0   rgba(255,255,255,0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const shimmer = keyframes`
  0%   { background-position: -400% center; }
  100% { background-position:  400% center; }
`;

const fadeSlideIn = keyframes`
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
`;

// ─── Shared base ──────────────────────────────────────────────────────────────

const basePaperSx = {
    mb: 4,
    borderRadius: 3,
    overflow: 'hidden',
    position: 'relative',
    background: 'linear-gradient(135deg, #c4de27 0%, #8bba22 30%, #59991e 65%, #3c862d 100%)',
    color: 'white',
    transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 24px 48px -10px rgba(60,134,45,0.55)',
    },
    // Decorative background bubbles
    '&::before': {
        content: '""',
        position: 'absolute',
        top: -60, right: -60,
        width: 240, height: 240,
        borderRadius: '50%',
        bgcolor: 'rgba(255,255,255,0.06)',
        pointerEvents: 'none',
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -80, left: '40%',
        width: 300, height: 300,
        borderRadius: '50%',
        bgcolor: 'rgba(255,255,255,0.04)',
        pointerEvents: 'none',
    },
};

// ─── Tiny stat pill used in the "has courses" banner ─────────────────────────

function StatPill({ icon, label }) {
    return (
        <Box sx={{
            display: 'flex', alignItems: 'center', gap: 0.75,
            bgcolor: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 5, px: 1.75, py: 0.6,
            backdropFilter: 'blur(6px)',
        }}>
            {icon}
            <Typography variant="caption" fontWeight={700} sx={{ color: 'white', fontSize: '11px' }}>
                {label}
            </Typography>
        </Box>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATE 1 — Unverified, no submission yet
// Goal: urgency + excitement to verify
// ─────────────────────────────────────────────────────────────────────────────

function UnverifiedBanner({ onVerifyClick }) {
    return (
        <Paper sx={{ ...basePaperSx, p: { xs: 2, md: 3 }, px: { xs: 3, md: 5 }, minHeight: 230, alignContent: 'center' }}>
            <Grid container alignItems="center" spacing={3} sx={{ position: 'relative', zIndex: 1, flexgrow: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                <Grid item xs={12} md={8} sx={{  }}>
                    <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
                        <Box sx={{
                            bgcolor: 'rgba(255,255,255,0.2)', p: 1.5, borderRadius: '50%',
                            animation: `${pulse} 2s infinite`,
                            display: 'flex',
                        }}>
                            <VerifiedUserIcon sx={{ fontSize: 36, color: 'white' }} />
                        </Box>
                        <Chip
                            label="ACTION REQUIRED"
                            size="small"
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.2)', color: 'white',
                                fontWeight: 700, fontSize: '10px',
                                border: '1px solid rgba(255,255,255,0.5)',
                                letterSpacing: '0.08em',
                            }}
                        />
                    </Stack>

                    <Typography
                        variant="h4" fontWeight={700}
                        sx={{
                            fontSize: { xs: '1.5rem', md: '2rem' },
                            letterSpacing: '-0.5px', mb: 1,
                            animation: `${fadeSlideIn} 0.5s ease-out both`,
                        }}
                    >
                        Unlock Your Teaching Potential
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.92, mb: 3, maxWidth: 520, lineHeight: 1.65 }}>
                        Thousands of learners are waiting for an expert like you. Complete your verification
                        in minutes and start publishing courses that <strong>change lives and earn income.</strong>
                    </Typography>

                    {/* Mini benefit chips */}
                    <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: { xs: 3, md: 0 } }}>
                        {[
                            '🎓 Publish unlimited courses',
                            '💰 Earn on every enrollment',
                            '📜 Issue certificates',
                        ].map((t) => (
                            <Chip
                                key={t} label={t} size="small"
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.15)',
                                    color: 'white', fontWeight: 600, fontSize: '11px',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                }}
                            />
                        ))}
                    </Stack>
                </Grid>

                <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                    <Button
                        onClick={onVerifyClick}
                        variant="contained"
                        size="large"
                        startIcon={<AutoAwesomeIcon />}
                        sx={{
                            bgcolor: 'white', color: '#3c862d',
                            fontWeight: 700, textTransform: 'none',
                            fontSize: '1rem', px: 4, py: 1.5, borderRadius: 2,
                            width: { xs: '100%', md: 'auto' },
                            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                            '&:hover': {
                                bgcolor: '#f9fff7',
                                transform: 'scale(1.04)',
                                boxShadow: '0 12px 28px rgba(0,0,0,0.2)',
                            },
                        }}
                    >
                        Get Verified Now
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATE 2 — Verification submitted, waiting for approval
// Goal: keep the mentor engaged while they wait
// ─────────────────────────────────────────────────────────────────────────────

function PendingBanner() {
    return (
        <Paper sx={{ ...basePaperSx, p: { xs: 2, md: 3 }, px: { xs: 3, md: 5 }, minHeight: 220, alignContent: 'center' }}>
            <Grid container alignItems="center" spacing={3} sx={{ position: 'relative', zIndex: 1, flexgrow: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                <Grid item xs={12} md={8}>
                    <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 2 }}>
                        <Chip
                            label="UNDER REVIEW"
                            size="small"
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.2)', color: 'white',
                                fontWeight: 700, fontSize: '10px',
                                border: '1px solid rgba(255,255,255,0.5)',
                                letterSpacing: '0.08em',
                            }}
                        />
                    </Stack>

                    <Typography
                        variant="h4" fontWeight={700}
                        sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, letterSpacing: '-0.5px', mb: 1 }}
                    >
                        You Are Almost There! Hang Tight!
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.92, maxWidth: 520, lineHeight: 1.65 }}>
                        Our team is reviewing your documents. Most verifications complete within{' '}
                        <strong>24 – 48 hours.</strong> Use this time to plan your first course content!
                    </Typography>
                </Grid>

                <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                    <Button
                        variant="outlined"
                        size="large"
                        startIcon={<HourglassEmptyIcon sx={{ animation: `${spin} 3s linear infinite` }} />}
                        sx={{
                            borderColor: 'rgba(255,255,255,0.5)', color: 'white',
                            textTransform: 'none', fontWeight: 700,
                            bgcolor: 'rgba(255,255,255,0.12)', px: 3, py: 1.5, borderRadius: 2,
                            width: { xs: '100%', md: 'auto' },
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.22)', borderColor: 'white' },
                        }}
                    >
                        Verification in Progress
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATE 3 — Verified, no courses yet
// Goal: maximum motivation to create the first course
// ─────────────────────────────────────────────────────────────────────────────

function VerifiedNoCoursesBanner() {
    return (
        <Paper sx={{ ...basePaperSx, p: { xs: 2, md: 3 }, px: { xs: 3, md: 5 }, minHeight: 230, alignContent: 'center' }}>
            <Grid container alignItems="center" spacing={3} sx={{ position: 'relative', zIndex: 1, px: { xs: 0, md: 2 } }}>
                <Grid item xs={12} md={8} sx={{flexGrow: 1, justifyContent: 'space-between', alignItems: 'center',  }}>
                    <Chip
                        label="✦ EXPERT STATUS UNLOCKED ✦"
                        size="small"
                        sx={{
                            mb: 2,
                            bgcolor: 'rgba(255,255,255,0.2)', color: 'white',
                            fontWeight: 600, fontSize: '10px',
                            border: '1px solid rgba(255,255,255,0.5)',
                            letterSpacing: '0.08em',
                        }}
                    />

                    <Typography
                        variant="h4" fontWeight={600}
                        sx={{
                            fontSize: { xs: '1.3rem', md: '1.8rem' },
                            letterSpacing: '-0.5px', mb: 1.5,
                            // Shimmer text effect on the highlight word
                        }}
                    >
                        Your Expertise Deserves an Audience.{' '}
                        <Box
                            component="span"
                            sx={{
                                background: 'linear-gradient(90deg, #fff 0%, #d4f7a0 40%, #fff 80%)',
                                backgroundSize: '300% auto',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                animation: `${shimmer} 4s linear infinite`,
                            }}
                        >
                            Start Mentoring Today.
                        </Box>
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.92, mb: 3, maxWidth: 540, lineHeight: 1.7 }}>
                        You're verified and ready. Create your first course and join thousands of mentors
                        who are building income and impact, one lesson at a time.
                    </Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                        <Button
                            component={Link}
                            href={route('mentor.courses.create')}
                            variant="contained"
                            size="large"
                            startIcon={<AddCircleOutlineIcon />}
                            sx={{
                                bgcolor: 'white', color: '#3c862d',
                                fontWeight: 600, textTransform: 'none',
                                fontSize: '.85rem', px: 4, py: 1.5, borderRadius: 2,
                                boxShadow: '0 10px 24px rgba(0,0,0,0.15)',
                                '&:hover': {
                                    bgcolor: '#f9fff7',
                                    transform: 'translateY(-2px) scale(1.02)',
                                    boxShadow: '0 16px 32px rgba(0,0,0,0.2)',
                                },
                            }}
                        >
                            Create Your First Course
                        </Button>
                    </Stack>
                </Grid>

                {/* Floating icon — desktop only */}
                <Grid item md={4} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
                    <Box sx={{
                        width: 180, height: 180, borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid rgba(255,255,255,0.15)',
                        animation: `${float} 6s ease-in-out infinite`,
                        position: 'relative',
                    }}>
                        <SchoolIcon sx={{ fontSize: 80, color: 'white', opacity: 0.9 }} />
                        <Paper elevation={6} sx={{
                            position: 'absolute', bottom: 14, right: -14,
                            px: 1.5, py: 0.6, borderRadius: 3,
                            display: 'flex', alignItems: 'center', gap: 0.75,
                            bgcolor: 'white', color: '#3c862d',
                        }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4caf50', boxShadow: '0 0 5px #4caf50' }} />
                            <Typography variant="caption" fontWeight={700}>Verified</Typography>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATE 4 — Has courses already (shown inside DashboardOverview)
// Goal: keep momentum — motivate to grow and add more courses
// ─────────────────────────────────────────────────────────────────────────────

export function ActiveMentorBanner({ courseCount = 1 }) {
    const isEarlyStage = courseCount <= 3;

    return (
        <Paper sx={{ ...basePaperSx, p: { xs: 2, md: 3 }, px: { xs: 3, md: 5 }, minHeight: 230, alignContent: 'center' }}>
            <Grid container alignItems="center" spacing={2} sx={{ position: 'relative', zIndex: 1, flexgrow: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                <Grid item xs={12} md={7}>
                    <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 1 }}>
                        <EmojiEventsIcon sx={{ fontSize: 26, color: 'rgba(255,255,255,0.9)' }} />
                        <Typography variant="overline" fontWeight={600} sx={{ color: 'rgba(255,255,255,0.85)', letterSpacing: '0.1em', fontSize: '14px' }}>
                            {isEarlyStage ? 'Great Start!' : 'Momentum Building!'}
                        </Typography>
                    </Stack>

                    <Typography
                        variant="h1" fontWeight={600}
                        sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, letterSpacing: '-0.3px', mb: 0.75 }}
                    >
                        {isEarlyStage
                            ? `You've published ${courseCount} course${courseCount > 1 ? 's' : ''}. Keep the momentum going!`
                            : `${courseCount} courses live — your students need more from you!`
                        }
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 2, maxWidth: 480, lineHeight: 1.6 }}>
                        {isEarlyStage
                            ? 'Add another topic and grow your reach.'
                            : 'Your catalogue is growing. Keep publishing to stay on top of the leaderboard.'
                        }
                    </Typography>

                    {/* Stat pills */}
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                        <StatPill icon={<TrendingUpIcon sx={{ fontSize: 16, color: 'white' }} />} label="Earnings grow with each course" />
                        <StatPill icon={<PeopleAltIcon sx={{ fontSize: 16, color: 'white' }} />}   label="Wider audience every publish" />
                    </Stack>
                </Grid>

                <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1.5, flexWrap: 'wrap' }}>
                </Grid>
            </Grid>
        </Paper>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Default export — handles states 1, 2, 3 (pre-course flow)
// State 4 (ActiveMentorBanner) is exported separately and used in DashboardOverview
// ─────────────────────────────────────────────────────────────────────────────

export default function HeroBanner({ isVerified, verificationSubmitted, onVerifyClick }) {
    if (!isVerified && !verificationSubmitted) return <UnverifiedBanner onVerifyClick={onVerifyClick} />;
    if (verificationSubmitted && !isVerified)  return <PendingBanner />;
    if (isVerified)                             return <VerifiedNoCoursesBanner />;
    return null;
}
