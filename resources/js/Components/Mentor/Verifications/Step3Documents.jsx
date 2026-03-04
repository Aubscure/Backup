import React, { useState } from 'react';
import { Box, Grid, Link, keyframes } from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

import MentorStepTitle from './Documents/MentorStepTitle';
import MentorFileUpload from './Documents/MentorFileUpload';
import MentorCheckbox from './Documents/MentorCheckbox';

// ── Keyframes ─────────────────────────────────────────────────────────────────

const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const fadeSlideLeft = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const fadeSlideRight = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const cardEntrance = keyframes`
  from { opacity: 0; transform: translateY(16px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const borderPulse = keyframes`
  0%, 100% { border-color: rgba(24,118,4,0.3); }
  50%       { border-color: rgba(24,118,4,0.8); }
`;

const shimmerSweep = keyframes`
  0%   { background-position: -300% center; }
  100% { background-position: 300% center; }
`;

// ── Mobile-only keyframes ─────────────────────────────────────────────────────
// Injected once via <style>; the @keyframe rules are tiny and only referenced
// by xs/sm-targeted animations so they have zero cost on desktop.
const MOBILE_STYLES = `
  @keyframes xs-card-rise {
    from { opacity: 0; transform: translateY(12px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes xs-ack-slide {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// ── Animated Upload Card Wrapper ──────────────────────────────────────────────
// Desktop: original hover lift + borderPulse.
// xs/sm:   same hover lift, but tap (active) gives an immediate scale-down
//          for tactile feedback since hover doesn't exist on touch devices.
function AnimatedUploadCard({ children, delay = 0, direction = 'up' }) {
    const [hovered, setHovered] = useState(false);
    const animation =
        direction === 'left' ? fadeSlideLeft
        : direction === 'right' ? fadeSlideRight
        : cardEntrance;

    return (
        <Box
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{
                // ── entrance animation ──────────────────────────────────────
                // xs/sm: use the lighter xs-card-rise keyframe
                // md+:   original per-direction animation
                animation: {
                    xs: `xs-card-rise 0.45s cubic-bezier(0.22,1,0.36,1) ${delay}ms both`,
                    md: `${animation} 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms both`,
                },

                transition: 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease',
                transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
                boxShadow: hovered
                    ? '0 8px 28px rgba(24,118,4,0.14), 0 2px 8px rgba(0,0,0,0.06)'
                    : '0 1px 4px rgba(0,0,0,0.04)',
                borderRadius: '14px',
                position: 'relative',

                // Touch press feedback — gives the "clicked" feel on mobile
                // where hover states don't fire.
                '&:active': {
                    transform: { xs: 'scale(0.985)', md: 'translateY(-3px)' },
                },

                ...(hovered && {
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '14px',
                        border: '1.5px solid rgba(24,118,4,0.2)',
                        pointerEvents: 'none',
                        animation: `${borderPulse} 2s ease-in-out infinite`,
                    },
                }),
            }}
        >
            {children}
        </Box>
    );
}

// ── Animated Acknowledgement Wrapper ─────────────────────────────────────────
function AnimatedAcknowledgement({ children, delay = 0 }) {
    const [focused, setFocused] = useState(false);

    return (
        <Box
            onMouseEnter={() => setFocused(true)}
            onMouseLeave={() => setFocused(false)}
            sx={{
                animation: {
                    xs: `xs-ack-slide 0.45s cubic-bezier(0.22,1,0.36,1) ${delay}ms both`,
                    md: `${fadeSlideUp} 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms both`,
                },
                p: 2.5,
                borderRadius: '14px',
                border: '1.5px solid',
                borderColor: focused ? 'rgba(24,118,4,0.35)' : 'rgba(0,0,0,0.08)',
                background: focused
                    ? 'linear-gradient(135deg, rgba(24,118,4,0.04) 0%, rgba(24,118,4,0.01) 100%)'
                    : 'transparent',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                // Touch press feedback
                '&:active': { transform: { xs: 'scale(0.99)', md: 'none' } },
                ...(focused && {
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background:
                            'linear-gradient(90deg, transparent 0%, rgba(24,118,4,0.05) 50%, transparent 100%)',
                        backgroundSize: '300% auto',
                        animation: `${shimmerSweep} 2.5s linear infinite`,
                        pointerEvents: 'none',
                    },
                }),
            }}
        >
            {children}
        </Box>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Step3Documents({ form }) {
    const { data, setData, errors } = form;

    return (
        <Box>
            <style>{MOBILE_STYLES}</style>

            {/* Step Title */}
            <Box sx={{ animation: `${fadeSlideUp} 0.55s cubic-bezier(0.22,1,0.36,1) both` }}>
                <MentorStepTitle
                    title="Verification & Acknowledgment"
                    description="Please provide the required documents to verify your expertise level."
                    icon={VerifiedUserIcon}
                />
            </Box>

            {/* Valid ID — full width */}
            <AnimatedUploadCard delay={120}>
                <Box mb={3}>
                    <MentorFileUpload
                        label="Valid Government ID"
                        name="government_id"
                        file={data.government_id}
                        setFile={setData}
                        error={errors.government_id}
                        icon={BadgeIcon}
                        required
                        description="Upload a clear scan of your ID (e.g., Passport, Driver's License)"
                    />
                </Box>
            </AnimatedUploadCard>

            {/* Degree + Profession
                Desktop: side-by-side with specific widths.
                xs/sm:   stacked full-width, tighter spacing.
            */}
            <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                mb={{ xs: 3, md: 4 }}
                mt={0}
            >
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                        width: { xs: '100%',sm: '100%', md: 234 },
                    }}
                >
                    <AnimatedUploadCard delay={220} direction="left">
                        <MentorFileUpload
                            label="Highest Degree"
                            name="degree_certificate"
                            file={data.degree_certificate}
                            setFile={setData}
                            error={errors.degree_certificate}
                            icon={SchoolIcon}
                            description="Diploma or Certificate"
                        />
                    </AnimatedUploadCard>
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                        width: { xs: '100%',sm: '100%', md: 234 },
                    }}
                >
                    <AnimatedUploadCard delay={300} direction="right">
                        <MentorFileUpload
                            label="Proof of Profession"
                            name="proof_of_profession"
                            file={data.proof_of_profession}
                            setFile={setData}
                            error={errors.proof_of_profession}
                            icon={WorkIcon}
                            description="PRC ID or similar professional license"
                        />
                    </AnimatedUploadCard>
                </Grid>
            </Grid>

            {/* Acknowledgement */}
            <AnimatedAcknowledgement delay={400}>
                <MentorCheckbox
                    name="acknowledgement"
                    checked={data.acknowledgement}
                    onChange={(e) => setData('acknowledgement', e.target.checked)}
                    error={errors.acknowledgement}
                    label={
                        <span>
                            <strong>I Acknowledge</strong> <br />
                            I hereby certify that the information provided is true and correct. I also agree to the
                            <Link
                                href="#"
                                color="success.main"
                                underline="hover"
                                fontWeight="bold"
                                sx={{
                                    ml: 0.5,
                                    position: 'relative',
                                    display: 'inline-block',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        color: '#2ea80a',
                                        textShadow: '0 0 12px rgba(24,118,4,0.35)',
                                    },
                                }}
                            >
                                Terms and Conditions
                            </Link>{' '}
                            and Data Privacy Policy.
                        </span>
                    }
                />
            </AnimatedAcknowledgement>
        </Box>
    );
}
