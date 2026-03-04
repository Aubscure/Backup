/**
 * ContentRemovalWarningModal
 *
 * A reusable, immersive confirmation modal for any destructive "remove content"
 * action within the course builder (materials, videos, lessons, modules, etc.)
 *
 * Props:
 *   open        {boolean}   – controls visibility
 *   onClose     {function}  – called on cancel / backdrop click
 *   onConfirm   {function}  – called on confirmation
 *   itemType    {string}    – 'material' | 'video' | 'lesson' | 'module' | any label
 *   itemName    {string}    – display name of the item being removed
 *   loading     {boolean}   – disables actions while request is in-flight
 *   description {string}    – optional override for the body copy
 *
 * Usage:
 *   <ContentRemovalWarningModal
 *     open={open}
 *     onClose={() => setOpen(false)}
 *     onConfirm={handleDelete}
 *     itemType="video"
 *     itemName="Introduction to React Hooks"
 *     loading={isDeleting}
 *   />
 */

import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    Button,
    IconButton,
    Chip,
    Slide,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

// Icons
import CloseRoundedIcon            from '@mui/icons-material/CloseRounded';
import DeleteOutlineRoundedIcon    from '@mui/icons-material/DeleteOutlineRounded';
import VideoFileOutlinedIcon       from '@mui/icons-material/VideoFileOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import MenuBookOutlinedIcon        from '@mui/icons-material/MenuBookOutlined';
import ViewModuleOutlinedIcon      from '@mui/icons-material/ViewModuleOutlined';
import WarningAmberRoundedIcon     from '@mui/icons-material/WarningAmberRounded';
import ShieldOutlinedIcon          from '@mui/icons-material/ShieldOutlined';

// ─── Slide-up transition ──────────────────────────────────────────────────────
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// ─── Per-type config ──────────────────────────────────────────────────────────
const TYPE_CONFIG = {
    video: {
        icon:        <VideoFileOutlinedIcon sx={{ fontSize: 18 }} />,
        label:       'Video',
        chipColor:   '#6366F1',
        chipBg:      '#EEF2FF',
        consequence: 'Watch progress for enrolled learners will be permanently lost.',
    },
    material: {
        icon:        <InsertDriveFileOutlinedIcon sx={{ fontSize: 18 }} />,
        label:       'Material',
        chipColor:   '#0891B2',
        chipBg:      '#ECFEFF',
        consequence: 'Learners will immediately lose access to this file.',
    },
    lesson: {
        icon:        <MenuBookOutlinedIcon sx={{ fontSize: 18 }} />,
        label:       'Lesson',
        chipColor:   '#D97706',
        chipBg:      '#FFFBEB',
        consequence: 'All materials and videos inside this lesson will be removed too.',
    },
    module: {
        icon:        <ViewModuleOutlinedIcon sx={{ fontSize: 18 }} />,
        label:       'Module',
        chipColor:   '#DC2626',
        chipBg:      '#FEF2F2',
        consequence: 'Every lesson, video, and material inside this module will be permanently removed.',
    },
};

const DEFAULT_CONFIG = {
    icon:        <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />,
    label:       'Item',
    chipColor:   '#64748B',
    chipBg:      '#F1F5F9',
    consequence: 'This action cannot be undone.',
};

// ─── Keyframe animations — defined outside component so emotion caches them ───
const SHAKE_KF = {
    '@keyframes cw-shake': {
        '0%,100%': { transform: 'translateX(0) rotate(0deg)' },
        '10%':     { transform: 'translateX(-5px) rotate(-3deg)' },
        '20%':     { transform: 'translateX(5px) rotate(3deg)' },
        '30%':     { transform: 'translateX(-5px) rotate(-2deg)' },
        '40%':     { transform: 'translateX(5px) rotate(2deg)' },
        '50%':     { transform: 'translateX(-3px) rotate(-1deg)' },
        '60%':     { transform: 'translateX(3px) rotate(1deg)' },
        '70%':     { transform: 'translateX(-2px)' },
        '80%':     { transform: 'translateX(2px)' },
        '90%':     { transform: 'translateX(-1px)' },
    },
};

const PULSE_KF = {
    '@keyframes cw-pulse': {
        '0%,100%': { boxShadow: '0 0 0 0 rgba(220,38,38,0)' },
        '50%':     { boxShadow: '0 0 0 6px rgba(220,38,38,0.18)' },
    },
};

const FADEUP_KF = {
    '@keyframes cw-fadeup': {
        from: { opacity: 0, transform: 'translateY(8px)' },
        to:   { opacity: 1, transform: 'translateY(0)' },
    },
};

