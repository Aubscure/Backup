/**
 * resources/js/Components/Enrollee/Courses/CoursePurchaseModal.jsx
 *
 * Self-contained purchase modal: plan selection → card payment → success.
 *
 * Props:
 *   open       {boolean}   — controlled visibility
 *   onClose    {() => void}
 *   course     {object}    — needs { id, title }
 *   indiPlan   {object|undefined}
 *   orgPlan    {object|undefined}
 */

import { useState, useCallback } from 'react';
import { router } from '@inertiajs/react';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Collapse,
    Alert,
    Dialog,
    DialogContent,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

import ArrowBackRoundedIcon          from '@mui/icons-material/ArrowBackRounded';
import BusinessCenterRoundedIcon     from '@mui/icons-material/BusinessCenterRounded';
import CheckCircleRoundedIcon        from '@mui/icons-material/CheckCircleRounded';
import CloseRoundedIcon              from '@mui/icons-material/CloseRounded';
import CreditCardRoundedIcon         from '@mui/icons-material/CreditCardRounded';
import LockOutlinedIcon              from '@mui/icons-material/LockOutlined';
import PersonOutlineRoundedIcon      from '@mui/icons-material/PersonOutlineRounded';
import SchoolRoundedIcon             from '@mui/icons-material/SchoolRounded';

// ── Constants ─────────────────────────────────────────────────────────────────

const GREEN = '#166534';
const GREEN_DARK = '#14532d';
const BLUE  = '#1d4ed8';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
    }).format(amount);

const fieldSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: GREEN },
    },
    '& label.Mui-focused': { color: GREEN },
};

// ── Sub-component: single plan row ────────────────────────────────────────────

