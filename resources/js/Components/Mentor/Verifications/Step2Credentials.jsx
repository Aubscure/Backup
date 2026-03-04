import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import {
  Box,
  Typography,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  keyframes,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import BadgeIcon from '@mui/icons-material/Badge';
import LanguageIcon from '@mui/icons-material/Language';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

import MentorComboField from './Credentials/MentorComboField';
import MentorTextField from './Credentials/MentorTextField';
import MentorArraySection from './Credentials/MentorArraySection';

// ── Keyframes ─────────────────────────────────────────────────────────────────

const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-16px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const iconSpin = keyframes`
  0%   { transform: rotate(0deg) scale(1); }
  25%  { transform: rotate(-12deg) scale(1.15); }
  75%  { transform: rotate(12deg) scale(1.15); }
  100% { transform: rotate(0deg) scale(1); }
`;

const underlineGrow = keyframes`
  from { transform: scaleX(0); opacity: 0; }
  to   { transform: scaleX(1); opacity: 1; }
`;

const badgePop = keyframes`
  0%   { transform: scale(0.8) rotate(-8deg); opacity: 0; }
  60%  { transform: scale(1.1) rotate(3deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(24,118,4,0); }
  50%       { box-shadow: 0 0 0 5px rgba(24,118,4,0.1); }
`;

const titleShimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// ── Mobile-only keyframes (injected once via <style>, zero runtime cost) ──────
const MOBILE_STYLES = `
  @keyframes xs-section-pop {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes xs-toggle-bounce {
    0%   { transform: scale(1); }
    40%  { transform: scale(1.04); }
    100% { transform: scale(1); }
  }
`;

// ── Prop safety helper ────────────────────────────────────────────────────────
// Inertia's Inertia::lazy() props arrive as `null` until the partial reload
// completes. JS destructuring defaults (= []) only fire for `undefined`, NOT
// for `null`, so null passes straight through and crashes Autocomplete.
// This helper guarantees we always hand arrays/objects to our field components.
function toArray(val) {
    if (Array.isArray(val)) return val;
    return [];
}

function toProfessionOptions(val) {
    if (!val || typeof val !== 'object') return [];
    if (Array.isArray(val)) return val;
    // object keyed by category → flatten
    return Object.values(val).flat();
}

// ── Animated Field Wrapper ────────────────────────────────────────────────────
function AnimatedField({ children, delay = 0 }) {
    return (
        <Box
            sx={{
                animation: `${fadeSlideUp} 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}ms both`,
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

// ── Section Header with hover animation ──────────────────────────────────────
function SectionHeader({ icon, title, delay = 0 }) {
    const [hovered, setHovered] = useState(false);

    return (
        <Box
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                mb: 2,
                animation: `${slideInLeft} 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}ms both`,
            }}
        >
            <Box display="flex" alignItems="center" gap={1.5}>
                <Box
                    sx={{
                        width: 34, height: 34, borderRadius: '9px',
                        background: hovered
                            ? 'linear-gradient(135deg, #187604 0%, #2ea80a 100%)'
                            : 'linear-gradient(135deg, rgba(24,118,4,0.1) 0%, rgba(24,118,4,0.06) 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                        boxShadow: hovered
                            ? '0 4px 14px rgba(24,118,4,0.3)'
                            : '0 2px 6px rgba(24,118,4,0.08)',
                        transform: hovered ? 'scale(1.12)' : 'scale(1)',
                    }}
                >
                    {React.cloneElement(icon, {
                        sx: {
                            color: hovered ? '#fff' : '#187604',
                            fontSize: 18,
                            transition: 'color 0.3s ease',
                            animation: hovered ? `${iconSpin} 0.5s ease` : 'none',
                        },
                    })}
                </Box>

                <Typography
                    variant="subtitle1"
                    fontWeight="700"
                    sx={{
                        color: '#187604',
                        letterSpacing: '0.01em',
                        background: hovered
                            ? 'linear-gradient(90deg, #187604 0%, #2ea80a 40%, #187604 100%)'
                            : 'none',
                        backgroundSize: hovered ? '200% auto' : undefined,
                        WebkitBackgroundClip: hovered ? 'text' : undefined,
                        WebkitTextFillColor: hovered ? 'transparent' : undefined,
                        animation: hovered ? `${titleShimmer} 1.5s linear infinite` : 'none',
                        transition: 'all 0.2s ease',
                    }}
                >
                    {title}
                </Typography>
            </Box>

            <Box
                sx={{
                    mt: 0.75, ml: 0.25, height: '2px', width: '100%', borderRadius: '2px',
                    background: 'linear-gradient(90deg, #187604 0%, rgba(24,118,4,0.15) 70%, transparent 100%)',
                    transformOrigin: 'left center',
                    animation: `${underlineGrow} 0.6s cubic-bezier(0.22,1,0.36,1) ${delay + 80}ms both`,
                    opacity: hovered ? 1 : 0.4,
                    transition: 'opacity 0.3s ease',
                }}
            />
        </Box>
    );
}

// ── License Type Toggle — responsive ─────────────────────────────────────────
// xs/sm: full-width pill, generous tap targets.
// md+:   original compact inline toggle, pixel-for-pixel identical.
function LicenseTypeToggle({ value, onChange }) {
    return (
        <Box mb={2}>
            <Typography variant="caption" color="text.secondary" display="block" mb={0.75}>
                Type
            </Typography>
            <ToggleButtonGroup
                exclusive
                size="small"
                value={value || 'license'}
                onChange={(_, val) => { if (val !== null) onChange(val); }}
                sx={{
                    width: { xs: '100%', md: 'auto' },
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '1.5px solid #e0e0e0',
                    '& .MuiToggleButtonGroup-grouped': {
                        border: 'none',
                        borderRadius: 0,
                    },
                    '& .MuiToggleButton-root': {
                        flex: { xs: 1, md: 'unset' },
                        px: { xs: 0, md: 2.5 },
                        py: { xs: 1, md: 0.5 },
                        textTransform: 'none',
                        fontSize: { xs: 14, md: 13 },
                        fontWeight: 500,
                        color: 'text.secondary',
                        transition: 'all 0.22s cubic-bezier(0.34,1.56,0.64,1)',
                        WebkitTapHighlightColor: 'transparent',
                        '&:hover': { background: 'rgba(24,118,4,0.06)', color: '#187604' },
                        '&:active': { transform: { xs: 'scale(0.97)', md: 'none' } },
                    },
                    '& .Mui-selected': {
                        bgcolor: '#187604 !important',
                        color: '#ffffff !important',
                        fontWeight: '600 !important',
                        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.15)',
                        animation: { xs: 'xs-toggle-bounce 0.3s cubic-bezier(0.34,1.56,0.64,1)', md: 'none' },
                    },
                }}
            >
                <ToggleButton value="license">License</ToggleButton>
                <ToggleButton value="certification">Certification</ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Step2Credentials({ form }) {
    // ── NULL-SAFE prop extraction ─────────────────────────────────────────────
    // WHY THIS MATTERS:
    //   Inertia::lazy() sends `null` as the placeholder until the partial
    //   reload resolves. JS destructuring `= []` defaults only fire on
    //   `undefined` — `null` passes right through. Passing `options={null}`
    //   to MUI Autocomplete silently breaks the dropdown.
    //
    //   We read raw values first, then normalise with our helpers so every
    //   downstream component always receives a valid array / flat list.
    const props = usePage().props;

    const educationLevelsOpts  = toArray(props.educationLevels);
    const educationFieldsOpts  = toArray(props.educationFields);
    const companyNamesOpts     = toArray(props.companyNames);
    const jobPositionsOpts     = toArray(props.jobPositions);
    const licensesOpts         = toArray(props.licenses);
    const professionOptions    = toProfessionOptions(props.professions);

    const { data, setData, errors } = form;
    const handleSetData = (key, val) => setData(key, val);

    return (
        <>
            <style>{MOBILE_STYLES}</style>

            {/*
                Desktop : original width={534}.
                xs / sm : full width, overflow-safe.
                          Padding provided by the parent dialog's p: { xs: 2 }.
            */}
            <Box
                xs={12} sm={10} md={8} lg={6}
                sx={{ width: { xs: '100%', md: 534 }, maxWidth: '100%' }}
            >

                {/* ── Header ───────────────────────────────────────────────── */}
                <Box sx={{ animation: `${fadeSlideUp} 0.5s cubic-bezier(0.22,1,0.36,1) both` }}>
                    <Box display="flex" alignItems="center" gap={1.5} mb={0.5}>
                        <Box
                            sx={{
                                width: { xs: 38, md: 42 }, height: { xs: 38, md: 42 },
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #187604 0%, #2ea80a 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 6px 18px rgba(24,118,4,0.32)',
                                animation: `${badgePop} 0.6s cubic-bezier(0.34,1.56,0.64,1) 100ms both`,
                                flexShrink: 0,
                            }}
                        >
                            <EmojiEventsIcon sx={{ color: '#fff', fontSize: { xs: 20, md: 22 } }} />
                        </Box>

                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            sx={{ fontSize: { xs: '1.1rem', md: '1.5rem' } }}
                        >
                            Professional Credentials
                        </Typography>
                    </Box>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: { xs: 3, md: 4 },
                            fontSize: { xs: '0.8rem', md: '0.875rem' },
                            animation: `${fadeSlideUp} 0.5s cubic-bezier(0.22,1,0.36,1) 80ms both`,
                        }}
                    >
                        Please provide details about your education, certifications, and work experience.
                    </Typography>
                </Box>

                {/* ── PROFESSION ───────────────────────────────────────────── */}
                <Box
                    mb={{ xs: 3, md: 4 }}
                    sx={{ animation: `${fadeSlideUp} 0.5s cubic-bezier(0.22,1,0.36,1) 120ms both` }}
                >
                    <AnimatedField>
                        <MentorComboField
                            label="Profession"
                            name="profession"
                            placeholder="Select or type your profession"
                            value={data.profession}
                            setData={handleSetData}
                            options={professionOptions}
                            errors={errors}
                        />
                    </AnimatedField>
                </Box>

                {/* ── EDUCATION ────────────────────────────────────────────── */}
                <Box sx={{ animation: `${fadeSlideUp} 0.5s cubic-bezier(0.22,1,0.36,1) 180ms both` }}>
                    <MentorArraySection
                        titleComponent={
                            <SectionHeader icon={<SchoolIcon />} title="Educational Background" delay={180} />
                        }
                        items={data.educations}
                        field="educations"
                        setData={setData}
                        blankItem={{ level: '', field_of_study: '' }}
                        addLabel="Add another education"
                        renderFields={(edu, i, updateItem) => (
                            <Grid
                                container
                                spacing={{ xs: 1.5, md: 2 }}
                                sx={data.educations.length > 1 ? { pr: { xs: 0, md: 4 } } : {}}
                            >
                                <Grid item xs={12} sm={6} width="100%">
                                    <AnimatedField delay={i * 40}>
                                        <MentorComboField
                                            label="Highest Educational Attainment"
                                            name={`educations.${i}.level`}
                                            value={edu.level}
                                            setData={(_, val) => updateItem(i, 'level', val)}
                                            options={educationLevelsOpts}
                                            errors={errors}
                                            required
                                        />
                                    </AnimatedField>
                                </Grid>
                                <Grid item xs={12} sm={6} width="100%">
                                    <AnimatedField delay={i * 40 + 60}>
                                        <MentorComboField
                                            label="Field of Study"
                                            name={`educations.${i}.field_of_study`}
                                            value={edu.field_of_study}
                                            setData={(_, val) => updateItem(i, 'field_of_study', val)}
                                            options={educationFieldsOpts}
                                            errors={errors}
                                            required
                                        />
                                    </AnimatedField>
                                </Grid>
                            </Grid>
                        )}
                    />
                </Box>

                {/* ── LICENSES & CERTIFICATIONS ────────────────────────────── */}
                <Box sx={{ animation: `${fadeSlideUp} 0.5s cubic-bezier(0.22,1,0.36,1) 260ms both` }}>
                    <MentorArraySection
                        titleComponent={
                            <SectionHeader icon={<BadgeIcon />} title="Licenses & Certifications" delay={260} />
                        }
                        items={data.licenses_and_certifications}
                        field="licenses_and_certifications"
                        setData={setData}
                        blankItem={{ type: 'license', name: '', credential_id_number: '' }}
                        addLabel="Add another license or certification"
                        renderFields={(lic, i, updateItem) => (
                            <Box sx={data.licenses_and_certifications.length > 1 ? { pr: { xs: 0, md: 4 } } : {}}>
                                <LicenseTypeToggle
                                    value={lic.type}
                                    onChange={(val) => updateItem(i, 'type', val)}
                                />
                                <Grid container spacing={{ xs: 1.5, md: 2 }}>
                                    <Grid item xs={12} sm={6} width="100%">
                                        <AnimatedField delay={i * 40}>
                                            <MentorComboField
                                                label={lic.type === 'certification' ? 'Certification Name' : 'License Name'}
                                                name={`licenses_and_certifications.${i}.name`}
                                                placeholder={
                                                    lic.type === 'certification'
                                                        ? 'e.g. AWS Certified Developer'
                                                        : 'e.g. Civil Engineer'
                                                }
                                                value={lic.name}
                                                setData={(_, val) => updateItem(i, 'name', val)}
                                                options={licensesOpts}
                                                errors={errors}
                                            />
                                        </AnimatedField>
                                    </Grid>
                                    <Grid item xs={12} sm={6} width="100%">
                                        <AnimatedField delay={i * 40 + 60}>
                                            <MentorTextField
                                                label="License / Credential ID"
                                                name={`licenses_and_certifications.${i}.credential_id_number`}
                                                placeholder="e.g. 0123456 (optional)"
                                                value={lic.credential_id_number}
                                                setData={(_, val) => updateItem(i, 'credential_id_number', val)}
                                                errors={errors}
                                            />
                                        </AnimatedField>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    />
                </Box>

                {/* ── WORK EXPERIENCE ──────────────────────────────────────── */}
                <Box sx={{ animation: `${fadeSlideUp} 0.5s cubic-bezier(0.22,1,0.36,1) 340ms both` }}>
                    <MentorArraySection
                        titleComponent={
                            <SectionHeader icon={<WorkIcon />} title="Work Experience" delay={340} />
                        }
                        items={data.employments}
                        field="employments"
                        setData={setData}
                        blankItem={{ company_name: '', position: '' }}
                        addLabel="Add another employer"
                        renderFields={(job, i, updateItem) => (
                            <Grid
                                container
                                spacing={{ xs: 1.5, md: 2 }}
                                sx={data.employments.length > 1 ? { pr: { xs: 0, md: 4 } } : {}}
                            >
                                <Grid item xs={12} sm={6} width="100%">
                                    <AnimatedField delay={i * 40}>
                                        <MentorComboField
                                            label="Company Name"
                                            name={`employments.${i}.company_name`}
                                            placeholder="Current or most recent"
                                            value={job.company_name}
                                            setData={(_, val) => updateItem(i, 'company_name', val)}
                                            options={companyNamesOpts}
                                            errors={errors}
                                            required
                                        />
                                    </AnimatedField>
                                </Grid>
                                <Grid item xs={12} sm={6} width="100%">
                                    <AnimatedField delay={i * 40 + 60}>
                                        <MentorComboField
                                            label="Position / Job Title"
                                            name={`employments.${i}.position`}
                                            placeholder="e.g. Senior Developer"
                                            value={job.position}
                                            setData={(_, val) => updateItem(i, 'position', val)}
                                            options={jobPositionsOpts}
                                            errors={errors}
                                            required
                                        />
                                    </AnimatedField>
                                </Grid>
                            </Grid>
                        )}
                    />
                </Box>

                {/* ── ONLINE PROFILE ───────────────────────────────────────── */}
                <Box sx={{ animation: `${fadeSlideUp} 0.5s cubic-bezier(0.22,1,0.36,1) 420ms both` }}>
                    <MentorArraySection
                        titleComponent={
                            <Box>
                                <SectionHeader icon={<LanguageIcon />} title="Online Profile" delay={420} />
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                    mb={2}
                                    mt={-1}
                                    sx={{ fontSize: { xs: '0.72rem', md: '0.75rem' } }}
                                >
                                    Add your LinkedIn, GitHub, portfolio, or any professional link.
                                </Typography>
                            </Box>
                        }
                        items={data.user_links}
                        field="user_links"
                        setData={setData}
                        blankItem={{ url: '' }}
                        addLabel="Add another link"
                        renderFields={(link, i, updateItem) => (
                            <Box sx={data.user_links.length > 1 ? { pr: { xs: 0, md: 4 } } : {}}>
                                <AnimatedField delay={i * 40}>
                                    <MentorTextField
                                        label="Profile / Portfolio URL"
                                        name={`user_links.${i}.url`}
                                        placeholder="https://linkedin.com/in/yourname"
                                        value={link.url}
                                        setData={(_, val) => updateItem(i, 'url', val)}
                                        errors={errors}
                                        type="url"
                                        inputMode="url"
                                        autoCapitalize="none"
                                        autoCorrect="off"
                                    />
                                </AnimatedField>
                            </Box>
                        )}
                    />
                </Box>

            </Box>
        </>
    );
}
