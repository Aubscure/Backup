import MentorLayout from '@/Layouts/MentorLayout';
import InputError from '@/Components/InputError';
import { Head, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Fade, Box, Paper, Grid } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';

// Already-componented objects
import MentorCourseMilestone from '@/Components/Mentor/Courses/MentorCourseMilestone';
import MentorCourseFooterActions from '@/Components/Mentor/Courses/MentorCourseFooterActions';

// New Pricing-specific components
import PricingPageHeader from '@/Components/Mentor/Courses/Pricing/PricingPageHeader';
import FreeCourseToggle from '@/Components/Mentor/Courses/Pricing/FreeCourseToggle';
import PricingPlanCard from '@/Components/Mentor/Courses/Pricing/PricingPlanCard';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function parseDuration(plan) {
    if (!plan?.duration || plan.duration === 'Lifetime') {
        return { accessType: 'lifetime', amount: '', unit: 'months' };
    }
    const match = plan.duration.match(/(\d+)\s+(\w+)/);
    return {
        accessType: 'limited',
        amount: match ? match[1] : '',
        unit: match ? match[2].toLowerCase() : 'months',
    };
}

// ---------------------------------------------------------------------------
export default function Pricing({ course }) {
    const coursePlans     = course?.coursePlans ?? course?.course_plans ?? [];
    const individualPlan  = coursePlans.find((p) => p.type === 'individual');
    const organizationPlan = coursePlans.find((p) => p.type === 'organization');

    const indDuration  = parseDuration(individualPlan);
    const orgDuration  = parseDuration(organizationPlan);

    const { data, setData, processing, errors } = useForm({
        is_free: course?.is_free ?? false,

        individual_free:            individualPlan?.price == 0,
        individual_price:           individualPlan?.price ?? '2500.00',
        individual_on_sale:         false,
        individual_access_type:     indDuration.accessType,
        individual_duration_amount: indDuration.amount,
        individual_duration_unit:   indDuration.unit,

        organization_free:            organizationPlan?.price == 0,
        organization_price:           organizationPlan?.price ?? '2000.00',
        organization_bulk_buying:     true,
        organization_access_type:     orgDuration.accessType,
        organization_duration_amount: orgDuration.amount,
        organization_duration_unit:   orgDuration.unit,
    });

    // ── Handlers ──────────────────────────────────────────────────────────
    const handleFreeToggle = (e) => {
        const v = e.target.checked;
        setData((prev) => ({
            ...prev,
            is_free:            v,
            individual_free:    v,
            individual_price:   v ? '0.00' : (prev.individual_price === '0.00' ? '2500.00' : prev.individual_price),
            organization_free:  v,
            organization_price: v ? '0.00' : (prev.organization_price === '0.00' ? '2000.00' : prev.organization_price),
        }));
    };

    const handleIndividualFreeToggle = (e) => {
        const v = e.target.checked;
        setData((prev) => ({
            ...prev,
            individual_free:  v,
            individual_price: v ? '0.00' : (prev.individual_price || '2500.00'),
        }));
    };

    const handleOrganizationFreeToggle = (e) => {
        const v = e.target.checked;
        setData((prev) => ({
            ...prev,
            organization_free:  v,
            organization_price: v ? '0.00' : (prev.organization_price || '2000.00'),
        }));
    };

    const handleSubmit = (e, isDraft = false) => {
        e.preventDefault();

        const payload = {
            is_free:            data.is_free,
            individual_free:    data.individual_free,
            individual_price:   data.individual_free ? 0 : parseFloat(data.individual_price || 0),
            individual_on_sale: data.individual_on_sale,
            individual_access_type: data.individual_access_type,
            organization_free:  data.organization_free,
            organization_price: data.organization_free ? 0 : parseFloat(data.organization_price || 0),
            organization_bulk_buying: data.organization_bulk_buying,
            organization_access_type: data.organization_access_type,
            is_draft:    isDraft,
            next_step:   !isDraft,
            redirect_to: isDraft ? 'index' : undefined,
        };

        if (data.individual_access_type === 'limited') {
            payload.individual_duration_amount = parseFloat(data.individual_duration_amount || 1);
            payload.individual_duration_unit   = data.individual_duration_unit;
        }
        if (data.organization_access_type === 'limited') {
            payload.organization_duration_amount = parseFloat(data.organization_duration_amount || 1);
            payload.organization_duration_unit   = data.organization_duration_unit;
        }

        router.post(route('mentor.courses.pricing.save', course.id), payload, {
            preserveScroll: true,
            onSuccess: () => {
                if (isDraft) window.location.href = route('mentor.courses.index');
            },
        });
    };

    const handleDiscard = () => {
        if (confirm('Are you sure you want to discard pricing changes?')) {
            window.location.href = route('mentor.courses.index');
        }
    };

    // ── Mount animation ───────────────────────────────────────────────────
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    // ── Render ────────────────────────────────────────────────────────────
    return (
        <>
            <Head title="Create Course - Pricing" />

            <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50', pb: 44 }}>
                <Box sx={{ flex: 1 }}>

                    {/* Step indicator */}
                    <Fade in={mounted} style={{ transitionDelay: '100ms' }}>
                        <Box sx={{ mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, mb: 2 }}>
                            <MentorCourseMilestone currentStep={3} />
                        </Box>
                    </Fade>

                    <Box sx={{ mx: 'auto', maxWidth: 1200, px: { xs: 2, sm: 3, lg: 4 }, py: { xs: 2, sm: 3, md: 4 } }}>
                        <Box component="form" onSubmit={(e) => handleSubmit(e, false)}>

                            <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3 }}>

                                {/* ── Page header (uniform with other steps) ── */}
                                <PricingPageHeader mounted={mounted} />

                                {/* ── Master free toggle ── */}
                                <Fade in={mounted} timeout={400} style={{ transitionDelay: '150ms' }}>
                                    <Box>
                                        <FreeCourseToggle
                                            checked={data.is_free}
                                            onChange={handleFreeToggle}
                                        />
                                    </Box>
                                </Fade>

                                {/* ── Plan cards ── */}
                                <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="stretch">

                                    {/* Individual */}
                                    <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                                        <PricingPlanCard
                                            variant="individual"
                                            index={0}
                                            icon={PersonIcon}
                                            title="Individual"
                                            subtitle="Standard pricing for single users."
                                            isCourseGloballyFree={data.is_free}
                                            free={data.individual_free}
                                            onFreeChange={handleIndividualFreeToggle}
                                            price={data.individual_price}
                                            onPriceChange={(val) => setData('individual_price', val)}
                                            priceLabel="Base Price (PHP)"
                                            priceError={errors.individual_price}
                                            toggleLabel="On Sale"
                                            toggleSub="Offer a discount?"
                                            toggleChecked={data.individual_on_sale}
                                            onToggleChange={(e) => setData('individual_on_sale', e.target.checked)}
                                            accessType={data.individual_access_type}
                                            onAccessTypeChange={(val) => setData('individual_access_type', val)}
                                            durationAmount={data.individual_duration_amount}
                                            onDurationAmountChange={(val) => setData('individual_duration_amount', val)}
                                            durationUnit={data.individual_duration_unit}
                                            onDurationUnitChange={(val) => setData('individual_duration_unit', val)}
                                            durationAmountError={errors.individual_duration_amount}
                                        />
                                    </Grid>

                                    {/* Organization */}
                                    <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                                        <PricingPlanCard
                                            variant="organization"
                                            index={1}
                                            icon={BusinessIcon}
                                            title="Organization"
                                            subtitle="Bulk purchasing for teams."
                                            isCourseGloballyFree={data.is_free}
                                            free={data.organization_free}
                                            onFreeChange={handleOrganizationFreeToggle}
                                            price={data.organization_price}
                                            onPriceChange={(val) => setData('organization_price', val)}
                                            priceLabel="Price per person (PHP)"
                                            priceError={errors.organization_price}
                                            toggleLabel="Bulk Buying"
                                            toggleSub="Enable B2B options"
                                            toggleChecked={data.organization_bulk_buying}
                                            onToggleChange={(e) => setData('organization_bulk_buying', e.target.checked)}
                                            accessType={data.organization_access_type}
                                            onAccessTypeChange={(val) => setData('organization_access_type', val)}
                                            durationAmount={data.organization_duration_amount}
                                            onDurationAmountChange={(val) => setData('organization_duration_amount', val)}
                                            durationUnit={data.organization_duration_unit}
                                            onDurationUnitChange={(val) => setData('organization_duration_unit', val)}
                                            durationAmountError={errors.organization_duration_amount}
                                        />
                                    </Grid>
                                </Grid>

                                <InputError message={errors.is_free} />
                            </Paper>

                            {/* ── Footer actions (already a component) ── */}
                            <MentorCourseFooterActions
                                onDiscard={handleDiscard}
                                onSaveAsDraft={(e) => handleSubmit(e, true)}
                                onBack={() => (window.location.href = route('mentor.courses.media-content', course.id))}
                                onNext={handleSubmit}
                                nextLabel="Next Step"
                                processing={processing}
                            />

                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

Pricing.layout = (page) => (
    <MentorLayout auth={page.props.auth} activeTab="Courses">
        {page}
    </MentorLayout>
);
