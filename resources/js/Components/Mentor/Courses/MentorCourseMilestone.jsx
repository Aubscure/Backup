import React, { useState, useEffect, useRef } from 'react';
import {
    Stepper,
    Step,
    StepLabel,
    Typography,
    Box,
    keyframes,
    styled
} from '@mui/material';

// ── Keyframe Animations ────────────────────────────────────────────────────────

const checkPop = keyframes`
  0%   { transform: scale(0) rotate(-180deg); opacity: 0; }
  60%  { transform: scale(1.3) rotate(10deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`;

const pulseRing = keyframes`
  0%   { transform: scale(0.8); opacity: 0.8; }
  50%  { transform: scale(1.6); opacity: 0; }
  100% { transform: scale(0.8); opacity: 0; }
`;

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const floatUp = keyframes`
  0%   { transform: translateY(0px); }
  50%  { transform: translateY(-4px); }
  100% { transform: translateY(0px); }
`;

const connectorFill = keyframes`
  0%   { width: 0%; opacity: 0.3; }
  100% { width: 100%; opacity: 1; }
`;

const glowPulse = keyframes`
  0%, 100% { filter: drop-shadow(0 0 4px rgba(46,125,50,0.4)); }
  50%       { filter: drop-shadow(0 0 12px rgba(46,125,50,0.9)) drop-shadow(0 0 20px rgba(129,199,132,0.5)); }
`;

const labelReveal = keyframes`
  0%   { opacity: 0; transform: translateY(6px); }
  100% { opacity: 1; transform: translateY(0px); }
`;

const progressBeam = keyframes`
  0%   { transform: translateX(-100%); opacity: 0; }
  30%  { opacity: 1; }
  100% { transform: translateX(300%); opacity: 0; }
`;

const iconEntrance = keyframes`
  0%   { transform: scale(0) rotate(-90deg); opacity: 0; }
  70%  { transform: scale(1.1) rotate(5deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`;

const orbitalSpin = keyframes`
  0%   { transform: rotate(0deg) translateX(18px) rotate(0deg); opacity: 0.6; }
  100% { transform: rotate(360deg) translateX(18px) rotate(-360deg); opacity: 0.6; }
`;