function PlanOption({ icon, title, subtitle, plan, isFree, onSelect, accent }) {
    return (
        <Box
            onClick={onSelect}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelect()}
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                borderRadius: 3,
                border: '1.5px solid',
                borderColor: 'divider',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none',
                '&:hover, &:focus-visible': {
                    borderColor: accent,
                    bgcolor: alpha(accent, 0.04),
                    transform: 'translateY(-1px)',
                    boxShadow: `0 6px 20px ${alpha(accent, 0.12)}`,
                },
            }}
        >
            {/* Icon bubble */}
            <Box sx={{
                width: 44, height: 44, borderRadius: 2.5, flexShrink: 0,
                bgcolor: alpha(accent, 0.1),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: accent,
            }}>
                {icon}
            </Box>

            {/* Text */}
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={700} color="text.primary">
                    {title}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.4 }}>
                    {subtitle}
                </Typography>
                <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.7rem' }}>
                    {plan?.access_duration_label || plan?.duration || 'Lifetime'} access
                </Typography>
            </Box>

            {/* Price / Free badge */}
            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                {isFree ? (
                    <Chip
                        label="Free"
                        size="small"
                        sx={{
                            bgcolor: alpha(accent, 0.12), color: accent,
                            fontWeight: 700, fontSize: '0.75rem',
                            border: `1px solid ${alpha(accent, 0.25)}`,
                        }}
                    />
                ) : (
                    <Typography variant="h6" fontWeight={900} sx={{ color: '#111827', lineHeight: 1 }}>
                        {formatCurrency(parseFloat(plan?.price ?? 0))}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

// ── Modal header ──────────────────────────────────────────────────────────────

function ModalHeader({ step, courseTitle, onBack, onClose, submitting }) {
    const label = step === 'choose' ? 'ENROLLMENT'
                : step === 'pay'    ? 'SECURE PAYMENT'
                :                    'CONFIRMED';

    const heading = step === 'choose' ? 'Choose your plan'
                  : step === 'pay'    ? 'Complete your purchase'
                  :                    "You're enrolled!";

    return (
        <Box sx={{
            background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_DARK} 100%)`,
            px: 3, py: 2.5,
        }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    {/* Back arrow — only on pay step */}
                    {step === 'pay' && (
                        <Box
                            component="button"
                            onClick={onBack}
                            disabled={submitting}
                            aria-label="Back to plan selection"
                            sx={{
                                border: 'none', background: 'none', cursor: 'pointer', p: 0.5,
                                borderRadius: 1, color: 'rgba(255,255,255,0.7)', display: 'flex',
                                alignItems: 'center',
                                '&:hover:not(:disabled)': { color: '#fff' },
                                '&:disabled': { opacity: 0.4, cursor: 'default' },
                            }}
                        >
                            <ArrowBackRoundedIcon sx={{ fontSize: 18 }} />
                        </Box>
                    )}

                    <Box>
                        <Typography variant="overline" sx={{
                            color: 'rgba(255,255,255,0.65)', fontSize: '0.62rem',
                            letterSpacing: 1.5, display: 'block', lineHeight: 1.2,
                        }}>
                            {label}
                        </Typography>
                        <Typography variant="h6" fontWeight={800} sx={{ color: '#fff', lineHeight: 1.2, fontSize: '1rem' }}>
                            {heading}
                        </Typography>
                    </Box>
                </Stack>

                {/* Close */}
                <Box
                    component="button"
                    onClick={onClose}
                    disabled={submitting}
                    aria-label="Close"
                    sx={{
                        border: 'none', background: 'none', cursor: 'pointer', p: 0.5,
                        borderRadius: 1, color: 'rgba(255,255,255,0.7)', display: 'flex',
                        alignItems: 'center',
                        '&:hover:not(:disabled)': { color: '#fff' },
                        '&:disabled': { opacity: 0.4, cursor: 'default' },
                    }}
                >
                    <CloseRoundedIcon sx={{ fontSize: 20 }} />
                </Box>
            </Stack>

            {/* Course title strip */}
            <Box sx={{ mt: 2, px: 1.5, py: 1, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', display: 'block', lineHeight: 1.3, fontWeight: 600 }}>
                    {courseTitle}
                </Typography>
            </Box>
        </Box>
    );
}

// ── Step: Choose Plan ─────────────────────────────────────────────────────────

function StepChoose({ indiPlan, orgPlan, indiIsFree, orgIsFree, onSelect }) {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                Select how you'd like to access this course. Plans differ in access scope and pricing.
            </Typography>

            <Stack spacing={2}>
                {indiPlan && (
                    <PlanOption
                        icon={<SchoolRoundedIcon />}
                        title="Individual"
                        subtitle="Personal access for one learner"
                        plan={indiPlan}
                        isFree={indiIsFree}
                        onSelect={() => onSelect('individual')}
                        accent={GREEN}
                    />
                )}
                {orgPlan && (
                    <PlanOption
                        icon={<BusinessCenterRoundedIcon />}
                        title="Organization"
                        subtitle="Team access via your organization account"
                        plan={orgPlan}
                        isFree={orgIsFree}
                        onSelect={() => onSelect('organization')}
                        accent={BLUE}
                    />
                )}
            </Stack>

            <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 2.5, color: 'text.disabled' }}>
                <LockOutlinedIcon sx={{ fontSize: 13 }} />
                <Typography variant="caption" sx={{ fontSize: '0.72rem' }}>
                    Secure enrollment · No hidden fees
                </Typography>
            </Stack>
        </Box>
    );
}

// ── Step: Payment ─────────────────────────────────────────────────────────────

function StepPayment({ activePlan, selectedPlan, submitting, error, onClearError, onSubmit }) {
    const [cardName,   setCardName]   = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry,     setExpiry]     = useState('');
    const [cvv,        setCvv]        = useState('');

    const fmtCard   = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    const fmtExpiry = (v) => {
        const d = v.replace(/\D/g, '').slice(0, 4);
        return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
    };

    const activePrice = parseFloat(activePlan?.price ?? 0);
    const planLabel   = selectedPlan === 'individual' ? 'Individual Plan' : 'Organization Plan';

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ cardName, cardNumber, expiry, cvv });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ p: 3 }}>

            {/* Order summary */}
            <Box sx={{
                bgcolor: alpha(GREEN, 0.05),
                border: `1px solid ${alpha(GREEN, 0.15)}`,
                borderRadius: 2.5, p: 2, mb: 3,
            }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack spacing={0.25}>
                        <Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: 0.8, fontSize: '0.65rem' }}>
                            {planLabel}
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                            {activePlan?.access_duration_label || activePlan?.duration || 'Lifetime'} Access
                        </Typography>
                    </Stack>
                    <Typography variant="h5" fontWeight={900} color={GREEN}>
                        {formatCurrency(activePrice)}
                    </Typography>
                </Stack>
            </Box>

            {/* Error alert */}
            <Collapse in={!!error}>
                <Alert severity="error" onClose={onClearError} sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.8rem' }}>
                    {error}
                </Alert>
            </Collapse>

            {/* Card fields */}
            <Stack spacing={2.5}>
                <TextField
                    label="Cardholder Name"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    fullWidth required autoFocus
                    placeholder="Juan dela Cruz"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <PersonOutlineRoundedIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={fieldSx}
                />

                <TextField
                    label="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(fmtCard(e.target.value))}
                    fullWidth required
                    placeholder="1234 5678 9012 3456"
                    inputProps={{ maxLength: 19 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <CreditCardRoundedIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={fieldSx}
                />

                <Stack direction="row" spacing={2}>
                    <TextField
                        label="Expiry (MM/YY)"
                        value={expiry}
                        onChange={(e) => setExpiry(fmtExpiry(e.target.value))}
                        fullWidth required
                        placeholder="08/27"
                        inputProps={{ maxLength: 5 }}
                        sx={fieldSx}
                    />
                    <TextField
                        label="CVV"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        fullWidth required
                        placeholder="•••"
                        type="password"
                        inputProps={{ maxLength: 4 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlinedIcon sx={{ color: 'text.disabled', fontSize: 16 }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={fieldSx}
                    />
                </Stack>
            </Stack>

            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 2, fontSize: '0.72rem', lineHeight: 1.6 }}>
                Your payment is processed securely. Access is granted immediately after confirmation.
                This is a simulated payment — no real charges will be made.
            </Typography>

            <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={submitting}
                size="large"
                sx={{
                    mt: 3, bgcolor: GREEN, fontWeight: 800, textTransform: 'none',
                    borderRadius: 2.5, py: 1.5, fontSize: '0.95rem',
                    boxShadow: `0 6px 20px ${alpha(GREEN, 0.35)}`,
                    '&:hover': { bgcolor: GREEN_DARK },
                    '&.Mui-disabled': { bgcolor: alpha(GREEN, 0.5), color: '#fff' },
                }}
            >
                {submitting ? (
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <CircularProgress size={18} sx={{ color: '#fff' }} />
                        <span>Processing…</span>
                    </Stack>
                ) : (
                    `Pay ${formatCurrency(activePrice)}`
                )}
            </Button>
        </Box>
    );
}

// ── Step: Success ─────────────────────────────────────────────────────────────

function StepSuccess({ selectedPlan, onContinue }) {
    const isIndividual = selectedPlan === 'individual';

    return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
            <Box sx={{
                width: 72, height: 72, borderRadius: '50%', mx: 'auto', mb: 2.5,
                bgcolor: alpha(GREEN, 0.1),
                border: `2px solid ${alpha(GREEN, 0.25)}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <CheckCircleRoundedIcon sx={{ fontSize: 38, color: GREEN }} />
            </Box>

            <Typography variant="h6" fontWeight={800} sx={{ mb: 0.75 }}>
                {isIndividual ? 'Enrollment Confirmed!' : 'Organization Access Granted!'}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                {isIndividual
                    ? 'You now have full access to this course. Start learning right away!'
                    : 'Your organization has been enrolled. Head to your dashboard to manage team assignments.'}
            </Typography>

            <Button
                variant="contained"
                fullWidth
                onClick={onContinue}
                size="large"
                sx={{
                    bgcolor: GREEN, fontWeight: 800, textTransform: 'none',
                    borderRadius: 2.5, py: 1.4,
                    boxShadow: `0 4px 16px ${alpha(GREEN, 0.35)}`,
                    '&:hover': { bgcolor: GREEN_DARK },
                }}
            >
                {isIndividual ? 'Go to Course' : 'Go to Dashboard'}
            </Button>
        </Box>
    );
}

// ── Validation helper ─────────────────────────────────────────────────────────

function validateCard({ cardName, cardNumber, expiry, cvv }) {
    if (!cardName.trim())                     return 'Please enter the cardholder name.';
    if (cardNumber.replace(/\s/g, '').length !== 16) return 'Please enter a valid 16-digit card number.';
    if (expiry.length < 5)                    return 'Please enter a valid expiry date (MM/YY).';
    if (cvv.length < 3)                       return 'Please enter a valid CVV.';

    const [mm, yy] = expiry.split('/');
    if (new Date(2000 + parseInt(yy, 10), parseInt(mm, 10) - 1) < new Date()) {
        return 'Your card has expired.';
    }

    return null; // no error
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function CoursePurchaseModal({ open, onClose, course, indiPlan, orgPlan }) {
    const [step,         setStep]        = useState('choose'); // 'choose' | 'pay' | 'success'
    const [selectedPlan, setSelectedPlan]= useState(null);    // 'individual' | 'organization'
    const [submitting,   setSubmitting]  = useState(false);
    const [error,        setError]       = useState('');

    const indiIsFree = !indiPlan || parseFloat(indiPlan.price ?? 0) === 0;
    const orgIsFree  = !orgPlan  || parseFloat(orgPlan.price  ?? 0) === 0;

    // Reset state on close
    const handleClose = useCallback(() => {
        if (submitting) return;
        onClose();
        // Delay reset so the closing animation finishes first
        setTimeout(() => {
            setStep('choose');
            setSelectedPlan(null);
            setError('');
        }, 300);
    }, [submitting, onClose]);

    // Plan selected in step 1
    const handleSelectPlan = useCallback((planType) => {
        setSelectedPlan(planType);
        const isFree = planType === 'individual' ? indiIsFree : orgIsFree;

        if (isFree) {
            // Free plan → skip payment, navigate immediately
            setSubmitting(true);
            planType === 'individual'
                ? router.visit(route('enrollee.courses.show', course.id))
                : router.visit(route('client.dashboard'));
        } else {
            setStep('pay');
        }
    }, [indiIsFree, orgIsFree, course.id]);

    // Card form submitted in step 2
    const handlePaySubmit = useCallback(({ cardName, cardNumber, expiry, cvv }) => {
        const validationError = validateCard({ cardName, cardNumber, expiry, cvv });
        if (validationError) { setError(validationError); return; }

        setError('');
        setSubmitting(true);

        const activePlan  = selectedPlan === 'individual' ? indiPlan : orgPlan;
        const amount      = parseFloat(activePlan?.price ?? 0);

        if (selectedPlan === 'individual') {
            router.post(
                route('enrollee.courses.record-payment', course.id),
                { amount_paid: amount },
                {
                    onSuccess: () => { setSubmitting(false); setStep('success'); },
                    onError:   () => { setSubmitting(false); setError('Payment failed. Please try again.'); },
                }
            );
        } else {
            // Organisation: simulated processing (no gateway)
            setTimeout(() => { setSubmitting(false); setStep('success'); }, 1500);
        }
    }, [selectedPlan, indiPlan, orgPlan, course.id]);

    // Success CTA
    const handleContinue = useCallback(() => {
        selectedPlan === 'individual'
            ? router.visit(route('enrollee.courses.show', course.id))
            : router.visit(route('client.dashboard'));
    }, [selectedPlan, course.id]);

    const activePlan = selectedPlan === 'individual' ? indiPlan : orgPlan;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 4, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' },
            }}
        >
            <ModalHeader
                step={step}
                courseTitle={course.title}
                onBack={() => { setStep('choose'); setError(''); }}
                onClose={handleClose}
                submitting={submitting}
            />

            <DialogContent sx={{ p: 0 }}>
                {step === 'choose' && (
                    <StepChoose
                        indiPlan={indiPlan}
                        orgPlan={orgPlan}
                        indiIsFree={indiIsFree}
                        orgIsFree={orgIsFree}
                        onSelect={handleSelectPlan}
                    />
                )}

                {step === 'pay' && (
                    <StepPayment
                        activePlan={activePlan}
                        selectedPlan={selectedPlan}
                        submitting={submitting}
                        error={error}
                        onClearError={() => setError('')}
                        onSubmit={handlePaySubmit}
                    />
                )}

                {step === 'success' && (
                    <StepSuccess
                        selectedPlan={selectedPlan}
                        onContinue={handleContinue}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}