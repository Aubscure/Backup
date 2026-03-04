import { memo } from 'react';
import {
    Box, Paper, Stack, Typography, FormControlLabel, Checkbox,
    TextField, Switch, FormControl, RadioGroup, Radio,
    Select, MenuItem, InputAdornment, Collapse, Fade,
} from '@mui/material';
import InputError from '@/Components/InputError';

/**
 * PricingPlanCard
 *
 * Props:
 *  variant       – 'individual' | 'organization'
 *  icon          – MUI SvgIcon component
 *  title         – Card heading string
 *  subtitle      – Card subheading string
 *  isCourseGloballyFree  – boolean (master toggle)
 *
 *  free          – boolean
 *  onFreeChange  – (e) => void
 *
 *  price         – string
 *  onPriceChange – (val) => void
 *  priceLabel    – string  (e.g. "Base Price (PHP)")
 *  priceError    – string | undefined
 *
 *  toggleLabel   – string  (e.g. "On Sale" | "Bulk Buying")
 *  toggleSub     – string
 *  toggleChecked – boolean
 *  onToggleChange– (e) => void
 *
 *  accessType        – 'lifetime' | 'limited'
 *  onAccessTypeChange– (val) => void
 *  durationAmount    – string
 *  onDurationAmountChange – (val) => void
 *  durationUnit      – string
 *  onDurationUnitChange   – (val) => void
 *  durationAmountError    – string | undefined
 *
 *  index         – animation stagger index (0 | 1)
 */
const DURATION_UNITS = ['days', 'weeks', 'months', 'years'];

