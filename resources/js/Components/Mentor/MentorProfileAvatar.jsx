import React from 'react';
import { Avatar, Box, keyframes } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';

// --- ANIMATIONS ---

const popIn = keyframes`
  0% { transform: scale(0) rotate(-45deg); opacity: 0; }
  80% { transform: scale(1.2) rotate(10deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`;

const ripple = keyframes`
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(2.4); opacity: 0; }
`;

const breathe = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(224, 170, 13, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(224, 170, 13, 0); }
  100% { box-shadow: 0 0 0 0 rgba(224, 170, 13, 0); }
`;

const tickTock = keyframes`
  0% { transform: rotate(-10deg); }
  50% { transform: rotate(10deg); }
  100% { transform: rotate(-10deg); }
`;

export default function ProfileAvatar({
  size = 80,
  src = null,
  user = null,
}) {
  // --- AUTO COMPUTE STATUS ---
  const isVerified =
    user?.is_verified === 1 ||
    user?.is_verified === true ||
    user?.is_verified === 'true';

  const hasSubmitted =
    !isVerified &&
    (user?.verification_documents_count ?? 0) > 0;

  // --- STYLE LOGIC ---
  let outlineColor = '#bdbdbd';
  let badgeIcon = null;
  let badgeBg = '#bdbdbd';
  let badgeAnimation = `${popIn} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
  let avatarAnimation = 'none';
  let iconAnimation = 'none';

  if (isVerified) {
    outlineColor = '#2e7d32'; 
    badgeBg = '#2e7d32';
    badgeIcon = <CheckIcon sx={{ fontSize: size * 0.18, color: 'white' }} />;
  } else if (hasSubmitted) {
    outlineColor = '#e8a710'; 
    badgeBg = '#e8a710';
    badgeIcon = <AccessTimeIcon sx={{ fontSize: size * 0.18, color: 'white' }} />;
    avatarAnimation = `${breathe} 2s infinite`; 
    iconAnimation = `${tickTock} 2s infinite ease-in-out`; 
  }

  const badgeSize = size * 0.35;

  return (
    <Box 
      sx={{ 
        position: 'relative', 
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        
        // PARENT HOVER LOGIC
        '&:hover': {
          transform: 'scale(1.05)', 
          cursor: 'pointer',
          // TARGETING THE CHILD CLASS HERE
          '& .verified-ripple': {
             animation: `${ripple} 1.5s infinite ease-out` 
          }
        }
      }}
    >
      {/* 1. Background Ripple (Only if Verified) */}
      {isVerified && (
        <Box
          className="verified-ripple" // Class name added for targeting
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            // Animation removed from here; it is now controlled by parent hover
            border: `1px solid ${outlineColor}`,
            opacity: 0, // Remains invisible until animation is triggered
            zIndex: 0,
          }}
        />
      )}

      {/* 2. The Main Avatar */}
      <Avatar
        src={src}
        alt={user?.firstname || "User"}
        sx={{
          width: size,
          height: size,
          border: `3px solid ${outlineColor}`,
          bgcolor: 'background.paper',
          color: 'text.secondary',
          animation: avatarAnimation,
          zIndex: 1,
          transition: 'border-color 0.3s ease',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        {!src && <PersonIcon sx={{ fontSize: size / 1.8 }} />}
      </Avatar>

      {/* 3. The Status Badge */}
      {(isVerified || hasSubmitted) && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: badgeSize,
            height: badgeSize,
            borderRadius: '50%',
            bgcolor: badgeBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid white', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            zIndex: 2,
            animation: badgeAnimation, 
            
            '& svg': {
                animation: iconAnimation 
            }
          }}
        >
          {badgeIcon}
        </Box>
      )}
    </Box>
  );
}