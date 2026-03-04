import React, { useState, useEffect, useRef, memo } from 'react';
import { Box, Typography } from '@mui/material';
import LockIcon        from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CertificateContent, { CERT_W, CERT_H } from '@/Components/Mentor/Certificates/MentorCertificateContent';

/**
 * Renders the live CertificateContent scaled to fill any container width.
 * Uses ResizeObserver so it stays responsive on window resize.
 *
 * Always visible as a motivational preview.
 * Download is controlled externally (locked until course completion).
 */
const CertPreview = memo(({ template, palette, studentName, courseName, instructorName, isCompleted }) => {
    const wrapRef = useRef(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        const update = () => { const w = el.offsetWidth; if (w > 0) setScale(w / CERT_W); };
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    return (
        <Box ref={wrapRef} sx={{ width: '100%', position: 'relative' }}>
            {/* Aspect-ratio spacer keeps the outer box the right height */}
            <Box sx={{ height: CERT_H * scale }} />

            {/* Cert rendered at native size, scaled & centred via transform */}
            <Box sx={{
                position: 'absolute', top: 0,
                left: '50%',
                transform: `translateX(-50%) scale(${scale})`,
                transformOrigin: 'top center',
                width: CERT_W, height: CERT_H,
                pointerEvents: 'none',
            }}>
                <CertificateContent
                    template={template        || 'minimal'}
                    palette={palette          || 'sunset'}
                    studentName={studentName  || 'Your Name'}
                    courseName={courseName    || 'Course Title'}
                    instructorName={instructorName || 'Instructor'}
                    dateLabel={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    certId="CRT-XXXX-XXXX"
                />
            </Box>

            {/* "Complete to unlock" gradient ribbon — shown while not yet completed */}
            {!isCompleted && (
                <Box sx={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    py: 1.25, px: 2,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75,
                    pointerEvents: 'none',
                }}>
                    <LockIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.9)' }} />
                    <Typography variant="caption"
                        sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, letterSpacing: 0.4 }}>
                        Complete the course to download your certificate
                    </Typography>
                </Box>
            )}

            {/* "Earned" badge — shown once completed */}
            {isCompleted && (
                <Box sx={{
                    position: 'absolute', top: 12, right: 12,
                    bgcolor: 'success.main', borderRadius: 50,
                    px: 1.25, py: 0.4,
                    display: 'flex', alignItems: 'center', gap: 0.6,
                    boxShadow: '0 4px 12px rgba(76,175,80,0.4)',
                }}>
                    <CheckCircleIcon sx={{ fontSize: 13, color: '#fff' }} />
                    <Typography variant="caption"
                        sx={{ color: '#fff', fontWeight: 700, fontSize: '0.65rem', letterSpacing: 0.4 }}>
                        Earned
                    </Typography>
                </Box>
            )}
        </Box>
    );
});

export default CertPreview;