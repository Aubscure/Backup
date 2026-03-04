/**
 * ReviewPageHeader
 *
 * Wraps the shared <CoursePageHeader> for the Review wizard step.
 * Passes the animated DRAFT chip as the rightSlot so the layout
 * stays identical to every other wizard step.
 */

import { memo } from 'react';
import { Chip, keyframes } from '@mui/material';

import CoursePageHeader  from '@/Components/Mentor/Courses/CoursePageHeader';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';

// ─── subtle pulse so the chip never feels static ─────────────────────────────
const pulse = keyframes`
  0%,100% { box-shadow: 0 0 0 0 rgba(217,119,6,.35); }
  50%      { box-shadow: 0 0 0 6px rgba(217,119,6,0); }
`;

const AMBER = { 100: '#FEF3C7', 600: '#D97706' };

// ─── Chip shown in the header right slot ─────────────────────────────────────
const DraftChip = memo(function DraftChip() {
    return (
        <Chip
            label="DRAFT"
            sx={{
                bgcolor:       AMBER[100],
                color:         AMBER[600],
                fontWeight:    700,
                borderRadius:  1,
                letterSpacing: 0.8,
                fontSize:      '0.7rem',
                border:        `1px solid ${AMBER[600]}40`,
                animation:     `${pulse} 2.4s ease-in-out infinite`,
                transition:    'transform .2s, box-shadow .2s',
                '&:hover': {
                    transform:  'scale(1.06)',
                    bgcolor:    '#FDE68A',
                },
            }}
        />
    );
});

// ─── Page header ─────────────────────────────────────────────────────────────
const ReviewPageHeader = memo(function ReviewPageHeader({
    mounted,
    readyToPublish,
}) {
    const subtitle = readyToPublish
        ? 'Everything looks great — you can publish now or save as a draft.'
        : 'Check everything looks right, then save. You can publish once a certificate is designed.';

    return (
        <CoursePageHeader
            mounted={mounted}
            icon={FactCheckOutlinedIcon}
            title="Review & Save Course"
            subtitle={subtitle}
            rightSlot={<DraftChip />}
        />
    );
});

export default ReviewPageHeader;
