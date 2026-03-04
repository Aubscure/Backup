
import React from 'react';
import { Box, Typography, keyframes } from '@mui/material';

// ── Mobile-only keyframe ──────────────────────────────────────────────────────
// Injected via <style> — zero cost on desktop (rule only referenced by the
// xs-targeted animation property; the CSS engine skips unused @keyframes).
const MOBILE_STYLES = `
  @keyframes xs-title-enter {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// Decorative animated underline used on both viewports.
// Desktop: 48 px wide (accent dot).
// xs/sm:   full-width bar — more dramatic on the larger proportional space
//          and doubles as a clear visual separator before the upload cards.
const drawLine = keyframes`
  from { transform: scaleX(0); opacity: 0; }
  to   { transform: scaleX(1); opacity: 1; }
`;

// Matches the badge entrance used in Step1 and Step2 headers.
const badgePop = keyframes`
  0%   { transform: scale(0.8) rotate(-8deg); opacity: 0; }
  60%  { transform: scale(1.1) rotate(3deg);  opacity: 1; }
  100% { transform: scale(1)   rotate(0deg);  opacity: 1; }
`;

export default function MentorStepTitle({ title, description, icon: Icon }) {
    return (
        <Box
            mb={{ xs: 3, md: 4 }}
            // Desktop: no entrance animation (parent wraps in a Fade already).
            // xs/sm:   lightweight fade-up so the title feels alive on tap.
            sx={{
                animation: {
                    xs: 'xs-title-enter 0.4s cubic-bezier(0.22,1,0.36,1) both',
                    md: 'none',
                },
            }}
        >
            <style>{MOBILE_STYLES}</style>

            {/* ── Title row (icon + text) ─────────────────────────────────────
                When an icon is supplied the title sits in a flex row — exactly
                the same pattern used by Step1PersonalDetails and Step2Credentials.
                When no icon is supplied the layout is unchanged (plain Typography).
            */}
            <Box display="flex" alignItems="center" gap={1.5} mb={0.5}>
                {Icon && (
                    <Box
                        sx={{
                            width: { xs: 38, md: 42 },
                            height: { xs: 38, md: 42 },
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #187604 0%, #2ea80a 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 6px 18px rgba(24,118,4,0.32)',
                            animation: `${badgePop} 0.6s cubic-bezier(0.34,1.56,0.64,1) 100ms both`,
                            flexShrink: 0,
                        }}
                    >
                        <Icon sx={{ color: '#fff', fontSize: { xs: 20, md: 22 } }} />
                    </Box>
                )}

                <Typography
                    variant="h5"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                        // Desktop: variant h5 = ~1.5 rem — original.
                        // xs/sm:   slightly smaller so long titles don't wrap awkwardly
                        //          on 360 px devices.
                        fontSize: { xs: '1.15rem', md: '1.5rem' },
                        lineHeight: { xs: 1.3, md: 1.4 },
                        letterSpacing: { xs: '-0.01em', md: 'inherit' },
                        mb: 0, // gutterBottom handled by parent Box mb
                    }}
                >
                    {title}
                </Typography>
            </Box>

            {/* ── Description ────────────────────────────────────────────────── */}
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    fontSize: { xs: '0.8rem', md: '0.875rem' },
                    lineHeight: { xs: 1.5, md: 1.6 },
                    // Tighten the gap between description and first card on mobile.
                    mb: { xs: 0.5, md: 0 },
                }}
            >
                {description}
            </Typography>

            {/*
                ── Accent bar ────────────────────────────────────────────────────
                Desktop: hidden — the h5 heading is visually strong enough.
                xs/sm:   full-width green bar animates in after the text, acting
                         as a separator + progress cue. Matches the Step1 divider
                         style already in use elsewhere in the modal.
            */}
            <Box
                sx={{
                    display: { xs: 'block', md: 'none' },
                    mt: 1.5,
                    height: '2px',
                    borderRadius: '4px',
                    background:
                        'linear-gradient(90deg, #187604 0%, rgba(24,118,4,0.25) 65%, transparent 100%)',
                    transformOrigin: 'left center',
                    animation: 'xs-title-enter 0.6s cubic-bezier(0.22,1,0.36,1) 120ms both',
                    // Re-use the drawLine keyframe defined above for the scale effect.
                    // We layer two animations: fade-up from xs-title-enter (opacity + Y)
                    // + scaleX from drawLine. Separating them avoids conflict.
                    '&::after': {
                        content: '""',
                        display: 'block',
                        height: '100%',
                        borderRadius: '4px',
                        background: 'inherit',
                        transformOrigin: 'left center',
                        animation: `${drawLine} 0.65s cubic-bezier(0.22,1,0.36,1) 140ms both`,
                    },
                }}
            />
        </Box>
    );
}
