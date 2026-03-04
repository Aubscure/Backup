/**
 * ReviewStatusAlerts
 *
 * Animated alert banners shown above the preview card on the Review step.
 *
 * Two possible states (mutually exclusive):
 *   • allContentReady && !has_certificate → "Almost there!" info nudge
 *   • readyToPublish                      → "All requirements met!" success banner
 *
 * Uses MUI <Collapse> so banners mount/unmount with a smooth height
 * transition instead of an abrupt layout shift.  A CSS transform nudge
 * on enter gives extra polish with zero runtime cost.
 */

import { memo } from 'react';
import { Alert, Box, Collapse } from '@mui/material';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// Shared slide-down style applied to both alerts
const slideDown = {
    transition: 'transform .35s cubic-bezier(.34,1.56,.64,1), opacity .3s ease',
};

// ─── Individual alert wrappers ────────────────────────────────────────────────

const CertificateNudge = memo(function CertificateNudge({ show }) {
    return (
        <Collapse in={show} unmountOnExit timeout={350}>
            <Box sx={{ mb: 2, ...slideDown }}>
                <Alert
                    severity="info"
                    icon={<WorkspacePremiumIcon fontSize="inherit" />}
                    sx={{
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'info.light',
                        alignItems: 'flex-start',
                        '& .MuiAlert-icon': { mt: '2px' },
                        transition: 'box-shadow .25s',
                        '&:hover': { boxShadow: '0 4px 18px rgba(2,136,209,.12)' },
                    }}
                >
                    <strong>Almost there!</strong> Your course content is complete.
                    Save the course now, then head to <strong>Certificates</strong> to
                    design the completion certificate — after that you'll be able to publish.
                </Alert>
            </Box>
        </Collapse>
    );
});

const ReadyBanner = memo(function ReadyBanner({ show }) {
    return (
        <Collapse in={show} unmountOnExit timeout={400}>
            <Box sx={{ mb: 2, ...slideDown }}>
                <Alert
                    severity="success"
                    icon={<CheckCircleOutlineIcon fontSize="inherit" />}
                    sx={{
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'success.light',
                        alignItems: 'flex-start',
                        '& .MuiAlert-icon': { mt: '2px' },
                        transition: 'box-shadow .25s',
                        '&:hover': { boxShadow: '0 4px 18px rgba(46,125,50,.14)' },
                    }}
                >
                    <strong>All requirements met!</strong> Your course is ready to go live
                    whenever you are.
                </Alert>
            </Box>
        </Collapse>
    );
});

// ─── Exported composite ───────────────────────────────────────────────────────

const ReviewStatusAlerts = memo(function ReviewStatusAlerts({
    allContentReady,
    readyToPublish,
    hasCertificate,
}) {
    return (
        <Box>
            <CertificateNudge show={allContentReady && !hasCertificate} />
            <ReadyBanner      show={readyToPublish} />
        </Box>
    );
});

export default ReviewStatusAlerts;
