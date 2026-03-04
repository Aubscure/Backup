import React from 'react';
import { Dialog, Box, Typography, Button } from '@mui/material';

export default function WarningModal({ open, onConfirm, onCancel, message }) {
    return (
        <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Warning
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {message || 'Your progress will be lost. Are you sure you want to cancel?'}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button variant="contained" color="error" onClick={onConfirm}>
                        Yes, Restart
                    </Button>
                    <Button variant="outlined" onClick={onCancel}>
                        No, Continue
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}
