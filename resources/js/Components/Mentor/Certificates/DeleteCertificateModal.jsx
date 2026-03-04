import React from 'react';
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const DeleteCertificateModal = ({ open, onClose, onConfirm }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    p: 1,
                    width: '100%',
                    maxWidth: 400,
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
                <Box sx={{ 
                    width: 40, height: 40, borderRadius: '50%', 
                    bgcolor: '#fef2f2', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center' 
                }}>
                    <DeleteOutlineIcon sx={{ color: '#dc2626' }} />
                </Box>
                <Typography variant="h6" fontWeight={700}>
                    Delete Certificate?
                </Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                    Are you sure you want to remove this certificate assignment? This action will unassign the certificate from its associated course and cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
                <Button 
                    onClick={onClose}
                    sx={{ 
                        textTransform: 'none', fontWeight: 600, color: 'text.secondary',
                        '&:hover': { bgcolor: '#f3f4f6' }
                    }}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={onConfirm}
                    variant="contained"
                    sx={{ 
                        textTransform: 'none', fontWeight: 700,
                        bgcolor: '#dc2626', '&:hover': { bgcolor: '#b91c1c' },
                        boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
                        borderRadius: 2, px: 3
                    }}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteCertificateModal;
