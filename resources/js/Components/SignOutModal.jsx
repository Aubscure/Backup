import React from 'react';
import { router } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    Button,
    Divider,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

/**
 * SignOutModal
 *
 * Props:
 *   open     {boolean}  – controls visibility
 *   onClose  {function} – called when the user cancels
 */
export default function SignOutModal({ open, onClose }) {
    const handleSignOut = () => {
        onClose();
        router.post(route('logout'));
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    overflow: 'hidden',
                },
            }}
        >
            {/* Red accent bar at the top */}
            <Box sx={{ height: 6, bgcolor: 'error.main' }} />

            <DialogContent sx={{ pt: 4, pb: 3, px: 4, textAlign: 'center' }}>
                {/* Icon */}
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        bgcolor: 'error.lighter',
                        mb: 2,
                    }}
                >
                    <WarningAmberRoundedIcon sx={{ fontSize: 36, color: 'error.main' }} />
                </Box>

                <Typography variant="h6" fontWeight={700} gutterBottom>
                    Sign Out?
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Are you sure you want to sign out?<br />
                    You will need to log in again to access your account.
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        sx={{
                            flex: 1,
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                            py: 1,
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<LogoutIcon />}
                        onClick={handleSignOut}
                        sx={{
                            flex: 1,
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                            py: 1,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(211, 47, 47, 0.35)',
                            },
                        }}
                    >
                        Sign Out
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