const SCANLINE_KF = {
    '@keyframes cw-scan': {
        '0%':   { transform: 'translateY(-100%)' },
        '100%': { transform: 'translateY(200%)' },
    },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function ContentRemovalWarningModal({
    open        = false,
    onClose,
    onConfirm,
    itemType    = 'material',
    itemName    = '',
    loading     = false,
    description,
}) {
    const cfg = TYPE_CONFIG[itemType?.toLowerCase()] ?? DEFAULT_CONFIG;

    // Trigger shake animation each time the modal opens
    const [shaking, setShaking] = useState(false);
    useEffect(() => {
        if (!open) return;
        setShaking(false);
        const t = setTimeout(() => setShaking(true), 150);
        return () => clearTimeout(t);
    }, [open]);

    const bodyText = description
        ?? `You're about to permanently remove this ${cfg.label.toLowerCase()}. ${cfg.consequence}`;

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            TransitionComponent={Transition}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                elevation: 0,
                sx: {
                    borderRadius: '20px',
                    overflow:     'hidden',
                    border:       '1px solid',
                    borderColor:  alpha('#DC2626', 0.18),
                    boxShadow: `
                        0 0 0 1px ${alpha('#DC2626', 0.06)},
                        0 32px 80px ${alpha('#000', 0.2)},
                        0 8px 24px ${alpha('#DC2626', 0.08)}
                    `,
                    background: 'linear-gradient(160deg, #fff 60%, #FFF5F5 100%)',
                },
            }}
            BackdropProps={{
                sx: {
                    backgroundColor: alpha('#1a0000', 0.55),
                    backdropFilter:  'blur(6px)',
                },
            }}
        >
            {/* ── Close button ─────────────────────────────────────────────── */}
            <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 20 }}>
                <IconButton
                    size="small"
                    onClick={onClose}
                    disabled={loading}
                    sx={{
                        color:      alpha('#000', 0.3),
                        transition: 'all 200ms ease',
                        '&:hover': {
                            color:     alpha('#000', 0.6),
                            bgcolor:   alpha('#000', 0.05),
                            transform: 'rotate(90deg)',
                        },
                    }}
                >
                    <CloseRoundedIcon fontSize="small" />
                </IconButton>
            </Box>

            <DialogContent sx={{ p: 0 }}>
                {/* ── Top accent bar with scan-line shimmer ─────────────────── */}
                <Box sx={{
                    height:     4,
                    position:   'relative',
                    overflow:   'hidden',
                    background: 'linear-gradient(90deg, #EF4444 0%, #F97316 50%, #EF4444 100%)',
                }}>
                    <Box sx={{
                        ...SCANLINE_KF,
                        position:   'absolute',
                        inset:       0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                        animation:  'cw-scan 2s linear infinite',
                    }} />
                </Box>

                <Box sx={{ px: 3.5, pt: 3.5, pb: 3 }}>
                    {/* ── Animated warning icon ────────────────────────────── */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2.5 }}>
                        <Box sx={{
                            ...SHAKE_KF,
                            ...PULSE_KF,
                            width:          72,
                            height:         72,
                            borderRadius:   '50%',
                            background:     'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
                            border:         '2px solid',
                            borderColor:    alpha('#DC2626', 0.2),
                            display:        'flex',
                            alignItems:     'center',
                            justifyContent: 'center',
                            color:          '#DC2626',
                            animation:      shaking
                                ? 'cw-shake 0.55s cubic-bezier(.36,.07,.19,.97) both, cw-pulse 2s ease-in-out 0.55s infinite'
                                : 'none',
                            boxShadow: `0 0 0 8px ${alpha('#DC2626', 0.06)}`,
                        }}>
                            <WarningAmberRoundedIcon sx={{ fontSize: 34, filter: 'drop-shadow(0 2px 4px rgba(220,38,38,0.3))' }} />
                        </Box>
                    </Box>

                    {/* ── Title ────────────────────────────────────────────── */}
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        textAlign="center"
                        sx={{
                            ...FADEUP_KF,
                            fontSize:      '1.1rem',
                            letterSpacing: '-0.3px',
                            color:         '#111',
                            mb:             1,
                            animation:     open ? 'cw-fadeup 0.3s ease 0.1s both' : 'none',
                        }}
                    >
                        Remove {cfg.label}?
                    </Typography>

                    {/* ── Item name chip ───────────────────────────────────── */}
                    {itemName && (
                        <Box sx={{
                            ...FADEUP_KF,
                            display:        'flex',
                            justifyContent: 'center',
                            mb:              1.75,
                            animation:      open ? 'cw-fadeup 0.3s ease 0.18s both' : 'none',
                        }}>
                            <Chip
                                icon={React.cloneElement(cfg.icon, { style: { color: cfg.chipColor, marginLeft: 8 } })}
                                label={itemName}
                                size="small"
                                sx={{
                                    bgcolor:     cfg.chipBg,
                                    color:       cfg.chipColor,
                                    border:      '1px solid',
                                    borderColor: alpha(cfg.chipColor, 0.22),
                                    fontWeight:  600,
                                    fontSize:   '0.78rem',
                                    maxWidth:   '100%',
                                    '& .MuiChip-label': {
                                        overflow:     'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace:   'nowrap',
                                        maxWidth:      240,
                                    },
                                }}
                            />
                        </Box>
                    )}

                    {/* ── Body copy ────────────────────────────────────────── */}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="center"
                        sx={{
                            ...FADEUP_KF,
                            lineHeight: 1.7,
                            fontSize:  '0.845rem',
                            mb:         2.5,
                            animation:  open ? 'cw-fadeup 0.3s ease 0.24s both' : 'none',
                        }}
                    >
                        {bodyText}
                    </Typography>

                    {/* ── "Cannot be undone" callout strip ─────────────────── */}
                    <Box sx={{
                        ...FADEUP_KF,
                        display:      'flex',
                        alignItems:   'center',
                        gap:           1,
                        bgcolor:      '#FFF1F1',
                        border:       '1px dashed',
                        borderColor:  alpha('#DC2626', 0.3),
                        borderRadius:  2,
                        px:            2,
                        py:            1,
                        mb:            3,
                        animation:    open ? 'cw-fadeup 0.3s ease 0.3s both' : 'none',
                    }}>
                        <DeleteOutlineRoundedIcon sx={{ fontSize: 16, color: alpha('#DC2626', 0.6), flexShrink: 0 }} />
                        <Typography variant="caption" sx={{ color: alpha('#DC2626', 0.85), fontWeight: 600, lineHeight: 1.4 }}>
                            This action is permanent and cannot be undone.
                        </Typography>
                    </Box>

                    {/* ── Actions ──────────────────────────────────────────── */}
                    <Box sx={{
                        ...FADEUP_KF,
                        display:       'flex',
                        flexDirection: 'column',
                        gap:            1.25,
                        animation:     open ? 'cw-fadeup 0.3s ease 0.36s both' : 'none',
                    }}>

                        {/*
                         * ── PRIMARY: Keep It ──────────────────────────────────
                         * The safe action is always the visually dominant button.
                         * Green = safe, full-weight, spring hover.
                         */}
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={onClose}
                            disabled={loading}
                            startIcon={<ShieldOutlinedIcon />}
                            sx={{
                                background:    'linear-gradient(135deg, #166534 0%, #16a34a 100%)',
                                color:         '#fff',
                                fontWeight:     700,
                                borderRadius:  '12px',
                                py:             1.35,
                                textTransform: 'none',
                                fontSize:      '0.925rem',
                                letterSpacing:  0.1,
                                boxShadow:     `0 4px 14px ${alpha('#16a34a', 0.35)}`,
                                transition:    'all 220ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #14532d 0%, #166534 100%)',
                                    boxShadow:  `0 8px 24px ${alpha('#16a34a', 0.45)}`,
                                    transform:  'translateY(-1px) scale(1.01)',
                                },
                                '&:active': {
                                    transform:  'translateY(0) scale(0.99)',
                                    boxShadow:  `0 2px 8px ${alpha('#16a34a', 0.3)}`,
                                },
                            }}
                        >
                            Keep It
                        </Button>

                        {/*
                         * ── SECONDARY: Confirm removal ────────────────────────
                         * Outlined ghost — visible but clearly subordinate.
                         * Turns more red on hover so the danger is still legible
                         * without being the first thing the eye lands on.
                         */}
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={onConfirm}
                            disabled={loading}
                            startIcon={<DeleteOutlineRoundedIcon />}
                            sx={{
                                color:         alpha('#DC2626', 0.65),
                                borderColor:   alpha('#DC2626', 0.25),
                                fontWeight:     500,
                                borderRadius:  '12px',
                                py:             1.1,
                                textTransform: 'none',
                                fontSize:      '0.875rem',
                                bgcolor:        'transparent',
                                transition:    'all 200ms ease',
                                '&:hover': {
                                    borderColor: alpha('#DC2626', 0.55),
                                    bgcolor:     alpha('#DC2626', 0.04),
                                    color:       '#DC2626',
                                },
                                '&:active': {
                                    bgcolor:   alpha('#DC2626', 0.08),
                                    transform: 'scale(0.99)',
                                },
                                '&.Mui-disabled': {
                                    borderColor: alpha('#DC2626', 0.15),
                                    color:       alpha('#DC2626', 0.3),
                                },
                            }}
                        >
                            {loading ? 'Removing…' : `Yes, Remove ${cfg.label}`}
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
