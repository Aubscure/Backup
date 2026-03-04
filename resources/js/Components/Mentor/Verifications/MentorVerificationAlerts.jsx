import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, IconButton, Collapse, keyframes } from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';

// 1. Define a subtle pulse animation for the icons
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

export default function MentorVerificationAlerts({ isVerified, verificationSubmitted }) {
    const [openActionRequired, setOpenActionRequired] = useState(true);
    const [openPending, setOpenPending] = useState(true);
    const [openSuccess, setOpenSuccess] = useState(true);

    useEffect(() => {
        const actionHidden = localStorage.getItem('mentor_hide_action_required') === 'true';
        const pendingHidden = localStorage.getItem('mentor_hide_pending') === 'true';
        const successHidden = localStorage.getItem('mentor_hide_success') === 'true';

        if (actionHidden) setOpenActionRequired(false);
        if (pendingHidden) setOpenPending(false);
        if (successHidden) setOpenSuccess(false);
    }, []);

    const handleCloseAction = () => {
        setOpenActionRequired(false);
        localStorage.setItem('mentor_hide_action_required', 'true');
    };

    const handleClosePending = () => {
        setOpenPending(false);
        localStorage.setItem('mentor_hide_pending', 'true');
    };

    const handleCloseSuccess = () => {
        setOpenSuccess(false);
        localStorage.setItem('mentor_hide_success', 'true');
    };

    // 2. Reusable Style Generator for the Alerts
    // This ensures consistent animation across all three alerts while keeping specific colors
    const getAlertSx = (bgColor, color, borderColor, shadowColor) => ({
        mb: 3,
        bgcolor: bgColor,
        color: color,
        border: `1px solid ${borderColor}`,
        alignItems: 'center',
        // Interactive Transitions
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'default',
        '&:hover': {
            // The "Lift" effect
            transform: 'translateY(-3px)',
            // Soft Shadow effect using the alert's color theme
            boxShadow: `0 12px 20px -5px ${shadowColor || 'rgba(0,0,0,0.1)'}`,
        },
        // Icon Animation
        '& .MuiAlert-icon': {
            animation: `${pulse} 2s infinite ease-in-out`,
        },
        // Action (Close) Button Animation
        '& .MuiAlert-action': {
            paddingTop: 0,
            alignItems: 'center',
            '& button': {
                transition: 'transform 0.2s ease',
                '&:hover': {
                    transform: 'rotate(90deg)',
                    backgroundColor: 'rgba(0,0,0,0.05)'
                }
            }
        }
    });

    return (
        <Box sx={{ width: '100%' }}>
            {/* 1. Action Required Alert */}
            <Collapse in={!isVerified && !verificationSubmitted && openActionRequired} unmountOnExit>
                <Alert
                    severity="warning"
                    icon={false} // We use custom icons inside the message for better control
                    sx={getAlertSx('#fff3cd', '#856404', '#ffeeba', 'rgba(255, 193, 7, 0.25)')}
                    action={
                        <IconButton aria-label="close" color="inherit" size="small" onClick={handleCloseAction}>
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <VerifiedUserIcon fontSize="medium" sx={{ color: '#856404' }} />
                        <Typography variant="body2" fontWeight={600}>
                            Action Required: Verify your expertise to start building courses and managing your students.
                        </Typography>
                    </Box>
                </Alert>
            </Collapse>

            {/* 2. Pending Review Alert */}
            <Collapse in={verificationSubmitted && !isVerified && openPending} unmountOnExit>
                <Alert
                    severity="info" // Changed to info logically, but kept yellow styling per your request
                    icon={false}
                    sx={getAlertSx('#e2e3e5', '#383d41', '#d6d8db', 'rgba(0,0,0,0.1)')} // Muted grey/yellow tone
                    // If you prefer the original yellow:
                    // sx={getAlertSx('#fff3cd', '#856404', '#ffeeba', 'rgba(255, 193, 7, 0.25)')}
                    action={
                        <IconButton aria-label="close" color="inherit" size="small" onClick={handleClosePending}>
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <AccessTimeIcon fontSize="medium" sx={{ color: '#383d41' }} />
                        <Typography variant="body2" fontWeight={600}>
                            Your expertise verification is currently being reviewed. Please wait 24 hours for the process to complete.
                        </Typography>
                    </Box>
                </Alert>
            </Collapse>

            {/* 3. Success Alert */}
            <Collapse in={isVerified && openSuccess} unmountOnExit>
                <Alert
                    severity="success"
                    sx={getAlertSx('#d1e7dd', '#0f5132', '#badbcc', 'rgba(25, 135, 84, 0.25)')}
                    action={
                        <IconButton aria-label="close" color="inherit" size="small" onClick={handleCloseSuccess}>
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    <Typography variant="body2" fontWeight={600}>
                        Congratulations! Your expertise is verified. You can now unlock the full potential of ManPro by creating your first course.
                    </Typography>
                </Alert>
            </Collapse>
        </Box>
    );
}
