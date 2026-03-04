import React, { useState, useEffect, useMemo } from 'react';
import WarningModal from '../../WarningModal';
import { useForm, router } from '@inertiajs/react';
import {
    Dialog,
    Box,
    Typography,
    Button,
    useTheme,
    useMediaQuery,
    Paper,
    Fade,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Step1PersonalDetails from './Step1PersonalDetails';
import Step2Credentials from './Step2Credentials';
import Step3Documents from './Step3Documents';

// ── Storage helpers ───────────────────────────────────────────────────────────
// Keys are scoped by user ID so different accounts on the same browser
// never share cached form data.
const makeStorage = (userId) => ({
    step:  `ev_step_u${userId}`,
    form1: `ev_form1_u${userId}`,
    form2: `ev_form2_u${userId}`,
});

const safeGet = (key) => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
};

const safeSet = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
};

const safeClearAll = (storage) => {
    try { Object.values(storage).forEach((k) => localStorage.removeItem(k)); } catch {}
};

// ── Step 2 lazy prop keys — must match DashboardController exactly ────────────
const STEP2_PROPS = [
    'educationLevels', 'educationFields', 'companyNames',
    'jobPositions', 'licenses', 'professions', 'platforms',
];

// ── Steps definition ──────────────────────────────────────────────────────────
const STEPS = [
    { number: '1', title: 'Identification' },
    { number: '2', title: 'Credentials'    },
    { number: '3', title: 'Acknowledgment' },
];

function stepStatus(stepNumber, currentStep) {
    if (currentStep > stepNumber) return 'completed';
    if (currentStep === stepNumber) return 'active';
    return 'pending';
}

// ── Sidebar vertical item (desktop — untouched) ───────────────────────────────
function SidebarItem({ number, title, status, isLast }) {
    const isActive    = status === 'active';
    const isCompleted = status === 'completed';

    return (
        <Box sx={{ display: 'flex', mb: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2 }}>
                <Box sx={{
                    width: 32, height: 32, borderRadius: '50%',
                    bgcolor: isActive || isCompleted ? '#187604' : '#e0e0e0',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', fontSize: 14, zIndex: 2, transition: 'background-color 0.3s',
                }}>
                    {isCompleted ? <CheckCircleIcon fontSize="small" /> : number}
                </Box>
                {!isLast && (
                    <Box sx={{
                        width: 2, flexGrow: 1, minHeight: 40,
                        bgcolor: isCompleted ? '#187604' : '#e0e0e0',
                        my: 0.5, transition: 'background-color 0.3s',
                    }} />
                )}
            </Box>
            <Box sx={{ pb: 4, pt: { xs: 2, sm: 2, md: 0} }}>
                <Typography
                    variant="subtitle1"
                    fontWeight={isActive ? 500 : 400}
                    color={isActive ? '#187604' : 'text.primary'}
                >
                    {title}
                </Typography>
                <Typography
                    variant="caption"
                    sx={{ color: isActive ? '#187604' : 'text.secondary', fontWeight: isActive ? 'bold' : 'normal' }}
                >
                    {isActive ? 'In Progress' : isCompleted ? 'Completed' : 'Pending'}
                </Typography>
            </Box>
        </Box>
    );
}

// ── Mobile Horizontal Stepper (xs / sm only) ──────────────────────────────────
// Keyframes injected via <style> — no extra library, zero bundle cost.
const MOBILE_STEPPER_STYLES = `
    @keyframes ev-node-pop {
        0%   { transform: scale(0.7); opacity: 0; }
        65%  { transform: scale(1.18);             }
        100% { transform: scale(1);   opacity: 1; }
    }
    @keyframes ev-pulse-ring {
        0%   { transform: scale(1);    opacity: 0.55; }
        70%  { transform: scale(1.75); opacity: 0;    }
        100% { transform: scale(1.75); opacity: 0;    }
    }
    @keyframes ev-track-fill {
        from { transform: scaleX(0); }
        to   { transform: scaleX(1); }
    }
    @keyframes ev-bar-slide {
        from { opacity: 0; transform: translateY(-6px); }
        to   { opacity: 1; transform: translateY(0);    }
    }
    @keyframes ev-label-fade {
        from { opacity: 0; transform: translateY(4px); }
        to   { opacity: 1; transform: translateY(0);   }
    }
`;

