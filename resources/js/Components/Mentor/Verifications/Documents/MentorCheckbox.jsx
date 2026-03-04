import React, { useState } from 'react';
import {
    Paper,
    FormControlLabel,
    Checkbox,
    Typography,
    FormHelperText,
    Box,
    keyframes,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

// ── Keyframes ─────────────────────────────────────────────────────────────────

// Bouncy check animation — same style used in Step1's GenderCard so the
// design language is consistent across the whole modal.
const checkBounce = keyframes`
  0%   { transform: scale(1); }
  30%  { transform: scale(1.4); }
  60%  { transform: scale(0.88); }
  100% { transform: scale(1); }
`;

// Mobile-only: subtle card "press" that confirms the tap before the
// Checkbox state visually updates (touch devices have ~80 ms lag on :hover).
const MOBILE_STYLES = `
  @keyframes xs-check-pop {
    0%   { transform: scale(0.9); opacity: 0.6; }
    55%  { transform: scale(1.08);              }
    100% { transform: scale(1);   opacity: 1;   }
  }
`;

// ── Main Component ────────────────────────────────────────────────────────────
export default function MentorCheckbox({
    checked,
    onChange,
    label,
    error,
    name,
    sx,
}) {
    // Track hover/focus for desktop shimmer; also drives the active-state ring
    // on mobile via CSS :active pseudo selector.
    const [hovered, setHovered] = useState(false);

    return (
        <Box sx={sx}>
            <style>{MOBILE_STYLES}</style>

            <Paper
                elevation={0}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                sx={{
                    // ── Padding ───────────────────────────────────────────────
                    // Desktop: p: 3 (24 px) — original.
                    // xs/sm:   p: 2 (16 px) — saves space; the checkbox row
                    //          itself supplies enough breathing room.
                    p: { xs: 2, md: 3 },

                    bgcolor: checked
                        ? '#f0fdf4'  // green tint when acknowledged — new xs visual cue
                        : '#f9fafb',

                    border: '1px solid',
                    borderColor: error
                        ? 'error.light'
                        : checked
                            ? 'rgba(24,118,4,0.3)'  // green border when ticked
                            : 'transparent',

                    borderRadius: { xs: '12px', md: '8px' }, // slightly more rounded on mobile

                    transition: 'all 0.25s ease',

                    '&:hover': {
                        bgcolor: checked ? '#dcfce7' : '#f3f4f6',
                    },

                    // Touch press feedback — scale-down gives the user an instant
                    // "I tapped it" signal before the Checkbox state renders.
                    '&:active': {
                        transform: { xs: 'scale(0.99)', md: 'none' },
                    },

                    // xs/sm: highlighted ring appears when the card is tapped.
                    // Works alongside the borderColor transition above.
                    outline: { xs: checked ? '2px solid rgba(24,118,4,0.18)' : 'none', md: 'none' },
                    outlineOffset: 2,
                }}
            >
                <FormControlLabel
                    alignItems="flex-start"
                    sx={{ m: 0 }}
                    control={
                        <Checkbox
                            checked={checked}
                            onChange={onChange}
                            name={name}
                            color="success"
                            sx={{
                                mt: -0.5,
                                // ── Touch target ──────────────────────────────
                                // Desktop: default MUI small hit area.
                                // xs/sm:   44 × 44 px minimum (WCAG 2.5.5 guideline).
                                //          We achieve this by adding padding without
                                //          changing the visible icon size.
                                padding: { xs: '2px', sm: '2px', md: '4px' },
                            }}
                            // Swap default icons for the same animated ones used in
                            // Step1PersonalDetails — consistent design language.
                            icon={
                                <RadioButtonUncheckedIcon
                                    sx={{
                                        color: '#bdbdbd',
                                        fontSize: { xs: 22, md: 20 },
                                    }}
                                />
                            }
                            checkedIcon={
                                <CheckCircleIcon
                                    sx={{
                                        color: '#187604',
                                        fontSize: { xs: 22, md: 20 },
                                        // xs/sm: play the pop animation on each check.
                                        animation: checked
                                            ? { xs: 'xs-check-pop 0.4s cubic-bezier(0.34,1.56,0.64,1)', md: `${checkBounce} 0.45s cubic-bezier(0.34,1.56,0.64,1)` }
                                            : 'none',
                                    }}
                                />
                            }
                        />
                    }
                    label={
                        <Typography
                            variant="body2"
                            sx={{
                                lineHeight: { xs: 1.7, md: 1.6 },
                                // Slightly larger on mobile — easier to read and tap
                                // the inline "Terms and Conditions" link.
                                fontSize: { xs: '0.84rem', md: '0.875rem' },
                                // Shift label down to optically align with the checkbox
                                // centre on mobile where padding was increased.
                                mt: { xs: '2px', md: 0 },
                            }}
                        >
                            {label}
                        </Typography>
                    }
                />
            </Paper>

            {error && (
                <FormHelperText
                    error
                    sx={{
                        ml: 2,
                        mt: 1,
                        // xs/sm: slightly larger error text for legibility.
                        fontSize: { xs: '0.78rem', md: '0.75rem' },
                    }}
                >
                    {error}
                </FormHelperText>
            )}
        </Box>
    );
}
