import { useState } from 'react';
import { Box, Typography, Chip, IconButton, Tooltip } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CertificateContent, { CERT_W } from '@/Components/Mentor/Certificates/MentorCertificateContent';
import { fadeInUp, scaleIn, ripple } from './keyframes';

export const THUMB_W = 200;
export const THUMB_H = 145;

export default function CertThumb({ cert, active, onClick, onDelete, delay = 0 }) {
    const thumbScale = THUMB_W / CERT_W;
    const [hovered, setHovered] = useState(false);

    const dateLabel = cert.date_issued
        ? new Date(cert.date_issued).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : '';

    return (
        <Box
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{
                width: THUMB_W, flexShrink: 0, borderRadius: 2, overflow: 'hidden',
                border: active ? '2px solid #1e4d2b' : '2px solid transparent',
                boxShadow: active
                    ? '0 0 0 3px rgba(30,77,43,0.2),0 8px 24px rgba(0,0,0,0.12)'
                    : hovered ? '0 8px 28px rgba(0,0,0,0.15)' : '0 1px 4px rgba(0,0,0,0.1)',
                cursor: 'pointer', position: 'relative', bgcolor: '#fff',
                transition: 'box-shadow 0.3s,border-color 0.3s,transform 0.3s',
                transform: hovered ? 'translateY(-4px) scale(1.015)' : 'translateY(0) scale(1)',
                animation: `${fadeInUp} 0.45s ease ${delay}s both`,
            }}
        >
            {/* Layout chip */}
            <Chip
                label={cert.design_layout.toUpperCase()} size="small"
                sx={{
                    position: 'absolute', top: 6, left: 6, zIndex: 2,
                    bgcolor: hovered ? 'rgba(30,77,43,0.85)' : 'rgba(0,0,0,0.55)',
                    color: 'white', fontWeight: 700, fontSize: '0.6rem', letterSpacing: 0.8,
                    height: 18, transition: 'background 0.2s',
                }}
            />

            {/* Delete button */}
            <Tooltip title="Remove">
                <IconButton
                    size="small"
                    onClick={e => { e.stopPropagation(); onDelete(); }}
                    sx={{
                        position: 'absolute', top: 2, right: 2, zIndex: 2,
                        width: 22, height: 22, bgcolor: 'rgba(255,255,255,0.85)',
                        opacity: hovered ? 1 : 0,
                        transform: hovered ? 'scale(1)' : 'scale(0.5)',
                        transition: 'opacity 0.2s,transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                        '&:hover': { bgcolor: 'error.main', color: 'white' },
                        color: 'error.main',
                    }}
                >
                    <DeleteOutlineIcon sx={{ fontSize: 14 }} />
                </IconButton>
            </Tooltip>

            {/* Active dot indicator */}
            {active && (
                <Box sx={{
                    position: 'absolute', bottom: 42, left: '50%', transform: 'translateX(-50%)',
                    width: 7, height: 7, borderRadius: '50%', bgcolor: '#1e4d2b', zIndex: 2,
                    animation: `${scaleIn} 0.3s cubic-bezier(0.34,1.56,0.64,1) both`,
                    '&::after': {
                        content: '""', position: 'absolute', inset: -3, borderRadius: '50%',
                        border: '2px solid #1e4d2b',
                        animation: `${ripple} 1.5s ease infinite`,
                    },
                }} />
            )}

            {/* Thumbnail render */}
            <Box sx={{ height: THUMB_H, overflow: 'hidden', bgcolor: '#f5f5f5' }}>
                <Box sx={{
                    transform: `scale(${thumbScale})`, transformOrigin: 'top left',
                    width: CERT_W, pointerEvents: 'none',
                    filter: hovered ? 'brightness(1.03)' : 'brightness(1)',
                    transition: 'filter 0.3s',
                }}>
                    <CertificateContent
                        template={cert.design_layout}
                        palette={cert.color_palette}
                        courseName={cert.course?.title || ''}
                        instructorName={cert.course?.user?.name || ''}
                        dateLabel={dateLabel}
                        certId={`CRT-${cert.id}`}
                    />
                </Box>
            </Box>

            {/* Footer */}
            <Box sx={{
                px: 1.25, py: 0.75, borderTop: '1px solid #f0f0f0',
                bgcolor: hovered ? '#f9f9f9' : 'transparent', transition: 'background 0.2s',
            }}>
                <Typography variant="caption" fontWeight={600} noWrap display="block">
                    {cert.course?.title || 'Untitled Course'}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.65rem' }}>
                    {cert.date_issued
                        ? new Date(cert.date_issued).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                        : '—'}
                </Typography>
            </Box>
        </Box>
    );
}