const dotBlink = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.6); }
`;

// ── Styled Components ──────────────────────────────────────────────────────────

const WrapperBox = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '100%',
    borderRadius: 20,
    background: 'linear-gradient(135deg, #f0faf000 0%, #e8f5e900 40%, #f1f8e900 100%)',
    boxShadow: '0 8px 40px rgba(46,125,50,0.10), 0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid rgba(129,199,132,0.25)',
    overflow: 'visible',
    '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        borderRadius: 20,
        background: 'linear-gradient(120deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 60%)',
        pointerEvents: 'none',
        zIndex: 0,
    },
}));

const StyledStepper = styled(Stepper)(({ theme }) => ({
    paddingTop: theme.spacing(3.5),
    paddingBottom: theme.spacing(3.5),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    position: 'relative',
    zIndex: 1,
    '& .MuiStepConnector-line': {
        transition: 'border-color 0.6s ease',
        borderTopWidth: 2.5,
        borderRadius: 2,
        position: 'relative',
        overflow: 'visible',
    },
    '& .MuiStepConnector-root': {
        top: 21,
    },
    '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
        borderColor: '#2e7d32',
        boxShadow: '0 0 6px rgba(46,125,50,0.4)',
    },
    '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
        borderImage: 'linear-gradient(90deg, #2e7d32 0%, #81c784 60%, #c8e6c9 100%) 1',
    },
}));

const StepIconWrapper = styled(Box, {
    shouldForwardProp: p => !['isActive', 'isCompleted', 'stepIndex'].includes(p)
})(({ isActive, isCompleted, stepIndex }) => ({
    position: 'relative',
    width: 44,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    cursor: 'default',
    transition: 'all 0.5s cubic-bezier(0.34,1.56,0.64,1)',
    zIndex: 2,
    background: isCompleted
        ? 'linear-gradient(135deg, #2e7d32, #43a047)'
        : isActive
            ? 'linear-gradient(135deg, #388e3c, #66bb6a)'
            : 'linear-gradient(135deg, #f5f5f5, #eeeeee)',
    boxShadow: isActive
        ? '0 0 0 3px rgba(46,125,50,0.2), 0 4px 16px rgba(46,125,50,0.3)'
        : isCompleted
            ? '0 2px 12px rgba(46,125,50,0.35)'
            : '0 1px 6px rgba(0,0,0,0.1)',
    animation: isCompleted
        ? `${iconEntrance} 0.5s cubic-bezier(0.34,1.56,0.64,1) ${stepIndex * 0.08}s both`
        : isActive
            ? `${glowPulse} 2.5s ease-in-out infinite`
            : 'none',
    transform: isActive ? 'scale(1.18)' : 'scale(1)',
    '&:hover': {
        transform: isActive ? 'scale(1.24)' : isCompleted ? 'scale(1.1)' : 'scale(1.05)',
        boxShadow: isActive
            ? '0 0 0 4px rgba(46,125,50,0.25), 0 6px 20px rgba(46,125,50,0.4)'
            : isCompleted
                ? '0 4px 18px rgba(46,125,50,0.5)'
                : '0 2px 10px rgba(0,0,0,0.15)',
    },
}));

const PulseRing = styled(Box)(({ delay = 0 }) => ({
    position: 'absolute',
    inset: -4,
    borderRadius: '50%',
    border: '2px solid rgba(46,125,50,0.5)',
    animation: `${pulseRing} 2.2s cubic-bezier(0.4,0,0.6,1) ${delay}s infinite`,
    pointerEvents: 'none',
}));

const OrbDot = styled(Box)(({ orbitDelay = 0 }) => ({
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: '50%',
    background: 'radial-gradient(circle, #81c784, #2e7d32)',
    top: '50%',
    left: '50%',
    marginTop: -2.5,
    marginLeft: -2.5,
    animation: `${orbitalSpin} 3s linear ${orbitDelay}s infinite`,
    boxShadow: '0 0 4px rgba(46,125,50,0.6)',
    pointerEvents: 'none',
}));

const StepNumberText = styled(Typography, {
    shouldForwardProp: p => !['isActive', 'isCompleted'].includes(p)
})(({ isActive, isCompleted }) => ({
    fontSize: isActive ? '0.85rem' : '0.8rem',
    fontWeight: 700,
    lineHeight: 1,
    color: isCompleted || isActive ? '#fff' : '#9e9e9e',
    transition: 'all 0.3s ease',
    fontFamily: '"DM Mono", "Fira Code", monospace',
    letterSpacing: '-0.5px',
}));

const CheckMark = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: `${checkPop} 0.45s cubic-bezier(0.34,1.56,0.64,1) both`,
    '& svg': {
        width: 20,
        height: 20,
        fill: 'none',
        stroke: '#fff',
        strokeWidth: 2.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
    },
}));

const LabelTypography = styled(Typography, {
    shouldForwardProp: p => !['isActive', 'isCompleted', 'stepIndex'].includes(p)
})(({ isActive, isCompleted, stepIndex }) => ({
    fontFamily: '"DM Sans", "Nunito", sans-serif',
    fontSize: isActive ? '0.78rem' : '0.72rem',
    fontWeight: isActive ? 700 : isCompleted ? 600 : 500,
    letterSpacing: isActive ? '0.04em' : '0.02em',
    textTransform: isActive ? 'uppercase' : 'none',
    transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
    color: isActive ? '#1b5e20' : isCompleted ? '#2e7d32' : '#9e9e9e',
    animation: `${labelReveal} 0.4s ease ${0.1 + stepIndex * 0.06}s both`,
    display: 'inline-block',
    position: 'relative',
    transform: isActive ? 'scale(1.06)' : 'scale(1)',
    '&::after': isActive ? {
        content: '""',
        position: 'absolute',
        background: 'linear-gradient(90deg, transparent, #43a047, transparent)',
        animation: `${shimmer} 2s linear infinite`,
        backgroundSize: '200% auto',
    } : {},
}));

const ProgressTrackOuter = styled(Box)(() => ({
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 3,
    borderRadius: 2,
    background: 'rgba(46,125,50,0.1)',
    overflow: 'hidden',
}));

const ProgressTrackFill = styled(Box, {
    shouldForwardProp: p => p !== 'progress'
})(({ progress }) => ({
    height: '100%',
    borderRadius: 2,
    background: 'linear-gradient(90deg, #2e7d32, #66bb6a, #a5d6a7)',
    backgroundSize: '200% auto',
    width: `${progress}%`,
    transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
    animation: `${shimmer} 3s linear infinite`,
    position: 'relative',
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: 40,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
        animation: `${progressBeam} 2s ease-in-out infinite`,
    }
}));

const ActiveDotRow = styled(Box)(() => ({
    display: 'flex',
    gap: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    height: 8,
}));

const BlinkDot = styled(Box)(({ dotDelay = 0 }) => ({
    width: 3,
    height: 3,
    borderRadius: '50%',
    background: '#66bb6a',
    animation: `${dotBlink} 1.2s ease-in-out ${dotDelay}s infinite`,
}));

// ── Custom Step Icon ───────────────────────────────────────────────────────────

const CustomStepIcon = ({ active, completed, icon }) => {
    const stepIndex = Number(icon) - 1;
    return (
        <StepIconWrapper isActive={active} isCompleted={completed} stepIndex={stepIndex}>
            {active && (
                <>
                    <PulseRing delay={0} />
                    <PulseRing delay={0.7} />
                </>
            )}
            {completed ? (
                <CheckMark>
                    <svg viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </CheckMark>
            ) : (
                <StepNumberText isActive={active} isCompleted={completed}>
                    {String(icon).padStart(2, '0')}
                </StepNumberText>
            )}
        </StepIconWrapper>
    );
};

// ── Main Component ─────────────────────────────────────────────────────────────

const MentorCourseMilestone = ({ currentStep = 0 }) => {
    const STEPS = ['Details', 'Syllabus', 'Media Content', 'Pricing', 'Review'];
    const progress = (currentStep / (STEPS.length - 1)) * 100;

    return (
        <Box sx={{ width: '100%', mx: 'auto', position: 'relative' }}>
            <WrapperBox>
                <StyledStepper activeStep={currentStep} alternativeLabel>
                    {STEPS.map((label, idx) => {
                        const isActive = idx === currentStep;
                        const isCompleted = idx < currentStep;
                        return (
                            <Step key={label} completed={isCompleted}>
                                <StepLabel
                                    StepIconComponent={(props) => (
                                        <CustomStepIcon {...props} icon={idx + 1} />
                                    )}
                                    sx={{
                                        '& .MuiStepLabel-label': {
                                            mt: 1,
                                        },
                                    }}
                                >
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <LabelTypography isActive={isActive} isCompleted={isCompleted} stepIndex={idx}>
                                            {label}
                                        </LabelTypography>
                                    </Box>
                                </StepLabel>
                            </Step>
                        );
                    })}
                </StyledStepper>
            </WrapperBox>
        </Box>
    );
};

export default MentorCourseMilestone;
