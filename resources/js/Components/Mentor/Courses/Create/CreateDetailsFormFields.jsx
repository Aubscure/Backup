import { memo, useState } from 'react';
import RichTextEditor from '@/Components/Mentor/Courses/MentorRichTextEditor';
import {
    Box, Typography, TextField, Stack, Autocomplete,
    MenuItem, Select, FormControl, InputLabel,
    keyframes,
} from '@mui/material';

const floatUp = keyframes`
  0%   { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

// ── AnimatedField: lift on hover/focus, staggered entrance ─────────────────

function AnimatedField({ children, delay = 0 }) {
    return (
        <Box
            sx={{
                animation: `${floatUp} 0.5s ${delay}ms cubic-bezier(0.22,1,0.36,1) both`,
                '& .MuiOutlinedInput-root': {
                    transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    },
                    '&.Mui-focused': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px rgba(46,125,50,0.15)',
                    },
                    '&:hover fieldset': { borderColor: 'success.light' },
                    '&.Mui-focused fieldset': { borderColor: 'success.main' },
                },
            }}
        >
            {children}
        </Box>
    );
}

// ── Hover‑animated description wrapper ─────────────────────────────────────

function DescriptionField({ value, onChange, error }) {
    const [focused, setFocused] = useState(false);
    return (
        <Box
            sx={{
                animation: `${floatUp} 0.5s 240ms cubic-bezier(0.22,1,0.36,1) both`,
            }}
        >
            <Typography variant="body2" fontWeight={500} sx={{ mb: 0.75 }}>
                Description{' '}
                <Typography component="span" color="error.main">*</Typography>
            </Typography>
            <Box
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                sx={{
                    borderRadius: 1,
                    transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                    transform: focused ? 'translateY(-2px)' : 'none',
                    boxShadow: focused
                        ? '0 6px 16px rgba(46,125,50,0.15)'
                        : 'none',
                }}
            >
                <RichTextEditor
                    value={value}
                    onChange={onChange}
                    placeholder="Describe what students will learn..."
                    minHeight={150}
                    error={error}
                    sx={{
                        '& [contenteditable="true"]': {
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            overflowWrap: 'anywhere',
                            maxWidth: '93.5%',
                        },
                    }}
                />
            </Box>
        </Box>
    );
}

// ── Main ────────────────────────────────────────────────────────────────────

const CourseDetailsFormFields = memo(function CourseDetailsFormFields({
    data,
    setData,
    errors,
    categories,
    selectedCategoryOption,
}) {
    return (
        <Stack spacing={3}>
            {/* Category */}
            <AnimatedField delay={80}>
                <Autocomplete
                    freeSolo
                    options={categories}
                    getOptionLabel={(opt) => (typeof opt === 'string' ? opt : opt.name ?? '')}
                    value={selectedCategoryOption}
                    onChange={(_, newValue) => {
                        if (typeof newValue === 'string') {
                            setData((d) => ({ ...d, category_id: null, custom_category: newValue, category_input: newValue }));
                        } else if (newValue?.id) {
                            setData((d) => ({ ...d, category_id: newValue.id, custom_category: '', category_input: newValue.name }));
                        } else {
                            setData((d) => ({ ...d, category_id: null, custom_category: '', category_input: '' }));
                        }
                    }}
                    onInputChange={(_, val, reason) => {
                        if (reason === 'input' || reason === 'clear')
                            setData((d) => ({ ...d, category_id: null, custom_category: val, category_input: val }));
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Course Category *"
                            placeholder="Select or type a custom category"
                            error={!!(errors.category_id || errors.custom_category)}
                            helperText={
                                errors.category_id || errors.custom_category ||
                                'Select from list or type your own.'
                            }
                            size="small"
                        />
                    )}
                />
            </AnimatedField>

            {/* Title */}
            <AnimatedField delay={160}>
                <TextField
                    fullWidth
                    label="Course Title *"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="e.g., Advanced Project Management Strategies"
                    inputProps={{ maxLength: 60 }}
                    size="small"
                    error={!!errors.title}
                    helperText={errors.title || 'Keep it short and catchy. Max 60 characters.'}
                />
            </AnimatedField>

            {/* Duration */}
            <AnimatedField delay={200}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                    <TextField
                        label="Duration"
                        type="number"
                        value={data.duration_value}
                        onChange={(e) => setData('duration_value', e.target.value)}
                        placeholder="e.g. 2"
                        inputProps={{ min: 0, step: 0.5 }}
                        size="small"
                        sx={{ flex: 1, minWidth: 120 }}
                        error={!!errors.duration}
                        helperText={errors.duration}
                    />
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel id="duration-unit-label">Unit</InputLabel>
                        <Select
                            labelId="duration-unit-label"
                            label="Unit"
                            value={data.duration_unit}
                            onChange={(e) => setData('duration_unit', e.target.value)}
                            sx={{
                                transition: 'box-shadow 0.22s',
                                '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
                            }}
                        >
                            <MenuItem value="hours">Hours</MenuItem>
                            <MenuItem value="minutes">Minutes</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
                {!errors.duration && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        Optional. Total course length (e.g. 2 hours or 30 minutes).
                    </Typography>
                )}
            </AnimatedField>

            {/* Description */}
            <DescriptionField
                value={data.description}
                onChange={(html) => setData('description', html)}
                error={errors.description}
            />
        </Stack>
    );
});

export default CourseDetailsFormFields;