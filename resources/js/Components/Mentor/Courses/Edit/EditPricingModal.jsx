import InputError from '@/Components/InputError';
import { router, useForm } from '@inertiajs/react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Box, Typography, Button, Paper, Stack, Divider, IconButton,
    TextField, Switch, FormControlLabel, Radio, RadioGroup,
    FormControl, Select, MenuItem, InputAdornment, Grid, Checkbox,
    useTheme, useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';

export default function EditPricingModal({ open, onClose, course }) {
    const coursePlans = course?.coursePlans || course?.course_plans || [];
    const individualPlan = coursePlans.find((p) => p.type === 'individual');
    const organizationPlan = coursePlans.find((p) => p.type === 'organization');

    // ── responsive helpers ────────────────────────────────────────────────────
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    // ─────────────────────────────────────────────────────────────────────────

    // Parse durations
    let individualAccessType = 'lifetime', individualDurationAmount = '', individualDurationUnit = 'months';
    if (individualPlan?.duration && individualPlan.duration !== 'Lifetime') {
        individualAccessType = 'limited';
        const match = individualPlan.duration.match(/(\d+)\s+(\w+)/);
        if (match) { individualDurationAmount = match[1]; individualDurationUnit = match[2].toLowerCase(); }
    }

    let organizationAccessType = 'lifetime', organizationDurationAmount = '', organizationDurationUnit = 'months';
    if (organizationPlan?.duration && organizationPlan.duration !== 'Lifetime') {
        organizationAccessType = 'limited';
        const match = organizationPlan.duration.match(/(\d+)\s+(\w+)/);
        if (match) { organizationDurationAmount = match[1]; organizationDurationUnit = match[2].toLowerCase(); }
    }

    const { data, setData, processing, errors } = useForm({
        is_free: Boolean(course?.is_free),
        individual_free: individualPlan?.price == 0,
        individual_price: individualPlan?.price ?? '2500.00',
        individual_on_sale: false,
        individual_access_type: individualAccessType,
        individual_duration_amount: individualDurationAmount,
        individual_duration_unit: individualDurationUnit,
        organization_free: organizationPlan?.price == 0,
        organization_price: organizationPlan?.price ?? '2000.00',
        organization_bulk_buying: true,
        organization_access_type: organizationAccessType,
        organization_duration_amount: organizationDurationAmount,
        organization_duration_unit: organizationDurationUnit,
    });

    const handleFreeToggle = (e) => {
        const isFree = e.target.checked;
        setData({
            ...data, is_free: isFree,
            individual_free: isFree, individual_price: isFree ? '0.00' : (data.individual_price === '0.00' ? '2500.00' : data.individual_price || '2500.00'),
            organization_free: isFree, organization_price: isFree ? '0.00' : (data.organization_price === '0.00' ? '2000.00' : data.organization_price || '2000.00'),
        });
    };

    const handleIndividualFreeToggle = (e) => {
        const isFree = e.target.checked;
        setData({ ...data, individual_free: isFree, individual_price: isFree ? '0.00' : (data.individual_price || '2500.00') });
    };

    const handleOrganizationFreeToggle = (e) => {
        const isFree = e.target.checked;
        setData({ ...data, organization_free: isFree, organization_price: isFree ? '0.00' : (data.organization_price || '2000.00') });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            is_free: data.is_free,
            individual_free: data.individual_free,
            individual_price: data.individual_free ? 0 : parseFloat(data.individual_price || 0),
            individual_on_sale: data.individual_on_sale,
            individual_access_type: data.individual_access_type,
            organization_free: data.organization_free,
            organization_price: data.organization_free ? 0 : parseFloat(data.organization_price || 0),
            organization_bulk_buying: data.organization_bulk_buying,
            organization_access_type: data.organization_access_type,
            is_draft: false,
            next_step: false,
            from_edit: true,
        };

        if (data.individual_access_type === 'limited') {
            payload.individual_duration_amount = parseFloat(data.individual_duration_amount || 1);
            payload.individual_duration_unit = data.individual_duration_unit;
        }
        if (data.organization_access_type === 'limited') {
            payload.organization_duration_amount = parseFloat(data.organization_duration_amount || 1);
            payload.organization_duration_unit = data.organization_duration_unit;
        }

        router.post(route('mentor.courses.pricing.save', course.id), payload, {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

        const durationUnitOptions = [
            <MenuItem key="days" value="days">Day/s</MenuItem>,
            <MenuItem key="weeks" value="weeks">Week/s</MenuItem>,
            <MenuItem key="months" value="months">Month/s</MenuItem>,
            <MenuItem key="years" value="years">Year/s</MenuItem>,
        ];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            // ── xs/sm: fullscreen so all fields are reachable without clipping ──
            fullScreen={isMobile}
            // ─────────────────────────────────────────────────────────────────────
            PaperProps={{ sx: { borderRadius: { xs: 0, md: 3 }, maxHeight: { xs: '100dvh', md: '90vh' } } }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                <Box>
                    <Typography variant="h6" fontWeight="bold">Edit Pricing</Typography>
                    <Typography variant="caption" color="text.secondary">Configure individual and organization plans</Typography>
                </Box>
                <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ p: { xs: 1.5, sm: 2, md: 3 }, overflowY: 'auto' }}>
                <Box component="form" id="pricing-form" onSubmit={handleSubmit}>

                    {/* Free Course Toggle */}
                    <Paper variant="outlined" sx={{
                        p: 2.5, mb: 3, borderRadius: 2,
                        bgcolor: data.is_free ? 'success.50' : 'grey.50',
                        borderColor: data.is_free ? 'success.main' : 'divider',
                    }}>
                        <FormControlLabel
                            control={
                                <Checkbox checked={data.is_free} onChange={handleFreeToggle}
                                    sx={{ color: 'success.main', '&.Mui-checked': { color: 'success.main' } }} />
                            }
                            label={<Typography variant="body1" fontWeight={600}>Make this course FREE</Typography>}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 4.5, display: 'block' }}>
                            When enabled, both plans will be free for all users.
                        </Typography>
                    </Paper>

                    {/*
                     * xs/sm  : plans are shown as tabs — user taps Individual or
                     *          Organization to reveal that panel. Avoids a long
                     *          single-column scroll of two identical-looking cards.
                     * md+    : original side-by-side Grid (untouched).
                     *
                     * We achieve this with a lightweight controlled state for
                     * the active tab, rendered only on mobile.
                     */}
                    {isMobile ? (
                        <MobilePlanTabs
                            data={data} setData={setData} errors={errors}
                            handleIndividualFreeToggle={handleIndividualFreeToggle}
                            handleOrganizationFreeToggle={handleOrganizationFreeToggle}
                            durationUnitOptions={durationUnitOptions}
                        />
                    ) : (
                        <Grid container spacing={3} alignItems="stretch">
                            {/* Individual */}
                            <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, width: '100%', '&:hover': { borderColor: 'success.light', boxShadow: 2 } }}>
                                    <Stack spacing={2}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'success.light', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <PersonIcon sx={{ color: 'success.main' }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight={600}>Individual</Typography>
                                                <Typography variant="caption" color="text.secondary">Standard pricing for single users.</Typography>
                                            </Box>
                                        </Box>

                                        <FormControlLabel
                                            control={<Checkbox checked={data.individual_free} onChange={handleIndividualFreeToggle} disabled={data.is_free}
                                                sx={{ color: 'success.main', '&.Mui-checked': { color: 'success.main' } }} />}
                                            label={<Typography variant="body2" fontWeight={600}>Free</Typography>}
                                        />

                                        <TextField label="Base Price (PHP)" type="number"
                                            value={data.individual_price}
                                            onChange={(e) => setData('individual_price', e.target.value)}
                                            disabled={data.is_free || data.individual_free}
                                            fullWidth size="small"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                                                endAdornment: <InputAdornment position="end">PHP</InputAdornment>,
                                            }}
                                            inputProps={{ min: 0, step: '0.01' }}
                                            error={!!errors.individual_price}
                                            helperText={errors.individual_price}
                                        />

                                        <FormControlLabel
                                            control={<Switch checked={data.individual_on_sale}
                                                onChange={(e) => setData('individual_on_sale', e.target.checked)}
                                                disabled={data.is_free || data.individual_free} color="success" />}
                                            label={<Box><Typography variant="body2" fontWeight={500}>On Sale</Typography><Typography variant="caption" color="text.secondary">Offer a discount?</Typography></Box>}
                                        />

                                        <Box sx={{ pt: 1, borderTop: 1, borderColor: 'divider' }}>
                                            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Duration of course availability</Typography>
                                            <FormControl component="fieldset" fullWidth>
                                                <RadioGroup value={data.individual_access_type} onChange={(e) => setData('individual_access_type', e.target.value)}>
                                                    <FormControlLabel value="lifetime" control={<Radio color="success" />} label="Lifetime Access" />
                                                    <FormControlLabel value="limited" control={<Radio color="success" />} label="Limited Access" />
                                                </RadioGroup>
                                            </FormControl>
                                            {data.individual_access_type === 'limited' && (
                                                <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                                                    <TextField label="Amount" type="number" value={data.individual_duration_amount}
                                                        onChange={(e) => setData('individual_duration_amount', e.target.value)}
                                                        size="small" fullWidth inputProps={{ min: 1 }} />
                                                    <Select value={data.individual_duration_unit} onChange={(e) => setData('individual_duration_unit', e.target.value)} size="small" sx={{ minWidth: 120 }}>
                                                        {durationUnitOptions}
                                                    </Select>
                                                </Stack>
                                            )}
                                            {errors.individual_duration_amount && <InputError message={errors.individual_duration_amount} />}
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Grid>

                            {/* Organization */}
                            <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, width: '100%', '&:hover': { borderColor: 'primary.main', borderWidth: 2, bgcolor: 'primary.50', boxShadow: 2 } }}>
                                    <Stack spacing={2}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'primary.light', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <BusinessIcon sx={{ color: 'primary.main' }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight={600}>Organization</Typography>
                                                <Typography variant="caption" color="text.secondary">Bulk purchasing for teams.</Typography>
                                            </Box>
                                        </Box>

                                        <FormControlLabel
                                            control={<Checkbox checked={data.organization_free} onChange={handleOrganizationFreeToggle} disabled={data.is_free}
                                                sx={{ color: 'success.main', '&.Mui-checked': { color: 'success.main' } }} />}
                                            label={<Typography variant="body2" fontWeight={600}>Free</Typography>}
                                        />

                                        <TextField label="Price per person (PHP)" type="number"
                                            value={data.organization_price}
                                            onChange={(e) => setData('organization_price', e.target.value)}
                                            disabled={data.is_free || data.organization_free}
                                            fullWidth size="small"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                                                endAdornment: <InputAdornment position="end">PHP</InputAdornment>,
                                            }}
                                            inputProps={{ min: 0, step: '0.01' }}
                                            error={!!errors.organization_price}
                                            helperText={errors.organization_price}
                                        />

                                        <FormControlLabel
                                            control={<Switch checked={data.organization_bulk_buying}
                                                onChange={(e) => setData('organization_bulk_buying', e.target.checked)}
                                                disabled={data.is_free || data.organization_free} color="success" />}
                                            label={<Box><Typography variant="body2" fontWeight={500}>Bulk Buying</Typography><Typography variant="caption" color="text.secondary">Enable B2B options</Typography></Box>}
                                        />

                                        <Box sx={{ pt: 1, borderTop: 1, borderColor: 'divider' }}>
                                            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Duration of course availability</Typography>
                                            <FormControl component="fieldset" fullWidth>
                                                <RadioGroup value={data.organization_access_type} onChange={(e) => setData('organization_access_type', e.target.value)}>
                                                    <FormControlLabel value="lifetime" control={<Radio color="success" />} label="Lifetime Access" />
                                                    <FormControlLabel value="limited" control={<Radio color="success" />} label="Limited Access" />
                                                </RadioGroup>
                                            </FormControl>
                                            {data.organization_access_type === 'limited' && (
                                                <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                                                    <TextField label="Amount" type="number" value={data.organization_duration_amount}
                                                        onChange={(e) => setData('organization_duration_amount', e.target.value)}
                                                        size="small" fullWidth inputProps={{ min: 1 }} />
                                                    <Select value={data.organization_duration_unit} onChange={(e) => setData('organization_duration_unit', e.target.value)} size="small" sx={{ minWidth: 120 }}>
                                                        {durationUnitOptions}
                                                    </Select>
                                                </Stack>
                                            )}
                                            {errors.organization_duration_amount && <InputError message={errors.organization_duration_amount} />}
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Grid>
                        </Grid>
                    )}

                    <InputError message={errors.is_free} />
                </Box>
            </DialogContent>

            <Divider />

            {/*
             * xs/sm : full-width stacked buttons, Save on top (column-reverse)
             * md+   : original horizontal row
             */}
            <DialogActions sx={{
                px: { xs: 2, md: 3 },
                py: 2,
                gap: 1,
                flexDirection: { xs: 'column-reverse', md: 'row' },
            }}>
                <Button
                    onClick={onClose}
                    fullWidth={isMobile}
                    sx={{ textTransform: 'none', color: 'text.secondary' }}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    form="pricing-form"
                    disabled={processing}
                    variant="contained"
                    startIcon={<SaveIcon />}
                    fullWidth={isMobile}
                    sx={{ bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' }, textTransform: 'none', fontWeight: 600, px: 3 }}
                >
                    {processing ? 'Saving…' : 'Save Changes'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mobile-only tab switcher — Individual / Organization shown one at a time.
// Only rendered on xs/sm; md+ still uses the original Grid above.
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react';

function MobilePlanTabs({
    data, setData, errors,
    handleIndividualFreeToggle, handleOrganizationFreeToggle,
    durationUnitOptions,
}) {
    const [activeTab, setActiveTab] = useState('individual');

    const tabStyles = (key) => ({
        flex: 1,
        py: 1,
        borderRadius: 2,
        border: 1,
        borderColor: activeTab === key
            ? (key === 'individual' ? 'success.main' : 'primary.main')
            : 'divider',
        bgcolor: activeTab === key
            ? (key === 'individual' ? 'success.50' : 'primary.50')
            : 'transparent',
        color: activeTab === key
            ? (key === 'individual' ? 'success.main' : 'primary.main')
            : 'text.secondary',
        fontWeight: activeTab === key ? 700 : 400,
        textTransform: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        cursor: 'pointer',
        transition: 'all 0.15s',
    });

    return (
        <Stack spacing={2}>
            {/* ── Tab selector row ── */}
            <Stack direction="row" spacing={1}>
                <Box component="button" type="button" onClick={() => setActiveTab('individual')} sx={tabStyles('individual')}>
                    <PersonIcon fontSize="small" />
                    <Typography variant="body2" fontWeight="inherit">Individual</Typography>
                </Box>
                <Box component="button" type="button" onClick={() => setActiveTab('organization')} sx={tabStyles('organization')}>
                    <BusinessIcon fontSize="small" />
                    <Typography variant="body2" fontWeight="inherit">Organization</Typography>
                </Box>
            </Stack>

            {/* ── Individual panel ── */}
            {activeTab === 'individual' && (
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: 'success.light' }}>
                    <Stack spacing={2}>
                        <FormControlLabel
                            control={<Checkbox checked={data.individual_free} onChange={handleIndividualFreeToggle} disabled={data.is_free}
                                sx={{ color: 'success.main', '&.Mui-checked': { color: 'success.main' } }} />}
                            label={<Typography variant="body2" fontWeight={600}>Free</Typography>}
                        />

                        <TextField label="Base Price (PHP)" type="number"
                            value={data.individual_price}
                            onChange={(e) => setData('individual_price', e.target.value)}
                            disabled={data.is_free || data.individual_free}
                            fullWidth size="small"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                                endAdornment: <InputAdornment position="end">PHP</InputAdornment>,
                            }}
                            inputProps={{ min: 0, step: '0.01' }}
                            error={!!errors.individual_price}
                            helperText={errors.individual_price}
                        />

                        <FormControlLabel
                            control={<Switch checked={data.individual_on_sale}
                                onChange={(e) => setData('individual_on_sale', e.target.checked)}
                                disabled={data.is_free || data.individual_free} color="success" />}
                            label={<Box><Typography variant="body2" fontWeight={500}>On Sale</Typography><Typography variant="caption" color="text.secondary">Offer a discount?</Typography></Box>}
                        />

                        <Box sx={{ pt: 1, borderTop: 1, borderColor: 'divider' }}>
                            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Duration of course availability</Typography>
                            <FormControl component="fieldset" fullWidth>
                                <RadioGroup value={data.individual_access_type} onChange={(e) => setData('individual_access_type', e.target.value)}>
                                    <FormControlLabel value="lifetime" control={<Radio color="success" />} label="Lifetime Access" />
                                    <FormControlLabel value="limited" control={<Radio color="success" />} label="Limited Access" />
                                </RadioGroup>
                            </FormControl>
                            {data.individual_access_type === 'limited' && (
                                <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                                    <TextField label="Amount" type="number" value={data.individual_duration_amount}
                                        onChange={(e) => setData('individual_duration_amount', e.target.value)}
                                        size="small" fullWidth inputProps={{ min: 1 }} />
                                    <Select value={data.individual_duration_unit} onChange={(e) => setData('individual_duration_unit', e.target.value)} size="small" sx={{ minWidth: 110 }}>
                                        {durationUnitOptions}
                                    </Select>
                                </Stack>
                            )}
                            {errors.individual_duration_amount && <InputError message={errors.individual_duration_amount} />}
                        </Box>
                    </Stack>
                </Paper>
            )}

            {/* ── Organization panel ── */}
            {activeTab === 'organization' && (
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: 'primary.light' }}>
                    <Stack spacing={2}>
                        <FormControlLabel
                            control={<Checkbox checked={data.organization_free} onChange={handleOrganizationFreeToggle} disabled={data.is_free}
                                sx={{ color: 'success.main', '&.Mui-checked': { color: 'success.main' } }} />}
                            label={<Typography variant="body2" fontWeight={600}>Free</Typography>}
                        />

                        <TextField label="Price per person (PHP)" type="number"
                            value={data.organization_price}
                            onChange={(e) => setData('organization_price', e.target.value)}
                            disabled={data.is_free || data.organization_free}
                            fullWidth size="small"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                                endAdornment: <InputAdornment position="end">PHP</InputAdornment>,
                            }}
                            inputProps={{ min: 0, step: '0.01' }}
                            error={!!errors.organization_price}
                            helperText={errors.organization_price}
                        />

                        <FormControlLabel
                            control={<Switch checked={data.organization_bulk_buying}
                                onChange={(e) => setData('organization_bulk_buying', e.target.checked)}
                                disabled={data.is_free || data.organization_free} color="success" />}
                            label={<Box><Typography variant="body2" fontWeight={500}>Bulk Buying</Typography><Typography variant="caption" color="text.secondary">Enable B2B options</Typography></Box>}
                        />

                        <Box sx={{ pt: 1, borderTop: 1, borderColor: 'divider' }}>
                            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Duration of course availability</Typography>
                            <FormControl component="fieldset" fullWidth>
                                <RadioGroup value={data.organization_access_type} onChange={(e) => setData('organization_access_type', e.target.value)}>
                                    <FormControlLabel value="lifetime" control={<Radio color="success" />} label="Lifetime Access" />
                                    <FormControlLabel value="limited" control={<Radio color="success" />} label="Limited Access" />
                                </RadioGroup>
                            </FormControl>
                            {data.organization_access_type === 'limited' && (
                                <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                                    <TextField label="Amount" type="number" value={data.organization_duration_amount}
                                        onChange={(e) => setData('organization_duration_amount', e.target.value)}
                                        size="small" fullWidth inputProps={{ min: 1 }} />
                                    <Select value={data.organization_duration_unit} onChange={(e) => setData('organization_duration_unit', e.target.value)} size="small" sx={{ minWidth: 110 }}>
                                        {durationUnitOptions}
                                    </Select>
                                </Stack>
                            )}
                            {errors.organization_duration_amount && <InputError message={errors.organization_duration_amount} />}
                        </Box>
                    </Stack>
                </Paper>
            )}
        </Stack>
    );
}