function MobileStepperBar({ currentStep }) {
    return (
        <>
            <style>{MOBILE_STEPPER_STYLES}</style>

            <Box sx={{
                display: { xs: 'block', md: 'none' },
                bgcolor: '#f8fdf7',
                borderBottom: '1px solid rgba(24,118,4,0.1)',
                px: 2.5, pt: 2, pb: 1.75,
                animation: 'ev-bar-slide 0.35s cubic-bezier(0.22,1,0.36,1) both',
            }}>
                {/* Top row: title + step badge */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.75, }}>
                    <Typography sx={{
                        fontWeight: 600, fontSize: '0.7rem',
                        letterSpacing: '0.09em', textTransform: 'uppercase',
                        color: '#187604', lineHeight: 1,
                    }}>
                        Expertise Verification
                    </Typography>
                </Box>

                {/* Nodes + connectors */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', }}>
                    {STEPS.map((s, idx) => {
                        const status      = stepStatus(idx + 1, currentStep);
                        const isActive    = status === 'active';
                        const isCompleted = status === 'completed';
                        const isLast      = idx === STEPS.length - 1;

                        return (
                            <React.Fragment key={s.number}>
                                <Box sx={{
                                    display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', gap: 0.6, flexShrink: 0,
                                    animation: `ev-node-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) ${idx * 60}ms both`,
                                }}>
                                    <Box sx={{ position: 'relative', width: 34, height: 34,  }}>
                                        {isActive && (
                                            <Box sx={{
                                                position: 'absolute', inset: 0, borderRadius: '50%',
                                                bgcolor: 'rgba(24,118,4,0.22)',
                                                animation: 'ev-pulse-ring 1.9s cubic-bezier(0.4,0,0.6,1) infinite',
                                                pointerEvents: 'none',
                                            }} />
                                        )}
                                        <Box sx={{
                                            position: 'relative', zIndex: 1,
                                            width: 34, height: 34, borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 500, fontSize: 13, color: '#fff',
                                            bgcolor: isActive || isCompleted ? '#187604' : '#d4d4d4',
                                            transform: isActive ? 'scale(1.1)' : 'scale(1)',
                                            transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), background-color 0.3s, box-shadow 0.3s',
                                            boxShadow: isActive
                                                ? '0 0 0 3px rgba(24,118,4,0.18), 0 4px 14px rgba(24,118,4,0.32)'
                                                : isCompleted ? '0 2px 8px rgba(24,118,4,0.22)' : 'none',
                                        }}>
                                            {isCompleted ? <CheckCircleIcon sx={{ fontSize: 18 }} /> : s.number}
                                        </Box>
                                    </Box>
                                    <Typography sx={{
                                        fontSize: '0.65rem',
                                        fontWeight: isActive ? 500 : isCompleted ? 600 : 400,
                                        color: isActive ? '#187604' : isCompleted ? '#2e7d32' : '#9e9e9e',
                                        whiteSpace: 'nowrap', lineHeight: 1.2,
                                        transition: 'color 0.3s ease',
                                        animation: `ev-label-fade 0.4s ease ${idx * 60 + 80}ms both`,
                                        mt: 1
                                    }}>
                                        {s.title}
                                    </Typography>
                                </Box>

                                {!isLast && (
                                    <Box sx={{
                                        flexGrow: 1, height: 3, mt: 1.75, mx: 0.5,
                                        borderRadius: '4px', bgcolor: '#e8f5e9',
                                        overflow: 'hidden', position: 'relative',
                                    }}>
                                        <Box sx={{
                                            position: 'absolute', inset: 0,
                                            bgcolor: '#187604', borderRadius: '4px',
                                            transformOrigin: 'left center',
                                            transform: isCompleted ? 'scaleX(1)' : 'scaleX(0)',
                                            transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1)',
                                            ...(isCompleted && {
                                                animation: 'ev-track-fill 0.45s cubic-bezier(0.4,0,0.2,1) both',
                                            }),
                                        }} />
                                    </Box>
                                )}
                            </React.Fragment>
                        );
                    })}
                </Box>
            </Box>
        </>
    );
}

// ── Form defaults ─────────────────────────────────────────────────────────────
const FORM1_DEFAULTS = {
    middlename: '', suffix: '', birthdate: '',
    gender: 'male', phone_number: '', address: '',
};

const FORM2_DEFAULTS = {
    profession: '',
    educations:                  [{ level: '', field_of_study: '' }],
    employments:                 [{ company_name: '', position: '' }],
    licenses_and_certifications: [{ type: 'license', name: '', credential_id_number: '' }],
    user_links:                  [{ url: '' }],
};

const FORM3_DEFAULTS = {
    government_id: null, degree_certificate: null,
    proof_of_profession: null, acknowledgement: false,
};

