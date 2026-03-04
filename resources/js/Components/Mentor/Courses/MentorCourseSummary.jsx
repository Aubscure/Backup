import React from 'react';
import { Box, Typography, Paper, keyframes } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

// --- ANIMATIONS ---
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export default function CourseSummary({ duration, resources, modules }) {
  const items = [
    {
      label: 'Duration',
      value: duration,
      fallback: '-',
      icon: <AccessTimeIcon fontSize="small" />,
    },
    {
      label: 'Resources',
      value: resources,
      fallback: '-',
      icon: <InsertDriveFileIcon fontSize="small" />,
    },
    {
      label: 'Modules',
      value: modules,
      fallback: '-',
      icon: <ViewModuleIcon fontSize="small" />,
    },
  ];

  return (
    <Box sx={{ mt: 2, animation: `${fadeInUp} 0.6s ease-out` }}>
      <Paper
        elevation={1}
        sx={{
          p: 2, // Increased padding slightly for breathability
          borderRadius: 2,
          bgcolor: '#f7f9f7',
          width: '85%',
          border: '1px solid transparent',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'default',
          
          // Card Hover Effect
          '&:hover': {
            borderColor: '#c6e6c6',
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 20px -5px rgba(18, 108, 3, 0.15)', // Soft green shadow
          }
        }}
      >
        <Typography
          variant="caption"
          fontWeight="bold"
          sx={{
            mb: 2,
            textTransform: 'uppercase',
            color: 'text.secondary',
            display: 'block',
            letterSpacing: 0.5,
            fontSize: '0.7rem'
          }}
        >
          Course Summary
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {items.map((item, index) => (
            <Box
              key={item.label}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1,
                borderRadius: 1.5,
                position: 'relative',
                overflow: 'hidden',
                bgcolor: 'transparent',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                
                // Row Hover Effect
                '&:hover': { 
                    bgcolor: '#e0f2e9',
                    transform: 'translateX(4px)', // Slide right
                    paddingLeft: 2, // Make room for accent bar
                    
                    // The Accent Bar
                    '&::before': {
                        opacity: 1,
                    },

                    // Trigger Icon Animation
                    '& .summary-icon': {
                        transform: 'scale(1.2) rotate(-5deg)',
                        color: '#0f5102', // Darker green
                    },
                    
                    // Trigger Value Scale
                    '& .summary-value': {
                        transform: 'scale(1.05)',
                        color: '#0f5102'
                    }
                },
                
                // The pseudo-element accent bar (hidden by default)
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '15%',
                    bottom: '15%',
                    width: 3,
                    borderRadius: 4,
                    bgcolor: '#126c03',
                    opacity: 0,
                    transition: 'opacity 0.2s ease'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {/* Icon Wrapper for Animation Target */}
                <Box 
                    className="summary-icon"
                    sx={{ 
                        color: '#126c03', 
                        display: 'flex', 
                        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s' 
                    }}
                >
                    {item.icon}
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {item.label}
                </Typography>
              </Box>

              <Typography
                className="summary-value"
                variant="body2"
                fontWeight={700}
                sx={{
                  color: item.value ? 'text.primary' : 'text.disabled',
                  fontStyle: item.value ? 'normal' : 'italic',
                  fontSize: '0.85rem',
                  transition: 'transform 0.2s ease, color 0.2s ease'
                }}
              >
                {item.value || item.fallback}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}