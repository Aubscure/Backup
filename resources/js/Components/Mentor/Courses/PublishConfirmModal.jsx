/**
 * PublishConfirmModal
 *
 * Shared "Ready to go live?" confirmation dialog.
 * Used by both Show.jsx (from course overview) and Review.jsx (from wizard).
 *
 * Props
 * ─────
 * open        {boolean}  Whether the dialog is visible.
 * onClose     {fn}       Called when the user dismisses without publishing.
 * onConfirm   {fn}       Called when the user confirms — triggers the publish request.
 * processing  {boolean}  When true, disables buttons and shows a spinner.
 * courseTitle {string}   Displayed inside the body copy for context.
 */

import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    Button,
    Alert,
    CircularProgress,
} from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

// ─── Constants ────────────────────────────────────────────────────────────────

const GREEN = { 700: '#15803d', 800: '#166534' };

// ─── Component ────────────────────────────────────────────────────────────────

export default function PublishConfirmModal({
    open,
    onClose,
    onConfirm,
    processing = false,
    courseTitle = 'this course',
}) {
    // Prevent accidental closure while the request is in-flight
    const handleClose = () => {
        if (!processing) onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}
            /* Soft blur backdrop for visual depth without a harsh overlay */
            slotProps={{
                backdrop: {
                    sx: { backdropFilter: 'blur(4px)', bgcolor: 'rgba(0,0,0,0.4)' },
                },
            }}
        >
            {/* ── Title ─────────────────────────────────────────────────── */}
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: '#f0fdf4',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <RocketLaunchIcon sx={{ color: GREEN[700], fontSize: 20 }} />
                    </Box>
                    <Typography variant="h6" fontWeight={700}>
                        Ready to go live?
                    </Typography>
                </Box>
            </DialogTitle>

            {/* ── Body ──────────────────────────────────────────────────── */}
            <DialogContent>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Publishing{' '}
                    <Box component="strong" sx={{ color: 'text.primary' }}>
                        {courseTitle}
                    </Box>{' '}
                    makes it visible to students immediately. You can still edit
                    content after publishing.
                </Typography>

                <Alert severity="info" sx={{ borderRadius: 2 }}>
                    Students will be able to enroll and access your course as soon
                    as it's published.
                </Alert>
            </DialogContent>

            {/* ── Actions ───────────────────────────────────────────────── */}
            <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                <Button
                    onClick={handleClose}
                    disabled={processing}
                    variant="outlined"
                    sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                >
                    Not Yet
                </Button>

                <Button
                    onClick={onConfirm}
                    disabled={processing}
                    variant="contained"
                    startIcon={
                        processing ? (
                            <CircularProgress size={16} color="inherit" />
                        ) : (
                            <RocketLaunchIcon sx={{ fontSize: '18px !important' }} />
                        )
                    }
                    sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        borderRadius: 2,
                        bgcolor: GREEN[700],
                        '&:hover': { bgcolor: GREEN[800] },
                        minWidth: 140,
                    }}
                >
                    {processing ? 'Publishing…' : 'Publish Now'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}