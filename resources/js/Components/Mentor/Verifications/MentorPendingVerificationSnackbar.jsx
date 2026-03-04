import React from 'react';
import { Snackbar, Alert, Slide, keyframes } from '@mui/material';

// 1. Define a gentle wobble animation for the warning icon
const wobble = keyframes`
  0% { transform: rotate(0deg); }
  15% { transform: rotate(-6deg); }
  30% { transform: rotate(5deg); }
  45% { transform: rotate(-4deg); }
  60% { transform: rotate(2deg); }
  75% { transform: rotate(-1deg); }
  100% { transform: rotate(0deg); }
`;

// 2. Custom Transition to slide down from the top
function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

export default function PendingVerificationSnackbar({ open, onClose }) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            TransitionComponent={SlideTransition} // Smoother entry animation
        >
            <Alert
                onClose={onClose}
                severity="warning"
                variant="filled"
                sx={{
                    width: '100%',
                    bgcolor: '#ed6c02', // Richer standard warning color
                    color: '#fff',
                    fontWeight: 500,
                    borderRadius: 2,
                    boxShadow: '0 8px 20px -5px rgba(237, 108, 2, 0.4)', // Matching colored shadow
                    alignItems: 'center',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'default',

                    // Interactive Hover State
                    '&:hover': {
                        transform: 'translateY(2px) scale(1.02)', // Tactile "lift"
                        boxShadow: '0 12px 28px -5px rgba(237, 108, 2, 0.6)',
                        bgcolor: '#e65100', // Slightly darker on hover
                    },

                    // Icon Animation
                    '& .MuiAlert-icon': {
                        opacity: 1,
                        animation: `${wobble} 2s infinite ease-in-out`, // Attention-grabbing wobble
                    },

                    // Close Button Micro-interaction
                    '& .MuiAlert-action': {
                        pt: 0,
                        '& .MuiIconButton-root': {
                            color: 'rgba(255,255,255,0.8)',
                            transition: 'all 0.2s',
                            '&:hover': {
                                color: '#fff',
                                bgcolor: 'rgba(255,255,255,0.15)',
                                transform: 'rotate(90deg)' // Playful rotation on close hover
                            }
                        }
                    }
                }}
            >
                Your expertise verification is currently in progress. Please wait 24 hours for the process to complete.
            </Alert>
        </Snackbar>
    );
}
