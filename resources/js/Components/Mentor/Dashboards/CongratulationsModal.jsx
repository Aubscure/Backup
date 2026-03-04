import React, { useEffect, useState, useRef } from 'react';
import {
    Box, Dialog, DialogContent, Typography, Button, keyframes, alpha,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link } from '@inertiajs/react';

// ─── Animations ───────────────────────────────────────────────────────────────

const popIn = keyframes`
  0%   { opacity: 0; transform: scale(0.4) translateY(40px); }
  65%  { transform: scale(1.08) translateY(-8px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
`;

const floatUp = keyframes`
  0%   { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0) rotate(-10deg); }
  50%       { transform: translateY(-18px) rotate(10deg); }
`;

const confettiFall = keyframes`
  0%   { opacity: 1; transform: translateY(-10px) rotateZ(0deg); }
  100% { opacity: 0; transform: translateY(340px) rotateZ(720deg); }
`;

const shimmer = keyframes`
  0%   { background-position: -400% center; }
  100% { background-position:  400% center; }
`;

const ringPulse = keyframes`
  0%   { transform: scale(1);   opacity: 0.7; }
  100% { transform: scale(2.2); opacity: 0; }
`;

// ─── Confetti piece ───────────────────────────────────────────────────────────

const CONFETTI_COLORS = [
    '#f5c518', '#e53935', '#43a047', '#1e88e5', '#fb8c00',
    '#8e24aa', '#00acc1', '#c0ca33', '#ff4081', '#64dd17',
];

const SHAPES = ['circle', 'square', 'triangle'];

function ConfettiPiece({ index }) {
    const color  = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
    const shape  = SHAPES[index % SHAPES.length];
    const size   = 8 + (index % 5) * 2;
    const left   = `${(index * 7.3 + 3) % 96}%`;
    const delay  = `${(index * 0.11) % 2.2}s`;
    const dur    = `${2.2 + (index % 6) * 0.3}s`;

    const shapeStyle =
        shape === 'circle'   ? { borderRadius: '50%' }
        : shape === 'triangle'
            ? {
                width: 0, height: 0,
                bgcolor: 'transparent !important',
                borderLeft:  `${size / 2}px solid transparent`,
                borderRight: `${size / 2}px solid transparent`,
                borderBottom: `${size}px solid ${color}`,
            }
            : { borderRadius: 2 };

    return (
        <Box sx={{
            position: 'absolute',
            top: -10,
            left,
            width:  shape === 'triangle' ? 0      : size,
            height: shape === 'triangle' ? 0      : size,
            bgcolor: shape === 'triangle' ? 'transparent' : color,
            animation: `${confettiFall} ${dur} ease-in ${delay} both`,
            pointerEvents: 'none',
            zIndex: 10,
            ...shapeStyle,
        }} />
    );
}

// ─── Completed step row ────────────────────────────────────────────────────────

function Step({ label, delay }) {
    return (
        <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1.5,
            animation: `${floatUp} 0.45s ease-out ${delay} both`,
        }}>
            <CheckCircleIcon sx={{ color: '#3c862d', fontSize: 22 }} />
            <Typography variant="body2" fontWeight={500} color="text.secondary">
                {label}
            </Typography>
        </Box>
    );
}

// ─── Main modal ────────────────────────────────────────────────────────────────

export default function CongratulationsModal({ open, onClose }) {
    const CONFETTI_COUNT = 48;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    overflow: 'visible',
                    boxShadow: '0 32px 80px -10px rgba(0,0,0,0.3)',
                },
            }}
            BackdropProps={{
                sx: { backdropFilter: 'blur(6px)', bgcolor: 'rgba(0,0,0,0.45)' },
            }}
        >
            <DialogContent sx={{ p: 0, overflow: 'hidden', position: 'relative', borderRadius: 4 }}>

                {/* ── Confetti rain ── */}
                <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 10 }}>
                    {Array.from({ length: CONFETTI_COUNT }).map((_, i) => (
                        <ConfettiPiece key={i} index={i} />
                    ))}
                </Box>

                {/* ── Green header ── */}
                <Box sx={{
                    background: 'linear-gradient(135deg, #c4de27 0%, #8bba22 30%, #59991e 65%, #3c862d 100%)',
                    pt: 5, pb: 4,
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    position: 'relative', overflow: 'hidden',
                    '&::before': {
                        content: '""', position: 'absolute',
                        top: -60, right: -60, width: 220, height: 220,
                        borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.07)',
                    },
                    '&::after': {
                        content: '""', position: 'absolute',
                        bottom: -80, left: '30%', width: 280, height: 280,
                        borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)',
                    },
                }}>
                    {/* Pulse ring behind trophy */}
                    <Box sx={{ position: 'relative', mb: 2 }}>
                        {[1, 2].map((i) => (
                            <Box key={i} sx={{
                                position: 'absolute',
                                inset: -12 * i,
                                borderRadius: '50%',
                                border: '2px solid rgba(255,255,255,0.35)',
                                animation: `${ringPulse} 2s ease-out ${i * 0.4}s infinite`,
                            }} />
                        ))}
                        <Box sx={{
                            width: 76, height: 76, borderRadius: '50%',
                            bgcolor: 'rgba(255,255,255,0.2)',
                            border: '2px solid rgba(255,255,255,0.4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            animation: `${bounce} 3s ease-in-out infinite`,
                            position: 'relative', zIndex: 1,
                        }}>
                            <EmojiEventsIcon sx={{ fontSize: 40, color: '#fff9c4' }} />
                        </Box>
                    </Box>

                    <Typography
                        variant="h5"
                        fontWeight={800}
                        sx={{
                            color: 'white',
                            letterSpacing: '-0.5px',
                            animation: `${popIn} 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.1s both`,
                            textAlign: 'center',
                        }}
                    >
                        Congratulations! 🎉
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'rgba(255,255,255,0.88)',
                            mt: 0.5,
                            animation: `${floatUp} 0.5s ease-out 0.3s both`,
                            textAlign: 'center',
                            px: 2,
                        }}
                    >
                        You've completed your mentor onboarding!
                    </Typography>
                </Box>

                {/* ── Body ── */}
                <Box sx={{ px: 3.5, pt: 3, pb: 3.5 }}>
                    <Typography
                        variant="body1"
                        fontWeight={600}
                        color="text.primary"
                        sx={{ mb: 2.5, animation: `${floatUp} 0.45s ease-out 0.35s both` }}
                    >
                        You've completed all 4 steps:
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, mb: 3.5 }}>
                        <Step label="Account created"                     delay="0.4s"  />
                        <Step label="Identity & expertise verified"       delay="0.5s"  />
                        <Step label="First course created"                delay="0.6s"  />
                        <Step label="Course published — you're live! 🚀"  delay="0.7s"  />
                    </Box>

                    <Box sx={{ animation: `${floatUp} 0.45s ease-out 0.8s both` }}>
                        <Button
                            onClick={onClose}
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{
                                background: 'linear-gradient(135deg, #8bba22 0%, #3c862d 100%)',
                                color: 'white',
                                fontWeight: 700,
                                textTransform: 'none',
                                fontSize: '1rem',
                                borderRadius: 2.5,
                                py: 1.5,
                                boxShadow: '0 8px 20px rgba(60,134,45,0.35)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #9fcc28 0%, #4a9e38 100%)',
                                    boxShadow: '0 12px 28px rgba(60,134,45,0.45)',
                                    transform: 'translateY(-2px)',
                                },
                            }}
                        >
                            Let's Go to My Dashboard! 🎓
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}