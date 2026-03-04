import { memo, useRef, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Box, Stack, Typography, TextField, Button,
    Fade, Chip,
} from '@mui/material';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

const MentorAddMaterialDialog = memo(function MentorAddMaterialDialog({
    open, onClose, selectedLesson, data, setData, onSubmit, processing,
}) {
    const fileInputRef = useRef(null);
    const [dropHovered, setDropHovered] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setDropHovered(false);
        const file = e.dataTransfer.files?.[0];
        if (file) setData('file', file);
    };

    return (
        <Dialog
            open={open}
            onClose={processing ? undefined : onClose}
            fullWidth
            maxWidth="sm"
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 250 }}
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                },
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Box
                        sx={{
                            width: 34,
                            height: 34,
                            borderRadius: 2,
                            bgcolor: '#e3f2fd',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <UploadFileRoundedIcon sx={{ color: '#1e88e5', fontSize: 18 }} />
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" fontWeight={700}>
                            Add Reading Material
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            for: <b>{selectedLesson?.title}</b>
                        </Typography>
                    </Box>
                </Box>
            </DialogTitle>

            <Box component="form" onSubmit={onSubmit}>
                <DialogContent dividers>
                    <Stack spacing={2.5}>
                        <TextField
                            label="Material Title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            fullWidth
                            required
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset':  { borderColor: '#1e88e5' },
                                    '&.Mui-focused fieldset': { borderColor: '#1e88e5' },
                                },
                            }}
                        />

                        {/* Drop zone */}
                        <Box
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); setDropHovered(true); }}
                            onDragLeave={() => setDropHovered(false)}
                            onDrop={handleDrop}
                            sx={{
                                border: '2px dashed',
                                borderColor: dropHovered ? '#1e88e5' : data.file ? '#43a047' : 'grey.300',
                                borderRadius: 2.5,
                                p: 3,
                                textAlign: 'center',
                                cursor: 'pointer',
                                bgcolor: dropHovered ? '#e3f2fd' : data.file ? '#e8f5e9' : 'grey.50',
                                transition: 'all 0.2s ease',
                                transform: dropHovered ? 'scale(1.01)' : 'scale(1)',
                                '&:hover': { borderColor: '#1e88e5', bgcolor: '#e3f2fd' },
                            }}
                        >
                            {data.file ? (
                                <Stack alignItems="center" spacing={0.5}>
                                    <CheckCircleOutlineRoundedIcon sx={{ color: '#43a047', fontSize: 32 }} />
                                    <Typography variant="body2" fontWeight={600} color="success.dark">
                                        {data.file.name}
                                    </Typography>
                                    <Chip
                                        label={`${(data.file.size / 1024).toFixed(0)} KB`}
                                        size="small"
                                        sx={{ bgcolor: '#c8e6c9', color: '#2e7d32', fontWeight: 600 }}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        Click to change file
                                    </Typography>
                                </Stack>
                            ) : (
                                <Stack alignItems="center" spacing={0.5}>
                                    <UploadFileRoundedIcon sx={{ color: 'grey.400', fontSize: 32 }} />
                                    <Typography variant="body2" fontWeight={500} color="text.secondary">
                                        Drag & drop or <span style={{ color: '#1e88e5', fontWeight: 600 }}>browse</span>
                                    </Typography>
                                    <Typography variant="caption" color="text.disabled">
                                        PDF, DOC, PPT, XLSX, ZIP — max 50 MB
                                    </Typography>
                                </Stack>
                            )}
                        </Box>

                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar"
                            style={{ display: 'none' }}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button
                        onClick={onClose}
                        disabled={processing}
                        sx={{ textTransform: 'none', color: 'text.secondary' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={processing || !data.file || !data.title}
                        variant="contained"
                        sx={{
                            textTransform: 'none',
                            bgcolor: '#1e88e5',
                            '&:hover': { bgcolor: '#1565c0', transform: 'scale(1.03)' },
                            transition: 'transform 0.15s',
                            fontWeight: 600,
                            minWidth: 110,
                        }}
                    >
                        {processing ? 'Uploading…' : 'Upload'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
});

export default MentorAddMaterialDialog;