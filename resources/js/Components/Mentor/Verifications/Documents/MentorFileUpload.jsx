import React from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    FormHelperText,
    styled,
    IconButton,
    Tooltip,
    Fade,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

// Hidden input utility — unchanged
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function MentorFileUpload({
    label,
    name,
    file,
    setFile,
    error,
    icon: Icon = CloudUploadIcon,
    required = false,
    description = 'Supports .jpg, .png, .pdf',
    accept = '.jpg,.png,.pdf',
    sx,
}) {
    const hasFile = Boolean(file);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) setFile(name, selectedFile);
    };

    const handleRemoveFile = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setFile(name, null);
    };

    return (
        <Box sx={{ height: '100%', ...sx }}>
            <Paper
                variant="outlined"
                sx={{
                    // ── Padding ──────────────────────────────────────────────
                    // Desktop: p: 4 (32 px) — original.
                    // xs/sm:   p: 2.5 (20 px) — more usable on narrow screens
                    //          without feeling cramped.
                    p: { xs: 2.5, md: 4 },

                    // ── Height ───────────────────────────────────────────────
                    // Desktop: fixed 200 px so the two side-by-side cards align.
                    // xs/sm:   auto — content determines height; no awkward gaps.
                    height: { xs: 'auto', md: 200 },

                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    borderStyle: 'dashed',
                    borderWidth: 2,
                    borderColor: error ? 'error.main' : hasFile ? 'success.main' : 'grey.300',
                    bgcolor: hasFile ? '#f0fdf4' : 'transparent',
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    position: 'relative',

                    '&:hover': {
                        borderColor: error ? 'error.dark' : 'success.main',
                        bgcolor: hasFile ? '#dcfce7' : '#f9fafb',
                        transform: 'translateY(-4px)',
                        boxShadow: 3,
                    },

                    // Touch active feedback — gives immediate visual response
                    // since hover doesn't fire reliably on touch screens.
                    '&:active': {
                        transform: { xs: 'scale(0.985)', md: 'translateY(-4px)' },
                    },
                }}
            >
                {/* ── Discard button ───────────────────────────────────────── */}
                <Fade in={hasFile}>
                    <Tooltip title="Remove file">
                        <IconButton
                            size="small"
                            onClick={handleRemoveFile}
                            sx={{
                                position: 'absolute',
                                // xs/sm: slightly closer to corner for easier reach.
                                top: { xs: 6, md: 8 },
                                right: { xs: 6, md: 8 },
                                zIndex: 10,
                                bgcolor: 'white',
                                boxShadow: 1,
                                color: 'text.secondary',
                                // Larger touch target on mobile.
                                width: { xs: 30, md: 'auto' },
                                height: { xs: 30, md: 'auto' },
                                '&:hover': {
                                    bgcolor: '#fee2e2',
                                    color: 'error.main',
                                },
                            }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Fade>

                {/* ── Clickable area ───────────────────────────────────────── */}
                <Box
                    component="label"
                    sx={{
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        // On xs/sm, a little gap between elements keeps it breathable.
                        gap: { xs: 0.5, md: 0 },
                    }}
                >
                    <Icon
                        sx={{
                            // Desktop: 48 px — original.
                            // xs/sm:   36 px — saves ~12 px of precious vertical space.
                            fontSize: { xs: 36, md: 48 },
                            color: hasFile ? 'success.main' : 'text.secondary',
                            mb: { xs: 1, md: 2 },
                            transition: 'transform 0.3s',
                            '&:hover': { transform: 'scale(1.1)' },
                        }}
                    />

                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                    >
                        {label}{' '}
                        {required && (
                            <Typography component="span" color="error">
                                *
                            </Typography>
                        )}
                    </Typography>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            // Desktop: mb: 3 (24 px) — original.
                            // xs/sm:   mb: 1.5 — removes dead space below caption.
                            mb: { xs: 1.5, md: 3 },
                            display: 'block',
                            maxWidth: '80%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            // Slightly larger caption on mobile for legibility.
                            fontSize: { xs: '0.72rem', md: '0.75rem' },
                        }}
                    >
                        {hasFile ? file.name : description}
                    </Typography>

                    <Button
                        component="span"
                        variant={hasFile ? 'text' : 'contained'}
                        color={hasFile ? 'success' : 'inherit'}
                        size="small"
                        startIcon={hasFile ? <CheckCircleIcon /> : <CloudUploadIcon />}
                        sx={{
                            bgcolor: hasFile ? 'transparent' : '#f3f4f6',
                            color: hasFile ? 'success.dark' : 'text.primary',
                            pointerEvents: 'none',
                            // xs/sm: larger tap target (MUI `size` doesn't accept
                            // breakpoint objects so we expand via sx instead).
                            px: { xs: 2.5, md: 2 },
                            py: { xs: 0.75, md: 0.5 },
                            fontSize: { xs: '0.8rem', md: '0.8125rem' },
                            minHeight: { xs: 36, md: 'auto' },
                            '&:hover': {
                                bgcolor: hasFile ? 'transparent' : '#e5e7eb',
                            },
                        }}
                    >
                        {hasFile ? 'File Uploaded' : 'Browse Files'}
                    </Button>

                    <VisuallyHiddenInput
                        type="file"
                        accept={accept}
                        onChange={handleFileChange}
                    />
                </Box>
            </Paper>

            {error && (
                <FormHelperText error sx={{ mt: 1, textAlign: 'center' }}>
                    {error}
                </FormHelperText>
            )}
        </Box>
    );
}
