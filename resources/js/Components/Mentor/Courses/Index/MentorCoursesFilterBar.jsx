// resources/js/Components/Mentor/Courses/Index/MentorCoursesFilterBar.jsx

import { useState, useCallback, useRef } from 'react';
import { router } from '@inertiajs/react';
import debounce from 'lodash/debounce';
import {
    Stack,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Paper,
    Slide,
    Fade,
    Chip,
    Box,
    Typography,
    keyframes,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ClearRoundedIcon  from '@mui/icons-material/ClearRounded';
import TuneRoundedIcon   from '@mui/icons-material/TuneRounded';

// Brand colours
const C = {
    green:     '#2e7d33',
    greenLight:'#edfbf3',
    amber:     '#f3a421',
    amberLight:'#fefbea',
    danger:    '#d32f2f',
};

// Easing
const EASE        = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
const EASE_SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

// Keyframes
const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-18px); }
  to   { opacity: 1; transform: translateX(0); }
`;
const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(18px); }
  to   { opacity: 1; transform: translateX(0); }
`;
const popIn = keyframes`
  from { opacity: 0; transform: scale(0.7); }
  to   { opacity: 1; transform: scale(1); }
`;
const shimmerSweep = keyframes`
  0%   { background-position: -300% center; }
  100% { background-position:  300% center; }
`;
const chipEntrance = keyframes`
  from { opacity: 0; transform: scale(0.6) translateY(6px); }
  to   { opacity: 1; transform: scale(1)   translateY(0); }
`;
const searchScan = keyframes`
  0%,100% { transform: translateX(0); }
  25%     { transform: translateX(2px); }
  75%     { transform: translateX(-2px); }
`;
const resetSpin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(180deg); }
`;

// Status label map
const STATUS_OPTIONS = [
    { value: '',            label: 'All Statuses',   chipBg: null,         chipColor: null },
    { value: 'published',   label: 'Published',      chipBg: C.greenLight, chipColor: C.green },
    { value: 'draft',       label: 'Draft',          chipBg: C.amberLight, chipColor: '#92510a' },
    { value: 'unpublished', label: 'Unpublished',    chipBg: '#fce8e6',    chipColor: C.danger },
    { value: 'archived',    label: 'Archived',       chipBg: '#f1f3f4',    chipColor: '#5f6368' },
];

const statusLabel = (val) =>
    STATUS_OPTIONS.find(o => o.value === val)?.label || val;

// Shared input style
const inputSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius:    2.5,
        backgroundColor:'#f8f9fa',
        transition:     `background-color 220ms ${EASE}, box-shadow 260ms ${EASE}, transform 260ms ${EASE_SPRING}`,
        '& fieldset': {
            borderColor: 'transparent',
            transition:  `border-color 220ms ${EASE}`,
        },
        '&:hover': {
            backgroundColor: '#f0f2f5',
            transform:       'translateY(-1px)',
            '& fieldset': { borderColor: 'rgba(0,0,0,0)' },
        },
        '&.Mui-focused': {
            backgroundColor: '#fff',
            transform:       'translateY(-2px)',
            boxShadow:       `0 6px 20px ${alpha(C.green, 0.12)}, 0 0 0 2px ${alpha(C.green, 0.12)}`,
            '& fieldset': { borderColor: C.green },
        },
    },
};

// Filter chip
function FilterChip({ label, onDelete }) {
    const [hovered, setHovered] = useState(false);
    return (
        <Chip
            label={label}
            onDelete={onDelete}
            size="small"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{
                animation:   `${chipEntrance} 0.35s ${EASE_SPRING} both`,
                fontWeight:   600,
                fontSize:    '0.72rem',
                bgcolor:      hovered ? alpha(C.green, 0.14) : alpha(C.green, 0.08),
                color:        C.green,
                border:      '1px solid',
                borderColor:  hovered ? C.green : alpha(C.green, 0.25),
                transition:  `background 220ms ${EASE}, border-color 220ms ${EASE}, transform 240ms ${EASE_SPRING}`,
                transform:    hovered ? 'scale(1.06)' : 'scale(1)',
                '& .MuiChip-deleteIcon': {
                    color:      alpha(C.green, 0.6),
                    transition:`color 200ms ${EASE}, transform 220ms ${EASE_SPRING}`,
                    '&:hover': { color: C.danger, transform: 'rotate(90deg) scale(1.2)' },
                },
            }}
        />
    );
}

// Search field
function SearchField({ value, onChange }) {
    const [focused, setFocused] = useState(false);
    const [typing,  setTyping]  = useState(false);
    const typingTimer = useRef(null);

    const handleChange = (e) => {
        onChange(e.target.value);
        setTyping(true);
        clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => setTyping(false), 800);
    };

    return (
        <TextField
            fullWidth
            placeholder="Search courses or categories..."
            value={value}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            size="small"
            sx={{
                animation: `${slideInLeft} 0.45s ${EASE} 0.05s both`,
                ...inputSx,
                '& .MuiInputLabel-root.Mui-focused':             { color: C.green },
                '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: C.green },
            }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchRoundedIcon
                            className="search-icon"
                            sx={{
                                color:     focused ? C.green : 'action.active',
                                transition:`color 220ms ${EASE}, transform 280ms ${EASE_SPRING}`,
                                animation:  typing ? `${searchScan} 0.4s ${EASE} infinite` : 'none',
                            }}
                        />
                    </InputAdornment>
                ),
                endAdornment: value ? (
                    <InputAdornment position="end">
                        <Fade in={!!value} timeout={200}>
                            <ClearRoundedIcon
                                onClick={() => onChange('')}
                                sx={{
                                    fontSize:  18,
                                    cursor:   'pointer',
                                    color:    'text.disabled',
                                    transition:`color 200ms ${EASE}, transform 240ms ${EASE_SPRING}`,
                                    '&:hover': { color: C.danger, transform: 'scale(1.2) rotate(90deg)' },
                                }}
                            />
                        </Fade>
                    </InputAdornment>
                ) : null,
            }}
        />
    );
}

// Animated Select
function AnimatedSelect({ label, value, onChange, children, delay = '0s' }) {
    const [open, setOpen] = useState(false);
    return (
        <FormControl
            size="small"
            fullWidth
            sx={{
                animation: `${slideInRight} 0.45s ${EASE} ${delay} both`,
                ...inputSx,
                '& .MuiInputLabel-root.Mui-focused':             { color: C.green },
                '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: C.green },
            }}
        >
            <InputLabel>{label}</InputLabel>
            <Select
                value={value}
                label={label}
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                onChange={onChange}
                MenuProps={{
                    PaperProps: {
                        sx: {
                            borderRadius: 2.5,
                            mt:           0.5,
                            boxShadow:   '0 8px 32px rgba(0,0,0,0.12)',
                            animation:   `${popIn} 0.22s ${EASE_SPRING} both`,
                            '& .MuiMenuItem-root': {
                                borderRadius: 1,
                                mx:           0.5,
                                transition:  `background 180ms ${EASE}, padding-left 180ms ${EASE}`,
                                '&:hover':   { bgcolor: alpha(C.green, 0.08), pl: 2.5 },
                                '&.Mui-selected': {
                                    bgcolor:    alpha(C.green, 0.1),
                                    fontWeight:  600,
                                    color:       C.green,
                                    '&:hover':  { bgcolor: alpha(C.green, 0.15) },
                                },
                            },
                        },
                    },
                }}
            >
                {children}
            </Select>
        </FormControl>
    );
}

// Reset Button
function ResetButton({ onClick, visible }) {
    const [hovered,  setHovered]  = useState(false);
    const [spinning, setSpinning] = useState(false);

    const handleClick = () => {
        setSpinning(true);
        setTimeout(() => setSpinning(false), 420);
        onClick();
    };

    return (
        <Fade in={visible} timeout={{ enter: 300, exit: 200 }} style={{ transitionTimingFunction: EASE }}>
            <span style={{ display: 'flex', alignItems: 'stretch', width: '100%' }}>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={handleClick}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    startIcon={
                        <ClearRoundedIcon sx={{
                            animation:  spinning ? `${resetSpin} 0.38s ${EASE_SPRING} both` : 'none',
                            transition:`transform 260ms ${EASE_SPRING}`,
                            transform:  !spinning && hovered ? 'rotate(90deg)' : 'rotate(0deg)',
                        }} />
                    }
                    sx={{
                        width:         '100%',
                        whiteSpace:    'nowrap',
                        borderRadius:   2.5,
                        textTransform: 'none',
                        fontWeight:     700,
                        borderWidth:   '1.5px',
                        borderColor:    C.danger,
                        color:          C.danger,
                        animation:      visible ? `${popIn} 0.3s ${EASE_SPRING} both` : 'none',
                        transition:    `background-color 200ms ${EASE}, transform 260ms ${EASE_SPRING}, box-shadow 240ms ${EASE}`,
                        transform:      hovered ? 'scale(1.05) translateY(-2px)' : 'scale(1)',
                        boxShadow:      hovered ? `0 6px 18px ${alpha(C.danger, 0.18)}` : 'none',
                        '&:hover': {
                            borderWidth:     '1.5px',
                            borderColor:      C.danger,
                            backgroundColor:  alpha(C.danger, 0.06),
                        },
                        '&:active': {
                            transform:  'scale(0.97)',
                            transition: `transform 80ms ${EASE}`,
                        },
                    }}
                >
                    Reset
                </Button>
            </span>
        </Fade>
    );
}

// Main component
export default function MentorFilterBar({ filters }) {
    const [values, setValues] = useState({
        search: filters.search || '',
        status: filters.status || '',
        sort:   typeof filters?.sort === 'string' ? filters.sort : 'newest',
    });

    const [paperHovered, setPaperHovered] = useState(false);

    const triggerSearch = useCallback(
        debounce((query) => {
            router.get(route('mentor.courses.index'), query, {
                preserveState:  true,
                preserveScroll: true,
                replace:        true,
            });
        }, 300),
        []
    );

    const handleChange = (field, value) => {
        const next = { ...values, [field]: value };
        setValues(next);
        triggerSearch(next);
    };

    const handleClearFilters = () => {
        const reset = { search: '', status: '', sort: 'newest' };
        setValues(reset);
        triggerSearch(reset);
    };

    const hasActiveFilters = Boolean(
        values.search || values.status || values.sort !== 'newest'
    );

    const activeChips = [
        values.search            && { key: 'search',  label: `"${values.search}"`,          clear: () => handleChange('search',  '') },
        values.status            && { key: 'status',  label: statusLabel(values.status),    clear: () => handleChange('status',  '') },
        values.sort !== 'newest' && { key: 'sort',    label: `Sort: ${values.sort}`,        clear: () => handleChange('sort', 'newest') },
    ].filter(Boolean);

    return (
        <Slide direction="down" in mountOnEnter unmountOnExit
            timeout={{ enter: 440, exit: 260 }}
            easing={{ enter: EASE, exit: EASE }}
        >
            <Paper
                elevation={0}
                onMouseEnter={() => setPaperHovered(true)}
                onMouseLeave={() => setPaperHovered(false)}
                sx={{
                    p:               2.5,
                    mb:              4,
                    borderRadius:    3.5,
                    border:         '1px solid',
                    borderColor:     paperHovered ? alpha(C.green, 0.22) : 'divider',
                    backgroundColor:'#fff',
                    boxShadow:       paperHovered
                        ? '0 12px 36px rgba(0,0,0,0.09)'
                        : '0 2px 8px rgba(0,0,0,0.04)',
                    transition:     `transform 320ms ${EASE_SPRING}, box-shadow 320ms ${EASE}, border-color 280ms ${EASE}`,
                    transform:       paperHovered ? 'translateY(-3px)' : 'translateY(0)',
                    position:       'relative',
                    overflow:       'hidden',
                    '&::before': {
                        content:        '""',
                        position:       'absolute',
                        left:            0,
                        top:            '10%',
                        bottom:         '10%',
                        width:           3,
                        borderRadius:   '0 3px 3px 0',
                        bgcolor:         C.green,
                        transform:       paperHovered ? 'scaleY(1)' : 'scaleY(0)',
                        transformOrigin:'center',
                        transition:     `transform 340ms ${EASE_SPRING}`,
                    },
                    '&::after': {
                        content:         '""',
                        position:        'absolute',
                        inset:            0,
                        pointerEvents:   'none',
                        background:       paperHovered
                            ? `linear-gradient(105deg, transparent 30%, ${alpha(C.green, 0.025)} 50%, transparent 70%)`
                            : 'transparent',
                        backgroundSize:  '300% auto',
                        animation:        paperHovered ? `${shimmerSweep} 2.2s linear infinite` : 'none',
                    },
                }}
            >
                {/* Header row */}
                <Box sx={{
                    display:    'flex',
                    alignItems: 'center',
                    flexWrap:   'wrap',
                    gap:         1,
                    mb:          2,
                    animation:  `${slideInLeft} 0.4s ${EASE} both`,
                }}>
                    <TuneRoundedIcon sx={{
                        fontSize:  18,
                        color:     C.green,
                        transition:`transform 300ms ${EASE_SPRING}`,
                        transform:  paperHovered ? 'rotate(-15deg) scale(1.15)' : 'rotate(0deg)',
                    }} />
                    <Typography variant="caption" fontWeight={700} letterSpacing={0.8}
                        sx={{ color: 'text.secondary', textTransform: 'uppercase', userSelect: 'none' }}
                    >
                        Filter & Sort
                    </Typography>

                    {activeChips.length > 0 && (
                        <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ ml: 0.5 }}>
                            {activeChips.map((c) => (
                                <FilterChip key={c.key} label={c.label} onDelete={c.clear} />
                            ))}
                        </Stack>
                    )}
                </Box>

            {/* Controls */}
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                alignItems="center"
                sx={{ width: '100%' }}
            >
                {/* Search Box: Takes 75% normally, 60% when Reset is visible */}
                <Box sx={{
                    width: { xs: '100%', md: hasActiveFilters ? '60%' : '75%' },
                    transition: 'width 0.3s ease'
                }}>
                    <SearchField
                        value={values.search}
                        onChange={(v) => handleChange('search', v)}
                    />
                </Box>

                {/* Status Box: Strictly 25% */}
                <Box sx={{
                    width: { xs: '100%', md: '25%' },
                    transition: 'width 0.3s ease'
                }}>
                    <AnimatedSelect
                        label="Status"
                        value={values.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        delay="0.08s"
                    >
                        <MenuItem value=""><em>All Statuses</em></MenuItem>
                        <MenuItem value="published">
                            <Box component="span" sx={{
                                display: 'inline-flex', alignItems: 'center', gap: 0.75,
                                '&::before': { content: '""', width: 7, height: 7, borderRadius: '50%', bgcolor: C.green, flexShrink: 0 },
                            }}>Published</Box>
                        </MenuItem>
                        <MenuItem value="draft">
                            <Box component="span" sx={{
                                display: 'inline-flex', alignItems: 'center', gap: 0.75,
                                '&::before': { content: '""', width: 7, height: 7, borderRadius: '50%', bgcolor: C.amber, flexShrink: 0 },
                            }}>Draft</Box>
                        </MenuItem>
                        <MenuItem value="archived">
                            <Box component="span" sx={{
                                display: 'inline-flex', alignItems: 'center', gap: 0.75,
                                '&::before': { content: '""', width: 7, height: 7, borderRadius: '50%', bgcolor: '#9e9e9e', flexShrink: 0 },
                            }}>Unpublished</Box>
                        </MenuItem>
                    </AnimatedSelect>
                </Box>

                {/* Reset button only renders when filters are active */}
                {hasActiveFilters && (
                    <Box sx={{
                        width: { xs: '100%', md: '15%' },
                        minWidth: 110,
                        transition: 'width 0.3s ease'
                    }}>
                        <ResetButton onClick={handleClearFilters} visible={hasActiveFilters} />
                    </Box>
                )}
            </Stack>
            </Paper>
        </Slide>
    );
}
