import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Stack,
  Divider,
  FormControlLabel,
  Checkbox,
  keyframes,
} from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import MentorFormField from './PersonalDetails/MentorFormField';

// ── Keyframes ─────────────────────────────────────────────────────────────────

const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const fadeSlideLeft = keyframes`
  from { opacity: 0; transform: translateX(-18px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const fadeSlideRight = keyframes`
  from { opacity: 0; transform: translateX(18px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const drawLine = keyframes`
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
`;

const floatIcon = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50%       { transform: translateY(-4px) rotate(6deg); }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(24,118,4,0); }
  50%       { box-shadow: 0 0 0 6px rgba(24,118,4,0.12); }
`;

const checkBounce = keyframes`
  0%   { transform: scale(1); }
  30%  { transform: scale(1.35); }
  60%  { transform: scale(0.88); }
  100% { transform: scale(1); }
`;

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// ── Animated Field Wrapper ────────────────────────────────────────────────────
function AnimatedField({ children, delay = 0, direction = 'up' }) {
  const anim = direction === 'left' ? fadeSlideLeft : direction === 'right' ? fadeSlideRight : fadeSlideUp;
  return (
    <Box
      sx={{
        animation: `${anim} 0.55s cubic-bezier(0.22,1,0.36,1) both`,
        animationDelay: `${delay}ms`,
        '& .MuiOutlinedInput-root': {
          transition: 'all 0.25s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#187604',
              borderWidth: '1.5px',
            },
          },
          '&.Mui-focused': {
            animation: `${glowPulse} 2s ease-in-out infinite`,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#187604',
              borderWidth: '2px',
            },
          },
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: '#187604',
        },
      }}
    >
      {children}
    </Box>
  );
}

// ── Gender Option Card ────────────────────────────────────────────────────────
function GenderCard({ label, value, checked, onChange }) {
  return (
    <Box
      onClick={() => onChange(value)}
      sx={{
        display: 'flex', alignItems: 'center', gap: 1,
        justifyContent: {xs: 'center', sm: 'center', md: 'flex-start'},
        px: 2.5, py: 1.25,
        border: '1.5px solid',
        borderColor: checked ? '#187604' : '#e0e0e0',
        borderRadius: '12px', cursor: 'pointer',
        position: 'relative', overflow: 'hidden',
        background: checked
          ? 'linear-gradient(135deg, rgba(24,118,4,0.06) 0%, rgba(24,118,4,0.02) 100%)'
          : '#fafafa',
        transition: 'all 0.28s cubic-bezier(0.34,1.56,0.64,1)',
        transform: checked ? 'scale(1.04)' : 'scale(1)',
        boxShadow: checked
          ? '0 4px 16px rgba(24,118,4,0.18), inset 0 0 0 1px rgba(24,118,4,0.1)'
          : '0 1px 3px rgba(0,0,0,0.06)',
        '&:hover': {
          borderColor: '#187604', transform: 'scale(1.03)',
          boxShadow: '0 4px 14px rgba(24,118,4,0.14)',
        },
        '&:active': { transform: 'scale(0.97)' },
        '&::before': checked
          ? {
              content: '""', position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, transparent 0%, rgba(24,118,4,0.06) 50%, transparent 100%)',
              backgroundSize: '200% auto',
              animation: `${shimmer} 2.5s linear infinite`,
            }
          : {},
      }}
    >
      <FormControlLabel
        sx={{ m: 0, pointerEvents: 'none' }}
        control={
          <Checkbox
            checked={checked}
            icon={<RadioButtonUncheckedIcon sx={{ color: '#bdbdbd', fontSize: 20 }} />}
            checkedIcon={
              <CheckCircleIcon sx={{
                color: '#187604', fontSize: 20,
                animation: checked ? `${checkBounce} 0.45s cubic-bezier(0.34,1.56,0.64,1)` : 'none',
              }} />
            }
            sx={{ p: 0 }}
          />
        }
        label={
          <Typography variant="body2" fontWeight={checked ? 600 : 400} sx={{
            color: checked ? '#187604' : 'text.secondary',
            transition: 'all 0.22s ease', ml: 0.5,
          }}>
            {label}
          </Typography>
        }
      />
    </Box>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Step1PersonalDetails({ form }) {
  const { data, setData, errors } = form;
  const [headerHovered, setHeaderHovered] = useState(false);

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.75, animation: `${fadeSlideLeft} 0.5s cubic-bezier(0.22,1,0.36,1) both` }}
        onMouseEnter={() => setHeaderHovered(true)}
        onMouseLeave={() => setHeaderHovered(false)}
      >
        <Box sx={{
          width: 38, height: 38, borderRadius: '10px',
          background: 'linear-gradient(135deg, #187604 0%, #2ea80a 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(24,118,4,0.3)',
          animation: headerHovered ? `${floatIcon} 1.4s ease-in-out infinite` : 'none',
          transition: 'box-shadow 0.3s ease',
          '&:hover': { boxShadow: '0 6px 20px rgba(24,118,4,0.4)' },
        }}>
          <PersonIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        <Typography variant="h6" fontWeight="bold">Personal Information</Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, animation: `${fadeSlideLeft} 0.5s cubic-bezier(0.22,1,0.36,1) 60ms both` }}>
        Please confirm your personal details.
      </Typography>

      <Box sx={{ mb: 4, animation: `${fadeSlideUp} 0.4s ease 80ms both` }}>
        <Divider sx={{
          '&::before, &::after': { display: 'none' },
          height: '2px',
          background: 'linear-gradient(90deg, #187604 0%, rgba(24,118,4,0.2) 60%, transparent 100%)',
          border: 'none', borderRadius: '4px', transformOrigin: 'left center',
          animation: `${drawLine} 0.7s cubic-bezier(0.22,1,0.36,1) 150ms both`,
        }} />
      </Box>

      <Grid container spacing={3}>
        {/* LEFT COLUMN */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={3}>
            {/*
              * FIX: readOnly={true} — firstname and lastname come from the users
              * table (set at registration). UserDetailRequest::toUserDetailData()
              * deliberately excludes them, so any edits would be silently dropped.
              * readOnly makes the intent clear and prevents confusing UX.
              */}
            <AnimatedField delay={120} direction="left">
              <MentorFormField
                label="First Name"
                name="firstname"
                value={data.firstname}
                setData={setData}
                errors={errors}
                readOnly
              />
            </AnimatedField>

            <AnimatedField delay={200} direction="left">
              <MentorFormField
                label="Middle Name (Optional)"
                name="middlename"
                value={data.middlename}
                setData={setData}
                errors={errors}
                placeholder="Santos"
              />
            </AnimatedField>

            <AnimatedField delay={280} direction="left">
              <MentorFormField
                label="Date of Birth"
                name="birthdate"
                type="date"
                value={data.birthdate}
                setData={setData}
                errors={errors}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </AnimatedField>
          </Stack>
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={3}>
            <AnimatedField delay={160} direction="right">
              <MentorFormField
                label="Last Name"
                name="lastname"
                value={data.lastname}
                setData={setData}
                errors={errors}
                readOnly
              />
            </AnimatedField>

            <AnimatedField delay={240} direction="right">
              <MentorFormField
                label="Suffix (Optional)"
                name="suffix"
                value={data.suffix}
                setData={setData}
                select
                options={[
                  { value: 'None', label: 'None' },
                  { value: 'Jr.', label: 'Jr.' },
                  { value: 'Sr.', label: 'Sr.' },
                  { value: 'III', label: 'III' },
                ]}
              />
            </AnimatedField>

            {/* Gender */}
            <Box sx={{ animation: `${fadeSlideRight} 0.55s cubic-bezier(0.22,1,0.36,1) 320ms both` }}>
              <Typography variant="body2" sx={{ mb: 1.25, color: 'text.secondary', fontWeight: 500, letterSpacing: '0.01em' }}>
                Gender
              </Typography>
              <Stack direction="row" spacing={1.5}>
                <GenderCard label="Male"   value="male"   checked={data.gender === 'male'}   onChange={(v) => setData('gender', v)} />
                <GenderCard label="Female" value="female" checked={data.gender === 'female'} onChange={(v) => setData('gender', v)} />
              </Stack>
            </Box>
          </Stack>
        </Grid>

        {/* PHONE */}
        <Grid size={12}>
          <AnimatedField delay={380}>
            <MentorFormField
              label="Phone Number"
              name="phone_number"
              value={data.phone_number}
              setData={setData}
              errors={errors}
              placeholder="912 345 6789"
              startAdornment="+63"
            />
          </AnimatedField>
        </Grid>

        {/* ADDRESS */}
        <Grid size={12}>
          <AnimatedField delay={440}>
            <MentorFormField
              label="Current Address"
              name="address"
              value={data.address}
              setData={setData}
              errors={errors}
              placeholder="House No., Street Name, Barangay, City, Province"
              multiline
              rows={3}
            />
          </AnimatedField>
        </Grid>
      </Grid>
    </Box>
  );
}
