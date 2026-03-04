import { useRef, useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Box, Stack, Typography, Button, CircularProgress, LinearProgress,
} from '@mui/material';
import CloudUploadRoundedIcon  from '@mui/icons-material/CloudUploadRounded';
import InfoOutlinedIcon        from '@mui/icons-material/InfoOutlined';
import ImageRoundedIcon        from '@mui/icons-material/ImageRounded';
import { extractVideoThumbnail, blobToPreviewUrl } from '@/utils/videoThumbnail';

export default function MentorAddVideoDialog({
    open,
    onClose,
    selectedLesson,
    data,
    setData,
    onSubmit,
    processing,
    uploadProgress = null,
    uploadError    = null,
}) {
    const fileInputRef  = useRef(null);
    const [thumbPreview, setThumbPreview] = useState(null); // object URL for <img>
    const [thumbBlob,    setThumbBlob]    = useState(null); // Blob to send to server
    const [extracting,   setExtracting]   = useState(false);

    // Revoke the preview URL when dialog closes or file changes
    useEffect(() => {
        return () => {
            if (thumbPreview) URL.revokeObjectURL(thumbPreview);
        };
    }, [thumbPreview]);

    // Reset thumbnail state when dialog closes
    useEffect(() => {
        if (!open) {
            if (thumbPreview) URL.revokeObjectURL(thumbPreview);
            setThumbPreview(null);
            setThumbBlob(null);
        }
    }, [open]);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0] ?? null;
        if (!file) return;

        setData('video', file);

        // Revoke old preview before creating a new one
        if (thumbPreview) URL.revokeObjectURL(thumbPreview);
        setThumbPreview(null);
        setThumbBlob(null);
        setExtracting(true);

        const blob    = await extractVideoThumbnail(file);
        const preview = blobToPreviewUrl(blob);

        setThumbBlob(blob);
        setThumbPreview(preview);
        setExtracting(false);

        // Expose blob to parent so it can be sent with the store request
        setData('thumbnailBlob', blob);
    };

    const isTransferring = processing && uploadProgress !== null && uploadProgress < 100;
    const isServerSaving = processing && uploadProgress === 100;

    return (
        <Dialog
            open={open}
            onClose={processing ? undefined : onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{ sx: { borderRadius: 3 } }}
        >
            <DialogTitle>Upload Video Lesson</DialogTitle>

            <Box component="form" onSubmit={onSubmit}>
                <DialogContent dividers>
                    <Stack spacing={2}>
                        <Typography variant="body2" color="text.secondary">
                            For: <strong>{selectedLesson?.title}</strong>
                        </Typography>

                        {/* File picker */}
                        <Button
                            variant="outlined"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={processing}
                            startIcon={<CloudUploadRoundedIcon />}
                            sx={{ textTransform: 'none', justifyContent: 'flex-start' }}
                        >
                            {data.video ? `Selected: ${data.video.name}` : 'Choose Video File'}
                        </Button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileChange}
                            accept="video/mp4,video/webm,video/mov,video/*"
                            style={{ display: 'none' }}
                        />

                        {/* File size */}
                        {data.video && !processing && (
                            <Typography variant="caption" color="text.secondary">
                                Size: {(data.video.size / (1024 * 1024)).toFixed(1)} MB
                            </Typography>
                        )}

                        {/* Thumbnail preview */}
                        {(extracting || thumbPreview) && (
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
                                    <ImageRoundedIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                        Thumbnail Preview
                                    </Typography>
                                    {extracting && (
                                        <CircularProgress size={12} thickness={5} sx={{ ml: 0.5 }} />
                                    )}
                                </Box>

                                {thumbPreview && (
                                    <Box
                                        component="img"
                                        src={thumbPreview}
                                        alt="Video thumbnail preview"
                                        sx={{
                                            width: '100%',
                                            aspectRatio: '16/9',
                                            objectFit: 'cover',
                                            borderRadius: 2,
                                            border: '1px solid',
                                            borderColor: 'grey.300',
                                        }}
                                    />
                                )}
                            </Box>
                        )}

                        {/* Upload progress */}
                        {isTransferring && (
                            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#e8f5e9', border: '1px solid #c8e6c9' }}>
                                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                                    <Typography variant="body2" fontWeight={600} color="success.dark">
                                        Uploading to Vimeo…
                                    </Typography>
                                    <Typography variant="body2" fontWeight={700} color="success.main">
                                        {uploadProgress}%
                                    </Typography>
                                </Stack>
                                <LinearProgress
                                    variant="determinate"
                                    value={uploadProgress}
                                    sx={{
                                        height: 6, borderRadius: 1, bgcolor: '#c8e6c9',
                                        '& .MuiLinearProgress-bar': { bgcolor: 'success.main' },
                                    }}
                                />
                            </Box>
                        )}

                        {/* Saving state */}
                        {isServerSaving && (
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1.5}
                                sx={{ p: 1.5, borderRadius: 2, bgcolor: '#e8f5e9', border: '1px solid #c8e6c9' }}
                            >
                                <CircularProgress size={18} thickness={5} sx={{ color: 'success.main', flexShrink: 0 }} />
                                <Box>
                                    <Typography variant="body2" fontWeight={600} color="success.dark">
                                        Saving…
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Upload complete. Saving record to database.
                                    </Typography>
                                </Box>
                            </Stack>
                        )}

                        {/* Info note */}
                        {!processing && (
                            <Stack
                                direction="row"
                                alignItems="flex-start"
                                spacing={1}
                                sx={{ p: 1.5, borderRadius: 2, bgcolor: '#f3f4fd', border: '1px solid #e8eaf6' }}
                            >
                                <InfoOutlinedIcon sx={{ fontSize: 16, color: '#3949ab', mt: 0.2, flexShrink: 0 }} />
                                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                    A thumbnail is automatically extracted from your video and saved instantly.
                                    Vimeo will also process a high-res version in the background.
                                </Typography>
                            </Stack>
                        )}

                        {uploadError && (
                            <Typography variant="body2" color="error.main">
                                {uploadError}
                            </Typography>
                        )}
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} disabled={processing} sx={{ textTransform: 'none' }}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={processing || !data.video}
                        variant="contained"
                        sx={{
                            textTransform: 'none',
                            minWidth: 140,
                            bgcolor: 'success.main',
                            '&:hover': { bgcolor: 'success.dark' },
                        }}
                    >
                        {isTransferring
                            ? `Uploading… ${uploadProgress}%`
                            : isServerSaving
                            ? 'Saving…'
                            : 'Upload Video'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
