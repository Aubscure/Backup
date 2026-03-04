import React from 'react';
import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    Button,
    IconButton,
    Slide,
    Divider,
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * CourseWarningModal
 *
 * Props:
 *  open         – boolean
 *  onClose      – () => void   (cancel)
 *  onConfirm    – () => void   (confirm action)
 *  variant      – 'unpublish' | 'delete'
 *  courseTitle  – string
 *  loading      – boolean
 */
export default function CourseWarningModal({
    open,
    onClose,
    onConfirm,
    variant = 'delete',
    courseTitle = 'this course',
    loading = false,
}) {
    const isDelete = variant === 'delete';

    const config = isDelete
        ? {
              icon: <DeleteOutlineRoundedIcon sx={{ fontSize: 36 }} />,
              iconBg: '#FEE2E2',
              iconColor: '#DC2626',
              accentColor: '#DC2626',
              accentHover: '#B91C1C',
              title: 'Delete Course Permanently',
              body: (
                  <>
                      You're about to{' '}
                      <Box component="span" fontWeight={700} color="text.primary">
                          permanently delete
                      </Box>{' '}
                      <Box component="span" fontWeight={700} color="#DC2626">
                          "{courseTitle}"
                      </Box>
                      . This action{' '}
                      <Box component="span" fontWeight={700}>
                          cannot be undone
                      </Box>{' '}
                      — all content, lessons, and materials will be lost forever.
                  </>
              ),
              confirmLabel: 'Delete Forever',
              cancelLabel: 'Keep It',
          }
        : {
              icon: <ArchiveRoundedIcon sx={{ fontSize: 36 }} />,
              iconBg: '#FEF3C7',
              iconColor: '#B45309',
              accentColor: '#187604',
              accentHover: '#166534',
              title: 'Unpublish Course',
              body: (
                  <>
                      <Box component="span" fontWeight={700} color="#B45309">
                          "{courseTitle}"
                      </Box>{' '}
                      will be{' '}
                      <Box component="span" fontWeight={700} color="text.primary">
                          archived and hidden
                      </Box>{' '}
                      from all learners. You can delete it permanently afterwards if needed.
                  </>
              ),
              confirmLabel: 'Yes, Unpublish',
              cancelLabel: 'Cancel',
          };

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
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'rgba(0,0,0,0.06)',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.14)',
                },
            }}
            BackdropProps={{
                sx: {
                    backgroundColor: 'rgba(0,0,0,0.45)',
                    backdropFilter: 'blur(4px)',
                },
            }}
        >
            {/* Close button */}
            <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}>
                <IconButton
                    size="small"
                    onClick={onClose}
                    disabled={loading}
                    sx={{
                        color: 'text.disabled',
                        '&:hover': { color: 'text.secondary', backgroundColor: 'rgba(0,0,0,0.05)' },
                    }}
                >
                    <CloseRoundedIcon fontSize="small" />
                </IconButton>
            </Box>

            <DialogContent sx={{ p: 0 }}>
                {/* Top accent strip */}
                <Box
                    sx={{
                        height: 5,
                        background: isDelete
                            ? 'linear-gradient(90deg, #EF4444 0%, #DC2626 100%)'
                            : 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)',
                    }}
                />

                <Box sx={{ px: 4, pt: 4, pb: 3.5 }}>
                    {/* Icon */}
                    <Box
                        sx={{
                            width: 68,
                            height: 68,
                            borderRadius: '50%',
                            backgroundColor: config.iconBg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: config.iconColor,
                            mb: 3,
                            mx: 'auto',
                            boxShadow: `0 0 0 8px ${config.iconBg}80`,
                        }}
                    >
                        {config.icon}
                    </Box>

                    {/* Title */}
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        textAlign="center"
                        sx={{ mb: 1.5, letterSpacing: -0.3, fontSize: '1.15rem' }}
                    >
                        {config.title}
                    </Typography>

                    {/* Body */}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="center"
                        sx={{ lineHeight: 1.75, fontSize: '0.88rem' }}
                    >
                        {config.body}
                    </Typography>

                    <Divider sx={{ my: 3, borderColor: 'rgba(0,0,0,0.06)' }} />

                    {/* Actions */}
                    <Box sx={{ display: 'flex', gap: 1.5, flexDirection: 'column' }}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={onConfirm}
                            disabled={loading}
                            sx={{
                                backgroundColor: config.accentColor,
                                fontWeight: 700,
                                borderRadius: 2.5,
                                py: 1.25,
                                textTransform: 'none',
                                fontSize: '0.925rem',
                                letterSpacing: 0.2,
                                boxShadow: 'none',
                                '&:hover': {
                                    backgroundColor: config.accentHover,
                                    boxShadow: `0 6px 20px ${config.accentColor}40`,
                                },
                                '&.Mui-disabled': {
                                    backgroundColor: `${config.accentColor}60`,
                                    color: '#fff',
                                },
                            }}
                        >
                            {loading ? 'Processing…' : config.confirmLabel}
                        </Button>

                        <Button
                            variant="text"
                            fullWidth
                            onClick={onClose}
                            disabled={loading}
                            sx={{
                                fontWeight: 600,
                                borderRadius: 2.5,
                                py: 1,
                                textTransform: 'none',
                                fontSize: '0.875rem',
                                color: 'text.secondary',
                                '&:hover': {
                                    backgroundColor: 'rgba(0,0,0,0.04)',
                                    color: 'text.primary',
                                },
                            }}
                        >
                            {config.cancelLabel}
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
