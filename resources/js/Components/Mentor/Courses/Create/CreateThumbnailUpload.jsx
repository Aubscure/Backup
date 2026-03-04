import { memo, useRef, useState } from 'react';
import InputError from '@/Components/InputError';
import {
    Box, Typography, Paper, Stack, IconButton, Chip, keyframes,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import CloudUploadIcon          from '@mui/icons-material/CloudUpload';
import CloseIcon                from '@mui/icons-material/Close';
import InfoOutlinedIcon         from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon   from '@mui/icons-material/CheckCircleOutline';
import HistoryRoundedIcon       from '@mui/icons-material/HistoryRounded';
import RefreshRoundedIcon       from '@mui/icons-material/RefreshRounded';
import { Fade, Zoom } from '@mui/material';

// ── Keyframes ────────────────────────────────────────────────────────────────

const pulseRing = keyframes`
  0%   { transform: scale(0.95); box-shadow: 0 0 0 0   rgba(46,125,50,0.35); }
  70%  { transform: scale(1);    box-shadow: 0 0 0 10px rgba(46,125,50,0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0   rgba(46,125,50,0); }
`;

const floatUp = keyframes`
  0%   { opacity: 0; transform: translateY(16px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const checkPop = keyframes`
  0%   { transform: scale(0);   opacity: 0; }
  60%  { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1);   opacity: 1; }
`;

const restoredSlide = keyframes`
  0%   { opacity: 0; transform: translateY(-8px); }
  100% { opacity: 1; transform: translateY(0); }