// ── Main component ────────────────────────────────────────────────────────────
export default function ExpertiseVerificationModal({ open, onClose, auth, initialStep = 1 }) {
    const theme      = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    // ── Per-user scoped storage keys ──────────────────────────────────────────
    // Memoised — auth.user.id never changes within a session.
    const STORAGE = useMemo(() => makeStorage(auth.user.id), [auth.user.id]);

    const [showWarning, setShowWarning]           = useState(false);
    const [step2PropsLoaded, setStep2PropsLoaded] = useState(false);

    // Step resolution: server value (initialStep) is authoritative.
    const [step, setStep] = useState(() => {
        if (initialStep >= 1 && initialStep <= 3) return initialStep;
        const saved = safeGet(STORAGE.step);
        return (saved >= 1 && saved <= 3) ? saved : 1;
    });

    useEffect(() => { safeSet(STORAGE.step, step); }, [STORAGE.step, step]);

    // ── CRITICAL FIX: reset step2PropsLoaded every time the modal closes ─────
    // MUI Dialog keeps the component mounted (it uses CSS opacity, not
    // conditional rendering). This means `step2PropsLoaded` persists between
    // open/close cycles. On the next open at step 2, the guard saw `true` and
    // skipped `router.reload` — leaving usePage().props with stale/null lazy
    // props and empty dropdowns.
    // Watching `open` and resetting to `false` on every close guarantees the
    // reload fires fresh each time the user reaches step 2.
    useEffect(() => {
        if (!open) {
            setStep2PropsLoaded(false);
        }
    }, [open]);

    // ── Lazy-load Step 2 dropdown data ────────────────────────────────────────
    // DashboardController declares these as Inertia::lazy() so they are NOT
    // included in the normal dashboard response. This partial reload fetches
    // only those keys — everything else on the page is untouched.
    // Step2Credentials reads them via usePage().props as it always did.
    useEffect(() => {
        if (open && step === 2 && !step2PropsLoaded) {
            router.reload({
                only:           STEP2_PROPS,
                preserveState:  true,
                preserveScroll: true,
                onSuccess:      () => setStep2PropsLoaded(true),
                onError:        () => setStep2PropsLoaded(true), // show form even on error; fields just stay empty
            });
        }
    }, [open, step, step2PropsLoaded]);

    // ── Forms ─────────────────────────────────────────────────────────────────
    // Spread order is intentional:
    //   1. FORM1_DEFAULTS       — safe editable-field blanks
    //   2. cached draft         — restore current user's progress (user-scoped key)
    //   3. auth fields LAST     — server values always win; never overwritten by cache
    const form1 = useForm({
        ...FORM1_DEFAULTS,
        ...(safeGet(STORAGE.form1) ?? {}),
        firstname: auth.user.firstname ?? '',
        lastname:  auth.user.lastname  ?? '',
    });

    const form2 = useForm({
        ...FORM2_DEFAULTS,
        ...(safeGet(STORAGE.form2) ?? {}),
    });

    // form3: no localStorage restore — File objects can't be serialised.
    const form3 = useForm({ ...FORM3_DEFAULTS });

    // Persist drafts on every change (form3 excluded — binary files).
    // Auth-owned fields stripped before saving so they never pollute the cache.
    useEffect(() => {
        const { firstname, lastname, ...editableFields } = form1.data;
        safeSet(STORAGE.form1, editableFields);
    }, [STORAGE.form1, form1.data]);

    useEffect(() => {
        safeSet(STORAGE.form2, form2.data);
    }, [STORAGE.form2, form2.data]);

    // ── Submit handlers ───────────────────────────────────────────────────────
    const handleNext = (e) => {
        e.preventDefault();

        if (step === 1) {
            form1.post(route('verification.store1'), {
                preserveScroll: true,
                preserveState:  true,
                onSuccess: () => setStep(2),
            });
            return;
        }

        if (step === 2) {
            form2.transform((d) => ({
                profession: d.profession.trim(),

                educations: d.educations
                    .filter((e) => e.level || e.field_of_study)
                    .map((e) => ({
                        level:          e.level.trim(),
                        field_of_study: e.field_of_study.trim(),
                    })),

                employments: d.employments
                    .filter((e) => e.company_name)
                    .map((e) => ({
                        company_name:    e.company_name.trim(),
                        position:        e.position?.trim()  || null,
                        start_date:      e.start_date        || null,
                        end_date:        e.end_date          || null,
                        is_current_role: Boolean(e.is_current_role),
                    })),

                licenses_and_certifications: d.licenses_and_certifications
                    .filter((e) => e.name)
                    .map((e) => ({
                        type:                 String(e.type || 'license').trim(),
                        name:                 e.name.trim(),
                        credential_id_number: e.credential_id_number?.trim() || null,
                    })),

                user_links: d.user_links
                    .filter((e) => e.url)
                    .map((e) => ({ url: e.url.trim() })),
            }));

            form2.post(route('verification.store2'), {
                forceFormData:  true,
                preserveScroll: true,
                preserveState:  true,
                onSuccess: () => setStep(3),
            });
            return;
        }

        if (step === 3) {
            form3.post(route('verification.store3'), {
                forceFormData:  true,
                preserveScroll: true,
                onSuccess: () => {
                    safeClearAll(STORAGE);
                    onClose();
                },
            });
        }
    };

    const handleBack = () => { if (step > 1) setStep((s) => s - 1); };

    const handleCancel = () => {
        const hasProgress = step > 1 || Object.values(form1.data).some(Boolean);
        hasProgress ? setShowWarning(true) : onClose();
    };

    const handleWarningConfirm = () => {
        safeClearAll(STORAGE);
        setShowWarning(false);
        setStep(1);
        setStep2PropsLoaded(false);
        onClose();
    };

    const isProcessing = form1.processing || form2.processing || form3.processing;
    const step2Loading = step === 2 && !step2PropsLoaded;

    return (
        <>
            <Dialog
                open={open}
                onClose={(_, reason) => { if (reason !== 'backdropClick') handleCancel(); }}
                maxWidth="md"
                fullWidth
                fullScreen={fullScreen}
                PaperProps={{ sx: { borderRadius: 2, height: '90vh', overflow: 'hidden' } }}
                sx={{mx: { xs: 2, sm: 2, md: 0 }}}
            >
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: '100%' }}>

                    {/* ── Sidebar ── */}
                    <Box sx={{
                        width: { xs: '100%', md: 300 },
                        bgcolor: '#f8f9fa',
                        p: { xs: 0, md: 4 },
                        borderRight: '1px solid #e0e0e0',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        {/* Mobile horizontal milestone (xs / sm only) */}
                        <MobileStepperBar currentStep={step} />

                        {/* Desktop sidebar (md+) — untouched */}
                        <Box sx={{ display: { xs: 'none', md: 'contents' } }}>
                            <Typography variant="h5" color="#187604" fontWeight="bold" gutterBottom>
                                Expertise Verification
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 6 }}>
                                Complete your profile verification to access all mentor features.
                            </Typography>

                                                       <Box>
                                {STEPS.map((s, idx) => (
                                    <SidebarItem
                                        key={s.number}
                                        number={s.number}
                                        title={s.title}
                                        status={stepStatus(idx + 1, step)}
                                        isLast={idx === STEPS.length - 1}
                                    />
                                ))}
                            </Box>

                            <Paper elevation={0} sx={{
                                mt: 'auto', p: 2, bgcolor: '#f0fdf4',
                                border: '1px solid #dcfce7',
                                display: { xs: 'none', md: 'flex' }, gap: 1.5,
                            }}>
                                <Box sx={{
                                    bgcolor: '#166534', color: 'white', borderRadius: '50%',
                                    width: 20, height: 20, display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <Typography variant="caption" fontWeight="bold">i</Typography>
                                </Box>
                                <Typography variant="caption" color="#14532d">
                                    Ensure all information matches your official government IDs to prevent delays.
                                </Typography>
                            </Paper>
                        </Box>
                    </Box>

                    {/* ── Main content ── */}
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 6 }, overflowY: 'auto', pb: { xs: 2, sm: 4, md: 0 } }}>
                            <form id="verification-form" onSubmit={handleNext}>
                                {step === 1 && (
                                    <Fade in><Box><Step1PersonalDetails form={form1} /></Box></Fade>
                                )}

                                {step === 2 && step2Loading && (
                                    <Fade in>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Loading credentials form…
                                            </Typography>
                                        </Box>
                                    </Fade>
                                )}

                                {step === 2 && !step2Loading && (
                                    <Fade in><Box><Step2Credentials form={form2} /></Box></Fade>
                                )}

                                {step === 3 && (
                                    <Fade in><Box><Step3Documents form={form3} /></Box></Fade>
                                )}
                            </form>
                        </Box>

                        {/* ── Footer ── */}
                        <Box sx={{
                            px: 3, borderTop: '1px solid #f0f0f0',
                            display: 'flex', justifyContent: 'space-between', bgcolor: '#fff',
                            pb: { xs: 16, sm: 16, md: 2 },
                            pt: 2
                        }}>
                            {step === 1
                                ? <Button onClick={handleCancel} color="inherit">Cancel</Button>
                                : <Button onClick={handleBack} startIcon={<ArrowBackIcon />} color="inherit">Back</Button>
                            }

                            <Button
                                type="submit"
                                form="verification-form"
                                variant="contained"
                                disabled={isProcessing || step2Loading}
                                endIcon={step < 3 ? <ArrowForwardIcon /> : null}
                                sx={{ bgcolor: '#187604', '&:hover': { bgcolor: '#14532d' }, px: 4, py: 1.2 }}
                            >
                                {isProcessing  ? 'Saving…'
                                : step2Loading  ? 'Loading…'
                                : step < 3      ? 'Next Step'
                                :                 'Submit Application'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Dialog>

            <WarningModal
                open={showWarning}
                onConfirm={handleWarningConfirm}
                onCancel={() => setShowWarning(false)}
                message="Your progress will be lost. Are you sure you want to cancel?"
            />
        </>
    );
}