const PricingPlanCard = memo(function PricingPlanCard({
    variant = 'individual',
    icon: Icon,
    title,
    subtitle,
    isCourseGloballyFree,
    free,
    onFreeChange,
    price,
    onPriceChange,
    priceLabel,
    priceError,
    toggleLabel,
    toggleSub,
    toggleChecked,
    onToggleChange,
    accessType,
    onAccessTypeChange,
    durationAmount,
    onDurationAmountChange,
    durationUnit,
    onDurationUnitChange,
    durationAmountError,
    index = 0,
}) {
    const isIndividual = variant === 'individual';
    const accentColor = isIndividual ? 'success' : 'primary';
    const isDisabled = isCourseGloballyFree || free;

    return (
        <Paper
            variant="outlined"
            sx={{
                p: { xs: 2, sm: 2.5, md: 3 },
                borderRadius: 2,
                width: '100%',
                borderColor: 'divider',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                animationDelay: `${index * 120}ms`,
                animation: 'slideUp 0.45s cubic-bezier(0.4,0,0.2,1) both',
                '@keyframes slideUp': {
                    from: { opacity: 0, transform: 'translateY(24px)' },
                    to:   { opacity: 1, transform: 'translateY(0)' },
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: isIndividual
                        ? 'linear-gradient(90deg, #66bb6a, #2e7d32)'
                        : 'linear-gradient(90deg, #42a5f5, #1565c0)',
                    opacity: 0,
                    transition: 'opacity 0.3s',
                },
                '&:hover': {
                    borderColor: `${accentColor}.light`,
                    borderWidth: 2,
                    boxShadow: isIndividual
                        ? '0 8px 28px rgba(46,125,50,0.12)'
                        : '0 8px 28px rgba(21,101,192,0.12)',
                    transform: 'translateY(-3px)',
                    '&::before': { opacity: 1 },
                },
            }}
        >
            <Stack spacing={2}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
                    <Box
                        sx={{
                            width: { xs: 36, sm: 42 },
                            height: { xs: 36, sm: 42 },
                            borderRadius: 2,
                            background: isIndividual
                                ? 'linear-gradient(135deg, #a5d6a7 0%, #66bb6a 100%)'
                                : 'linear-gradient(135deg, #90caf9 0%, #42a5f5 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            boxShadow: isIndividual
                                ? '0 3px 10px rgba(46,125,50,0.2)'
                                : '0 3px 10px rgba(21,101,192,0.2)',
                            '&:hover': {
                                transform: 'scale(1.1) rotate(-6deg)',
                                boxShadow: isIndividual
                                    ? '0 6px 18px rgba(46,125,50,0.3)'
                                    : '0 6px 18px rgba(21,101,192,0.3)',
                            },
                        }}
                    >
                        {Icon && <Icon sx={{ color: 'white', fontSize: { xs: 20, sm: 22 } }} />}
                    </Box>
                    <Box>
                        <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1rem', sm: '1.15rem' }, lineHeight: 1.2 }}>
                            {title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                            {subtitle}
                        </Typography>
                    </Box>
                </Box>

                {/* Free checkbox */}
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={free}
                            onChange={onFreeChange}
                            disabled={isCourseGloballyFree}
                            size="small"
                            sx={{
                                color: `${accentColor}.main`,
                                transition: 'transform 0.2s',
                                '&.Mui-checked': {
                                    color: `${accentColor}.main`,
                                    transform: 'scale(1.1)',
                                },
                            }}
                        />
                    }
                    label={
                        <Typography variant="body2" fontWeight={600}>
                            Free
                        </Typography>
                    }
                />

                {/* Price field */}
                <TextField
                    label={priceLabel}
                    type="number"
                    value={price}
                    onChange={(e) => onPriceChange(e.target.value)}
                    disabled={isDisabled}
                    fullWidth
                    size="small"
                    InputProps={{
                        startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                        endAdornment: <InputAdornment position="end">PHP</InputAdornment>,
                    }}
                    inputProps={{ min: 0, step: '0.01' }}
                    error={!!priceError}
                    helperText={priceError}
                    sx={{
                        transition: 'opacity 0.2s',
                        opacity: isDisabled ? 0.55 : 1,
                        '& .MuiOutlinedInput-root': {
                            transition: 'box-shadow 0.2s',
                            '&:not(.Mui-disabled):hover': {
                                boxShadow: `0 0 0 3px rgba(${isIndividual ? '46,125,50' : '21,101,192'},0.08)`,
                            },
                        },
                    }}
                />

                {/* Toggle (On Sale / Bulk Buying) */}
                <FormControlLabel
                    control={
                        <Switch
                            checked={toggleChecked}
                            onChange={onToggleChange}
                            disabled={isDisabled}
                            color={accentColor}
                            size="small"
                            sx={{
                                '& .MuiSwitch-track': { transition: 'background-color 0.3s' },
                            }}
                        />
                    }
                    label={
                        <Box>
                            <Typography variant="body2" fontWeight={500}>
                                {toggleLabel}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {toggleSub}
                            </Typography>
                        </Box>
                    }
                />

                {/* Duration section */}
                <Box sx={{ pt: 1.5, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        Duration of course availability
                    </Typography>
                    <FormControl component="fieldset" fullWidth>
                        <RadioGroup
                            value={accessType}
                            onChange={(e) => onAccessTypeChange(e.target.value)}
                            row
                        >
                            <FormControlLabel
                                value="lifetime"
                                control={<Radio color={accentColor} size="small" />}
                                label={<Typography variant="body2">Lifetime Access</Typography>}
                            />
                            <FormControlLabel
                                value="limited"
                                control={<Radio color={accentColor} size="small" />}
                                label={<Typography variant="body2">Limited Access</Typography>}
                            />
                        </RadioGroup>
                    </FormControl>

                    <Collapse in={accessType === 'limited'} timeout={300}>
                        <Box sx={{ mt: 1.5 }}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                                <TextField
                                    label="Duration Amount"
                                    type="number"
                                    value={durationAmount}
                                    onChange={(e) => onDurationAmountChange(e.target.value)}
                                    size="small"
                                    fullWidth
                                    inputProps={{ min: 1 }}
                                    error={!!durationAmountError}
                                    helperText={durationAmountError}
                                />
                                <Select
                                    value={durationUnit}
                                    onChange={(e) => onDurationUnitChange(e.target.value)}
                                    size="small"
                                    sx={{ minWidth: { xs: '100%', sm: 120 } }}
                                >
                                    {DURATION_UNITS.map((u) => (
                                        <MenuItem key={u} value={u}>
                                            {u.charAt(0).toUpperCase() + u.slice(1)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Stack>

                            {durationAmountError && (
                                <InputError message={durationAmountError} />
                            )}
                        </Box>
                    </Collapse>
                </Box>
            </Stack>
        </Paper>
    );
});

export default PricingPlanCard;
