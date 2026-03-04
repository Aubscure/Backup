import React from 'react';
import { Box, Typography, Paper, LinearProgress, keyframes, alpha } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Added for "Submitted" state
import { usePage } from '@inertiajs/react';

// --- ANIMATIONS ---
const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
`;

const iconPop = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

export default function VerificationStatusCard({ isVerified = false, docCount = 0 }) {
  const { auth } = usePage().props;
  const user = auth.user;

  // Determine Logic States using props or fallbacks
  const verified = isVerified ?? (user?.is_verified === true || user?.is_verified === 1);
  const hasSubmittedDocs = docCount > 0;

  // Calculate Progress & Theme Colors
  let progress = 25;
  let themeColor = 'error.main'; // Default Red
  let shadowColor = 'rgba(211, 47, 47, 0.25)';

  if (hasSubmittedDocs && !verified) {
    progress = 85;
    themeColor = '#e8a710'; // Orange for submitted,
    shadowColor = 'rgba(232, 167, 16, 0.25)';
  }
  if (verified) {
    progress = 100;
    themeColor = 'success.main'; // Green for success
    shadowColor = 'rgba(46, 125, 50, 0.25)';
  }

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      {/* Section Label */}
      <Box sx={{ px: 2, pt: 2 }}>
        <Typography
          variant="caption"
          fontWeight="bold"
          sx={{ textTransform: 'uppercase', color: 'text.secondary' }}
        >
          Verification Status
        </Typography>
      </Box>

      {/* Main Card Content */}
      <Box sx={{ py: 1.5, pb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'grey.200',
            bgcolor: 'background.paper',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'default',
            position: 'relative',
            overflow: 'hidden',

            // Interactive Hover: Lift + Colored Shadow
            '&:hover': {
              transform: 'translateY(-3px)',
              borderColor: 'transparent',
              boxShadow: `0 10px 20px -5px ${shadowColor}`,
            }
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Box sx={{ display: 'flex', animation: `${pulse} 3s infinite ease-in-out` }}>
                <InfoOutlinedIcon sx={{ fontSize: 22, color: '#646464' }} />
            </Box>
            <Typography variant="subtitle1" fontWeight={700} color="text.primary">
              Profile Status
            </Typography>
          </Box>

          {/* Progress Bar */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                Profile Complete
              </Typography>
              <Typography variant="body2" fontWeight={700} sx={{ color: '#1e1e1e' }}>
                {progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'grey.100',
                '& .MuiLinearProgress-bar': {
                  bgcolor: themeColor,
                  borderRadius: 4,
                  transition: 'transform 1s ease-in-out, background-color 0.3s', // Smooth slide
                },
              }}
            />
          </Box>

          {/* Status Rows */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {/* Documents Row - Interactive Item */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1,
                    mx: -1, // Negative margin to allow hover bg to extend
                    borderRadius: 1,
                    transition: 'background-color 0.2s',
                    '&:hover': {
                        bgcolor: 'grey.50',
                        '& .status-icon': {
                            animation: `${iconPop} 0.4s ease-out`
                        }
                    }
                }}
            >
              <Typography variant="body2" color="text.secondary">
                Documents
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {verified ? (
                  <>
                    <CheckCircleOutlineIcon className="status-icon" sx={{ fontSize: 18, color: '#187604' }} />
                    <Typography variant="body2" fontWeight={600} color="#187604">
                      Approved
                    </Typography>
                  </>
                ) : hasSubmittedDocs ? (
                  <>
                    <AccessTimeIcon className="status-icon" sx={{ fontSize: 18, color: '#e8a710' }} />
                    <Typography variant="body2" fontWeight={600} color="#e8a710">
                      Submitted
                    </Typography>
                  </>
                ) : (
                  <>
                    <FileUploadOutlinedIcon className="status-icon" sx={{ fontSize: 18, color: 'error.main' }} />
                    <Typography variant="body2" fontWeight={600} color="error.main">
                      Missing
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