`;

// ── Styled ────────────────────────────────────────────────────────────────────

const UploadZone = styled(Box)(({ theme, haspreview, haserror, dragover, isrestored }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 220,
    border: '2px dashed',
    borderColor: haserror
        ? theme.palette.error.main
        : dragover
            ? theme.palette.success.main
            : isrestored
                ? theme.palette.warning.main
                : haspreview
                    ? theme.palette.success.light
                    : theme.palette.grey[300],
    borderRadius: 12,
    backgroundColor: dragover
        ? alpha(theme.palette.success.main, 0.07)
        : isrestored
            ? alpha(theme.palette.warning.main, 0.05)
            : haspreview
                ? alpha(theme.palette.success.main, 0.04)
                : theme.palette.grey[50],
    padding: theme.spacing(3),
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
    transform: dragover ? 'scale(1.02)' : 'scale(1)',
    boxShadow: dragover ? `0 0 0 6px ${alpha(theme.palette.success.main, 0.12)}` : 'none',
    '&:hover': {
        borderColor: isrestored ? theme.palette.warning.light : theme.palette.success.light,
        backgroundColor: isrestored
            ? alpha(theme.palette.warning.main, 0.08)
            : alpha(theme.palette.success.main, 0.06),
        transform: 'scale(1.01)',
        boxShadow: `0 0 0 4px ${alpha(
            isrestored ? theme.palette.warning.main : theme.palette.success.main,
            0.10,
        )}`,
    },
    '&:active': { transform: 'scale(0.99)' },
}));

const UploadIconWrap = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(1.5),
    borderRadius: '50%',
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(2),
    animation: `${pulseRing} 2.8s ease-in-out infinite`,
    transition: 'background-color 0.3s',
    '&:hover': { backgroundColor: alpha(theme.palette.success.main, 0.12) },
}));

const ProTipCard = styled(Paper)(({ theme }) => ({
    marginTop: theme.spacing(2.5),
    padding: theme.spacing(2),
    borderColor: theme.palette.success.light,
    backgroundColor: alpha(theme.palette.success.main, 0.05),
    animation: `${floatUp} 0.6s 0.5s cubic-bezier(0.22,1,0.36,1) both`,
    transition: 'background-color 0.25s, transform 0.25s',
    '&:hover': {
        backgroundColor: alpha(theme.palette.success.main, 0.10),
        transform: 'translateX(4px)',
    },
}));

// ── Component ─────────────────────────────────────────────────────────────────

const CourseThumbnailUpload = memo(function CourseThumbnailUpload({
    thumbnailPreview,
    isRestored = false,         // ← NEW: true when loaded from sessionStorage
    onFileChange,
    onRemove,
    error,
}) {
    const fileInputRef = useRef(null);
    const [dragOver,  setDragOver]  = useState(false);
    const [justAdded, setJustAdded] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file?.type.match(/image\/(png|jpeg|gif)/)) {
            onFileChange(file);
            setJustAdded(true);
            setTimeout(() => setJustAdded(false), 900);
        }
    };

    const handleInput = (e) => {
        const file = e.target.files[0];
        if (file) {
            onFileChange(file);
            setJustAdded(true);
            setTimeout(() => setJustAdded(false), 900);
        }
    };

    return (
        <Box sx={{ animation: `${floatUp} 0.55s 120ms cubic-bezier(0.22,1,0.36,1) both` }}>
            {/* ── Label row ── */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
                <Typography variant="body2" fontWeight={500}>
                    Course Thumbnail{' '}
                    <Typography component="span" color="error.main">*</Typography>
                </Typography>

                {/* Restored pill — animates in */}
                {isRestored && (
                    <Chip
                        icon={<HistoryRoundedIcon sx={{ fontSize: '13px !important' }} />}
                        label="Restored from last session"
                        size="small"
                        sx={{
                            bgcolor: '#fff8e1',
                            color: '#e65100',
                            border: '1px solid #ffcc80',
                            fontWeight: 600,
                            fontSize: '0.65rem',
                            animation: `${restoredSlide} 0.4s 0.2s cubic-bezier(0.22,1,0.36,1) both`,
                            '& .MuiChip-icon': { color: '#e65100' },
                        }}
                    />
                )}
            </Box>

            <UploadZone
                haspreview={thumbnailPreview ? 1 : 0}
                haserror={error ? 1 : 0}
                dragover={dragOver ? 1 : 0}
                isrestored={isRestored ? 1 : 0}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
            >
                {thumbnailPreview ? (
                    <Zoom in timeout={350}>
                        <Box sx={{ position: 'relative', width: '100%' }}>
                            {/* ── Checkmark flash on fresh upload ── */}
                            {justAdded && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        inset: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 2,
                                        borderRadius: 2,
                                        bgcolor: 'rgba(255,255,255,0.5)',
                                        backdropFilter: 'blur(2px)',
                                        animation: `${checkPop} 0.5s ease both`,
                                    }}
                                >
                                    <CheckCircleOutlineIcon
                                        sx={{ fontSize: 60, color: 'success.main', opacity: 0.9 }}
                                    />
                                </Box>
                            )}

                            {/* ── Thumbnail image ── */}
                            <Box
                                component="img"
                                src={thumbnailPreview}
                                alt="Thumbnail preview"
                                sx={{
                                    mx: 'auto',
                                    maxHeight: 192,
                                    borderRadius: 2,
                                    objectFit: 'cover',
                                    display: 'block',
                                    width: '100%',
                                    boxShadow: isRestored
                                        ? '0 8px 24px rgba(230,81,0,0.18)'
                                        : '0 8px 24px rgba(0,0,0,0.14)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    filter: isRestored ? 'brightness(0.96)' : 'none',
                                    '&:hover': {
                                        transform: 'scale(1.025)',
                                        boxShadow: '0 12px 32px rgba(0,0,0,0.20)',
                                        filter: 'brightness(1)',
                                    },
                                }}
                            />

                            {/* ── "Click to replace" hint on restored ── */}
                            {isRestored && !justAdded && (
                                <Fade in timeout={500}>
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: 8,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: 10,
                                            bgcolor: 'rgba(0,0,0,0.52)',
                                            backdropFilter: 'blur(4px)',
                                            pointerEvents: 'none',
                                        }}
                                    >
                                        <RefreshRoundedIcon sx={{ fontSize: 13, color: 'white' }} />
                                        <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, fontSize: '0.65rem', whiteSpace: 'nowrap' }}>
                                            Click to re-select file
                                        </Typography>
                                    </Box>
                                </Fade>
                            )}

                            {/* ── Remove button ── */}
                            <Zoom in timeout={400}>
                                <IconButton
                                    size="small"
                                    onClick={(e) => { e.stopPropagation(); onRemove(); }}
                                    sx={{
                                        position: 'absolute',
                                        top: -10,
                                        right: -10,
                                        bgcolor: 'error.main',
                                        color: 'white',
                                        transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                                        '&:hover': {
                                            bgcolor: 'error.dark',
                                            transform: 'scale(1.2) rotate(90deg)',
                                        },
                                    }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Zoom>
                        </Box>
                    </Zoom>
                ) : (
                    <Fade in timeout={350}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <UploadIconWrap>
                                <CloudUploadIcon
                                    sx={{
                                        fontSize: 32,
                                        color: dragOver ? 'success.main' : 'grey.400',
                                        transition: 'all 0.25s ease',
                                        transform: dragOver ? 'translateY(-5px) scale(1.15)' : 'none',
                                    }}
                                />
                            </UploadIconWrap>
                            <Typography variant="body2" fontWeight={500} color="text.secondary">
                                {dragOver ? '✦ Drop it here!' : 'Click to upload image'}
                            </Typography>
                            <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, textAlign: 'center' }}>
                                PNG, JPG or GIF · Max 5 MB · or drag & drop
                            </Typography>
                        </Box>
                    </Fade>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/gif"
                    onChange={handleInput}
                    style={{ display: 'none' }}
                />
            </UploadZone>

            <InputError message={error} />

            <ProTipCard variant="outlined">
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <InfoOutlinedIcon
                        sx={{
                            fontSize: 16,
                            color: 'success.main',
                            mt: 0.4,
                            animation: `${pulseRing} 3s ease-in-out infinite`,
                        }}
                    />
                    <Box>
                        <Typography variant="body2" fontWeight={600} color="success.dark">
                            Pro Tip
                        </Typography>
                        <Typography variant="caption" color="success.dark">
                            Use a 16:9 image with minimal text for best results.
                        </Typography>
                    </Box>
                </Stack>
            </ProTipCard>
        </Box>
    );
});

export default CourseThumbnailUpload;