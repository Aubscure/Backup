/**
 * Mentor / Courses / Edit
 *
 * Lets a mentor edit the core details of a course (title, description,
 * category, duration, thumbnail).  Specialist sections (syllabus, media,
 * pricing, assessments) are handled by their own modal dialogs.
 *
 * Publishing has been intentionally moved to the Course Overview (Show.jsx)
 * so that the full readiness checklist (including the certificate requirement)
 * is visible before the action is taken.
 */

import MentorLayout from '@/Layouts/MentorLayout';
import EditSyllabusModal     from '@/Components/Mentor/Courses/Edit/EditSyllabusModal';
import EditMediaContentModal from '@/Components/Mentor/Courses/Edit/EditMediaContentModal';
import EditPricingModal      from '@/Components/Mentor/Courses/Edit/EditPricingModal';
import EditAssessmentModal   from '@/Components/Mentor/Courses/Edit/EditAssessmentModal';
import RichTextEditor        from '@/Components/Mentor/Courses/MentorRichTextEditor';

import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import {
    Box, Typography, Button, Paper, TextField, IconButton,
    Tooltip, Stack, Autocomplete, Divider, Chip, Alert,
    InputAdornment, Select, MenuItem,
} from '@mui/material';

// Icons
import CloudUploadIcon         from '@mui/icons-material/CloudUpload';
import CloseIcon               from '@mui/icons-material/Close';
import EditIcon                from '@mui/icons-material/Edit';
import FormatListBulletedIcon  from '@mui/icons-material/FormatListBulleted';
import AccessTimeIcon          from '@mui/icons-material/AccessTime';
import AssignmentIcon          from '@mui/icons-material/Assignment';
import RocketLaunchIcon        from '@mui/icons-material/RocketLaunch';
import PlayCircleOutlineIcon   from '@mui/icons-material/PlayCircleOutline';
import DescriptionIcon         from '@mui/icons-material/Description';
import PersonIcon              from '@mui/icons-material/Person';
import BusinessIcon            from '@mui/icons-material/Business';
import VideoLibraryIcon        from '@mui/icons-material/VideoLibrary';
import AttachMoneyIcon         from '@mui/icons-material/AttachMoney';
import CheckCircleIcon         from '@mui/icons-material/CheckCircle';
import SaveIcon                from '@mui/icons-material/Save';

// ─────────────────────────────────────────────────────────────────────────────

export default function Edit({ course, categories }) {
    const { errors, flash } = usePage().props;

    const fileInputRef = useRef(null);
    const editorRef    = useRef(null);

    const [processing,      setProcessing]      = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState(course.course_thumbnail_url || null);
    const [isEditingTitle,  setIsEditingTitle]  = useState(false);

    // ── Modal visibility ──────────────────────────────────────────────────────
    const [syllabusModalOpen,   setSyllabusModalOpen]   = useState(false);
    const [mediaModalOpen,      setMediaModalOpen]      = useState(false);
    const [pricingModalOpen,    setPricingModalOpen]    = useState(false);
    const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);

    // ── Duration parsing ──────────────────────────────────────────────────────
    const parseDuration = (str) => {
        if (!str) return { value: '', unit: 'hours' };
        const m = str.match(/^(\d+)\s*(h|hours?|m|minutes?)$/i);
        if (m) {
            return {
                value: m[1],
                unit:  m[2].toLowerCase().startsWith('h') ? 'hours' : 'minutes',
            };
        }
        const n = str.match(/^(\d+)/);
        return n ? { value: n[1], unit: 'hours' } : { value: str, unit: 'hours' };
    };

    const init = parseDuration(course.duration || '');
    const [durationValue, setDurationValue] = useState(init.value);
    const [durationUnit,  setDurationUnit]  = useState(init.unit);

    // ── Form state ────────────────────────────────────────────────────────────
    const [formData, setFormData] = useState({
        category_input:   course.category ? course.category.name : (course.custom_category || ''),
        category_id:      course.category_id || null,
        custom_category:  course.custom_category || '',
        title:            course.title || '',
        description:      course.description || '',
        duration:         course.duration || '',
        course_thumbnail: null,
    });

    useEffect(() => {
        if (editorRef.current && !editorRef.current.hasAttribute('data-init')) {
            editorRef.current.innerHTML = formData.description;
            editorRef.current.setAttribute('data-init', 'true');
        }
    }, []);

    const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

    // ── Thumbnail helpers ─────────────────────────────────────────────────────
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        set('course_thumbnail', file);
        const reader = new FileReader();
        reader.onload = (ev) => setThumbnailPreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const removeThumbnail = () => {
        set('course_thumbnail', null);
        setThumbnailPreview(course.course_thumbnail_url || null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // ── Currency formatter ────────────────────────────────────────────────────
    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-PH', {
            style: 'currency', currency: 'PHP', minimumFractionDigits: 2,
        }).format(amount || 0);

    // ── Build shared payload ──────────────────────────────────────────────────
    const buildPayload = (extra = {}) => ({
        _method:          'put',
        title:            formData.title,
        description:      formData.description,
        duration:         durationValue
                              ? `${durationValue}${durationUnit === 'hours' ? 'h' : 'm'}`
                              : '',
        category_id:      formData.category_id || '',
        custom_category:  formData.category_id
                              ? ''
                              : (formData.category_input || formData.custom_category || ''),
        course_thumbnail: formData.course_thumbnail,
        ...extra,
    });

    // ── Save as Draft ─────────────────────────────────────────────────────────
    const handleSaveAsDraft = (e) => {
        e?.preventDefault();
        setProcessing(true);
        router.post(
            route('mentor.courses.update', course.id),
            buildPayload({ save_as_draft: true }),
            {
                forceFormData:  true,
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            },
        );
    };

    // ── Update (normal save) ──────────────────────────────────────────────────
    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        router.post(
            route('mentor.courses.update', course.id),
            buildPayload(),
            {
                forceFormData:  true,
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            },
        );
    };

    // ── Pricing helpers ───────────────────────────────────────────────────────
    const coursePlans      = course.course_plans ?? course.coursePlans ?? [];
    const individualPlan   = coursePlans.find(p => p.type === 'individual');
    const organizationPlan = coursePlans.find(p => p.type === 'organization');

    // ── Derived counts ────────────────────────────────────────────────────────
    const syllabuses = course.syllabuses ?? [];

    const totalAssessments = syllabuses.reduce((acc, syllabus) => {
        let count = syllabus.assessments?.length || 0;
        (syllabus.lessons || []).forEach(lesson => {
            count += lesson.assessments?.length || 0;
        });
        return acc + count;
    }, 0);

    const selectedCategoryOption = formData.category_id
        ? (categories.find(c => c.id === formData.category_id) || null)
        : (formData.category_input || null);

    const isDraft = course.draft_status === 'draft';

    // ── Section header ────────────────────────────────────────────────────────
    const SectionHeader = ({ icon, title, onEdit }) => (
        <Box sx={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', mb: 3,
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {icon}
                <Typography variant="h6" fontWeight="bold">{title}</Typography>
            </Box>
            <Tooltip title={`Edit ${title}`}>
                <IconButton
                    onClick={onEdit}
                    size="small"
                    sx={{
                        bgcolor: 'success.50',
                        color: 'success.main',
                        border: '1px solid',
                        borderColor: 'success.light',
                        '&:hover': { bgcolor: 'success.100', borderColor: 'success.main' },
                    }}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </Box>
    );

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <>
            <Head title="Course Editor" />

            <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ my: 4, maxWidth: 'auto', px: { xs: 2, sm: 3, lg: 4 } }}>

                        {/* Flash */}
                        {flash?.success && (
                            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} icon={<CheckCircleIcon />}>
                                {flash.success}
                            </Alert>
                        )}

                        {/* ── Page header ───────────────────────────────────── */}
                        <Box sx={{
                            mb: 4,
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 2,
                        }}>
                            <Box>
                                <Typography
                                    variant="caption"
                                    color="success.main"
                                    fontWeight={600}
                                    sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                >
                                    COURSE EDITOR
                                </Typography>
                                <Typography variant="h4" fontWeight="bold" sx={{ mt: 0.5 }}>
                                    {course.title}
                                </Typography>
                            </Box>

                            {isDraft && (
                                <Chip
                                    label="DRAFT"
                                    sx={{
                                        bgcolor: '#FEF3C7',
                                        color: '#D97706',
                                        fontWeight: 700,
                                        borderRadius: 1,
                                        letterSpacing: 0.5,
                                        mt: 0.5,
                                    }}
                                />
                            )}
                        </Box>

                        <Box component="form" onSubmit={handleSubmit}>

                            {/* ── 1. COURSE DETAILS ───────────────────────── */}
                            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                                    Course Details
                                </Typography>

                                <Box sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr', lg: '3fr 2fr' },
                                    gap: 4,
                                }}>
                                    <Stack spacing={3}>

                                        {/* Title */}
                                        <Box>
                                            <Typography
                                                variant="body2"
                                                fontWeight={500}
                                                sx={{ mb: 0.75, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                            >
                                                COURSE TITLE
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {isEditingTitle ? (
                                                    <TextField
                                                        fullWidth
                                                        value={formData.title}
                                                        onChange={e => set('title', e.target.value)}
                                                        onBlur={() => setIsEditingTitle(false)}
                                                        onKeyDown={e => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                setIsEditingTitle(false);
                                                            }
                                                        }}
                                                        autoFocus
                                                        size="small"
                                                        inputProps={{ maxLength: 60 }}
                                                        error={!!errors.title}
                                                        helperText={errors.title}
                                                    />
                                                ) : (
                                                    <>
                                                        <Typography variant="body1" sx={{ flex: 1 }}>
                                                            {formData.title || (
                                                                <span style={{ color: '#9e9e9e' }}>No title set</span>
                                                            )}
                                                        </Typography>
                                                        <IconButton size="small" onClick={() => setIsEditingTitle(true)}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </>
                                                )}
                                            </Box>
                                            {errors.title && !isEditingTitle && (
                                                <Typography variant="caption" color="error.main">
                                                    {errors.title}
                                                </Typography>
                                            )}
                                        </Box>

                                        {/* Description */}
                                        <Box>
                                            <Typography
                                                variant="body2"
                                                fontWeight={500}
                                                sx={{ mb: 0.75, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                            >
                                                ABOUT THIS COURSE
                                            </Typography>
                                            <RichTextEditor
                                                value={formData.description}
                                                onChange={(html) => set('description', html)}
                                                placeholder="Describe what students will learn..."
                                                minHeight={120}
                                                error={errors.description}
                                                sx={{
                                                    '& [contenteditable="true"]': {
                                                        whiteSpace: 'pre-wrap',
                                                        wordBreak: 'break-word',
                                                        overflowWrap: 'anywhere',
                                                        maxWidth: '94.9%',
                                                    },
                                                }}
                                            />
                                        </Box>

                                        {/* Category */}
                                        <Box>
                                            <Typography
                                                variant="body2"
                                                fontWeight={500}
                                                sx={{ mb: 0.75, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                            >
                                                CATEGORY
                                            </Typography>
                                            <Autocomplete
                                                freeSolo
                                                options={categories}
                                                getOptionLabel={opt =>
                                                    typeof opt === 'string' ? opt : (opt.name || '')
                                                }
                                                value={selectedCategoryOption}
                                                onChange={(_, newValue) => {
                                                    if (typeof newValue === 'string') {
                                                        setFormData(p => ({
                                                            ...p,
                                                            category_id: null,
                                                            custom_category: newValue,
                                                            category_input: newValue,
                                                        }));
                                                    } else if (newValue?.id) {
                                                        setFormData(p => ({
                                                            ...p,
                                                            category_id: newValue.id,
                                                            custom_category: '',
                                                            category_input: newValue.name,
                                                        }));
                                                    } else {
                                                        setFormData(p => ({
                                                            ...p,
                                                            category_id: null,
                                                            custom_category: '',
                                                            category_input: '',
                                                        }));
                                                    }
                                                }}
                                                onInputChange={(_, newInput, reason) => {
                                                    if (reason === 'input' || reason === 'clear') {
                                                        setFormData(p => ({
                                                            ...p,
                                                            category_id: null,
                                                            custom_category: newInput,
                                                            category_input: newInput,
                                                        }));
                                                    }
                                                }}
                                                renderInput={params => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Select or type a custom category"
                                                        error={!!(errors.category_id || errors.custom_category)}
                                                        helperText={errors.category_id || errors.custom_category}
                                                        size="small"
                                                    />
                                                )}
                                            />
                                        </Box>

                                        {/* Duration */}
                                        <Box>
                                            <Typography
                                                variant="body2"
                                                fontWeight={500}
                                                sx={{ mb: 0.75, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                            >
                                                DURATION
                                            </Typography>
                                            <Stack direction="row" spacing={1}>
                                                <TextField
                                                    type="number"
                                                    value={durationValue}
                                                    onChange={e => setDurationValue(e.target.value)}
                                                    placeholder="e.g., 260"
                                                    size="small"
                                                    error={!!errors.duration}
                                                    helperText={errors.duration}
                                                    inputProps={{ min: 0 }}
                                                    sx={{ flex: 1 }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <AccessTimeIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                                <Select
                                                    value={durationUnit}
                                                    onChange={e => setDurationUnit(e.target.value)}
                                                    size="small"
                                                    sx={{ minWidth: 120 }}
                                                >
                                                    <MenuItem value="hours">Hours</MenuItem>
                                                    <MenuItem value="minutes">Minutes</MenuItem>
                                                </Select>
                                            </Stack>
                                        </Box>
                                    </Stack>

                                    {/* Right column: thumbnail + price */}
                                    <Box>
                                        {/* Thumbnail */}
                                        <Box sx={{ mb: 3 }}>
                                            <Typography
                                                variant="body2"
                                                fontWeight={500}
                                                sx={{ mb: 0.75, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                            >
                                                COURSE IMAGE
                                            </Typography>
                                            <Box
                                                onClick={() => fileInputRef.current?.click()}
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    minHeight: 220,
                                                    border: '2px dashed',
                                                    borderColor: errors.course_thumbnail
                                                        ? 'error.main'
                                                        : 'grey.300',
                                                    borderRadius: 3,
                                                    bgcolor: 'grey.50',
                                                    p: 4,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        borderColor: 'success.light',
                                                        bgcolor: 'success.50',
                                                    },
                                                }}
                                            >
                                                {thumbnailPreview ? (
                                                    <Box sx={{ position: 'relative', width: '100%' }}>
                                                        <Box
                                                            component="img"
                                                            src={thumbnailPreview}
                                                            alt="Thumbnail"
                                                            sx={{
                                                                mx: 'auto',
                                                                maxHeight: 192,
                                                                borderRadius: 2,
                                                                objectFit: 'cover',
                                                                display: 'block',
                                                                width: '100%',
                                                            }}
                                                        />
                                                        <IconButton
                                                            size="small"
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                                removeThumbnail();
                                                            }}
                                                            sx={{
                                                                position: 'absolute',
                                                                top: -8,
                                                                right: -8,
                                                                bgcolor: 'error.main',
                                                                color: 'white',
                                                                '&:hover': { bgcolor: 'error.dark' },
                                                            }}
                                                        >
                                                            <CloseIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                ) : (
                                                    <>
                                                        <Box sx={{ mb: 1.5, borderRadius: '50%', bgcolor: 'grey.200', p: 2 }}>
                                                            <CloudUploadIcon sx={{ fontSize: 32, color: 'grey.400' }} />
                                                        </Box>
                                                        <Typography variant="body2" fontWeight={500} color="text.secondary">
                                                            Click to upload image
                                                        </Typography>
                                                        <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5 }}>
                                                            PNG, JPG or GIF (Max 5MB)
                                                        </Typography>
                                                    </>
                                                )}
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/gif"
                                                    onChange={handleThumbnailChange}
                                                    style={{ display: 'none' }}
                                                />
                                            </Box>
                                            {errors.course_thumbnail && (
                                                <Typography variant="caption" color="error.main">
                                                    {errors.course_thumbnail}
                                                </Typography>
                                            )}
                                        </Box>

                                        {/* Price summary */}
                                        <Paper
                                            variant="outlined"
                                            sx={{ p: 3, borderColor: 'success.light', bgcolor: 'success.50' }}
                                        >
                                            <Typography
                                                variant="body2"
                                                fontWeight={500}
                                                sx={{
                                                    mb: 1,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                    color: 'text.secondary',
                                                }}
                                            >
                                                STANDARD MARKET PRICE (INDIVIDUAL PLAN)
                                            </Typography>
                                            <Typography variant="h4" fontWeight="bold" color="success.main">
                                                {formatCurrency(individualPlan?.price ?? 0)}
                                            </Typography>
                                        </Paper>
                                    </Box>
                                </Box>
                            </Paper>

                            {/* ── 2. COURSE SYLLABUS ──────────────────────── */}
                            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
                                <SectionHeader
                                    icon={<AssignmentIcon sx={{ color: 'success.main' }} />}
                                    title="Course Syllabus"
                                    onEdit={() => setSyllabusModalOpen(true)}
                                />
                                {syllabuses.length > 0 ? (
                                    <Stack spacing={2}>
                                        {syllabuses.map((syllabus, idx) => (
                                            <Box key={syllabus.id}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    mb: 1,
                                                }}>
                                                    <Typography variant="body1" fontWeight={600}>
                                                        {String(idx + 1).padStart(2, '0')}&nbsp;&nbsp;
                                                        {syllabus.title}
                                                    </Typography>
                                                </Box>
                                                {(syllabus.lessons ?? []).length > 0 && (
                                                    <Box sx={{ pl: 3 }}>
                                                        {syllabus.lessons.map((lesson, li) => (
                                                            <Typography
                                                                key={lesson.id}
                                                                variant="body2"
                                                                color="text.secondary"
                                                                sx={{ mb: 0.5 }}
                                                            >
                                                                {idx + 1}.{li + 1}&nbsp;&nbsp;{lesson.title}
                                                            </Typography>
                                                        ))}
                                                    </Box>
                                                )}
                                                {idx < syllabuses.length - 1 && <Divider sx={{ mt: 2 }} />}
                                            </Box>
                                        ))}
                                    </Stack>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        No syllabus yet. Click the edit icon to add modules and lessons.
                                    </Typography>
                                )}
                            </Paper>

                            {/* ── 3. ASSESSMENTS ──────────────────────────── */}
                            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
                                <SectionHeader
                                    icon={<FormatListBulletedIcon sx={{ color: 'success.main' }} />}
                                    title="Assessments"
                                    onEdit={() => setAssessmentModalOpen(true)}
                                />
                                {totalAssessments > 0 ? (
                                    <Typography variant="body1" fontWeight={600}>
                                        {totalAssessments} Assessment
                                        {totalAssessments !== 1 ? 's' : ''} assigned to this course.
                                    </Typography>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        No assessments added yet. Click the edit icon to manage.
                                    </Typography>
                                )}
                            </Paper>

                            {/* ── 4. MEDIA CONTENT ────────────────────────── */}
                            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
                                <SectionHeader
                                    icon={<VideoLibraryIcon sx={{ color: 'success.main' }} />}
                                    title="Media Content"
                                    onEdit={() => setMediaModalOpen(true)}
                                />
                                {syllabuses.length > 0 ? (
                                    <Stack spacing={2}>
                                        {syllabuses.map(syllabus => {
                                            const totalMediaCount = (syllabus.lessons ?? []).reduce(
                                                (acc, l) =>
                                                    acc + (l.materials?.length || 0) + (l.videos?.length || 0),
                                                0,
                                            );
                                            return (
                                                <Box
                                                    key={syllabus.id}
                                                    sx={{
                                                        border: 1,
                                                        borderColor: 'divider',
                                                        borderRadius: 2,
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    <Box sx={{
                                                        px: 3, py: 1.5,
                                                        bgcolor: 'grey.50',
                                                        borderBottom: 1,
                                                        borderColor: 'divider',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                    }}>
                                                        <Typography
                                                            variant="body2"
                                                            fontWeight={700}
                                                            sx={{
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.05em',
                                                                color: 'text.secondary',
                                                            }}
                                                        >
                                                            {syllabus.title}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {totalMediaCount}{' '}
                                                            {totalMediaCount === 1 ? 'resource' : 'resources'}
                                                        </Typography>
                                                    </Box>

                                                    {(syllabus.lessons ?? []).map(lesson => {
                                                        const combined = [
                                                            ...(lesson.videos || []).map(v => ({
                                                                id:    `vid-${v.id}`,
                                                                title: v.title ?? 'Video Lesson',
                                                                type:  'vimeo_video',
                                                                duration:      v.duration,
                                                                thumbnail_url: v.thumbnail_url,
                                                            })),
                                                            ...(lesson.materials || []).map(m => ({
                                                                id:            `mat-${m.id}`,
                                                                title:         m.title,
                                                                type:          m.type,
                                                                original_name: m.original_name,
                                                                size_bytes:    m.size_bytes,
                                                            })),
                                                        ];

                                                        return (
                                                            <Box
                                                                key={lesson.id}
                                                                sx={{
                                                                    px: 3, py: 1.5,
                                                                    borderBottom: 1,
                                                                    borderColor: 'divider',
                                                                    '&:last-child': { borderBottom: 0 },
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant="body2"
                                                                    fontWeight={500}
                                                                    sx={{ mb: 1 }}
                                                                >
                                                                    {lesson.title}
                                                                </Typography>

                                                                {combined.length > 0 ? (
                                                                    <Stack spacing={1}>
                                                                        {combined.map(m => (
                                                                            <Box
                                                                                key={m.id}
                                                                                sx={{
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    gap: 1.5,
                                                                                    p: 1.5,
                                                                                    bgcolor: 'grey.50',
                                                                                    borderRadius: 1.5,
                                                                                }}
                                                                            >
                                                                                <Box sx={{
                                                                                    width: 32, height: 32,
                                                                                    borderRadius: '50%',
                                                                                    bgcolor: 'white',
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'center',
                                                                                    boxShadow: 1,
                                                                                    flexShrink: 0,
                                                                                }}>
                                                                                    {m.type === 'vimeo_video' || m.type === 'video'
                                                                                        ? <PlayCircleOutlineIcon sx={{ color: '#ef4444', fontSize: 18 }} />
                                                                                        : <DescriptionIcon sx={{ color: '#3b82f6', fontSize: 18 }} />
                                                                                    }
                                                                                </Box>
                                                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                                                    <Typography
                                                                                        variant="body2"
                                                                                        fontWeight={500}
                                                                                        noWrap
                                                                                    >
                                                                                        {m.title}
                                                                                    </Typography>
                                                                                    <Typography
                                                                                        variant="caption"
                                                                                        color="text.secondary"
                                                                                        noWrap
                                                                                        sx={{ display: 'block' }}
                                                                                    >
                                                                                        {m.type === 'vimeo_video'
                                                                                            ? 'Vimeo Video'
                                                                                            : m.type === 'video'
                                                                                                ? 'MP4 Video'
                                                                                                : m.original_name?.split('.').pop()?.toUpperCase() ?? 'Document'
                                                                                        }
                                                                                        {m.duration
                                                                                            ? ` • ${Math.floor(m.duration / 60)}:${String(m.duration % 60).padStart(2, '0')}`
                                                                                            : ''
                                                                                        }
                                                                                        {m.size_bytes
                                                                                            ? ` • ${(m.size_bytes / 1024 / 1024).toFixed(1)} MB`
                                                                                            : ''
                                                                                        }
                                                                                    </Typography>
                                                                                </Box>
                                                                            </Box>
                                                                        ))}
                                                                    </Stack>
                                                                ) : (
                                                                    <Typography variant="caption" color="text.disabled">
                                                                        No media yet
                                                                    </Typography>
                                                                )}
                                                            </Box>
                                                        );
                                                    })}
                                                </Box>
                                            );
                                        })}
                                    </Stack>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        No modules yet. Add syllabus first, then upload media.
                                    </Typography>
                                )}
                            </Paper>

                            {/* ── 5. PRICING ──────────────────────────────── */}
                            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
                                <SectionHeader
                                    icon={<AttachMoneyIcon sx={{ color: 'success.main' }} />}
                                    title="Pricing"
                                    onEdit={() => setPricingModalOpen(true)}
                                />
                                {coursePlans.length > 0 ? (
                                    <Box sx={{
                                        display: 'grid',
                                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                        gap: 2,
                                    }}>
                                        {individualPlan && (
                                            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                                                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                                                    <Box sx={{
                                                        width: 36, height: 36, borderRadius: '50%',
                                                        bgcolor: 'success.light',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }}>
                                                        <PersonIcon sx={{ color: 'success.main', fontSize: 20 }} />
                                                    </Box>
                                                    <Typography variant="subtitle1" fontWeight={600}>
                                                        Individual
                                                    </Typography>
                                                </Stack>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    mb: 1,
                                                }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Base Rate (PHP)
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight={700}>
                                                        {parseFloat(individualPlan.price) === 0
                                                            ? 'FREE'
                                                            : formatCurrency(individualPlan.price)
                                                        }
                                                    </Typography>
                                                </Box>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Access
                                                    </Typography>
                                                    <Chip
                                                        label={individualPlan.duration || 'Lifetime'}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: 'success.50',
                                                            color: 'success.dark',
                                                            fontWeight: 600,
                                                        }}
                                                    />
                                                </Box>
                                            </Paper>
                                        )}

                                        {organizationPlan && (
                                            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                                                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                                                    <Box sx={{
                                                        width: 36, height: 36, borderRadius: '50%',
                                                        bgcolor: 'primary.light',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }}>
                                                        <BusinessIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                                    </Box>
                                                    <Typography variant="subtitle1" fontWeight={600}>
                                                        Organization
                                                    </Typography>
                                                </Stack>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    mb: 1,
                                                }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Base Rate (PHP)
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight={700}>
                                                        {parseFloat(organizationPlan.price) === 0
                                                            ? 'FREE'
                                                            : formatCurrency(organizationPlan.price)
                                                        }
                                                    </Typography>
                                                </Box>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Access
                                                    </Typography>
                                                    <Chip
                                                        label={organizationPlan.duration || 'Lifetime'}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: 'primary.50',
                                                            color: 'primary.dark',
                                                            fontWeight: 600,
                                                        }}
                                                    />
                                                </Box>
                                            </Paper>
                                        )}
                                    </Box>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        No pricing set yet. Click the edit icon to configure plans.
                                    </Typography>
                                )}
                            </Paper>

                            {/* ── ACTION BUTTONS ───────────────────────────── */}
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 2,
                                flexWrap: 'wrap',
                            }}>
                                {/* Save as Draft */}
                                <Button
                                    type="button"
                                    disabled={processing}
                                    variant="outlined"
                                    startIcon={<SaveIcon />}
                                    onClick={handleSaveAsDraft}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        px: 3,
                                        py: 1.5,
                                        borderColor: 'grey.400',
                                        color: 'text.secondary',
                                        '&:hover': { borderColor: 'grey.600', bgcolor: 'grey.50' },
                                    }}
                                >
                                    {processing ? 'Saving…' : 'Save as Draft'}
                                </Button>

                                {/* Update Course Details */}
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    variant="contained"
                                    startIcon={<RocketLaunchIcon />}
                                    sx={{
                                        bgcolor: 'success.main',
                                        '&:hover': { bgcolor: 'success.dark' },
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        px: 4,
                                        py: 1.5,
                                    }}
                                >
                                    {processing ? 'Saving…' : 'Update Course Details'}
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* ── Modals ─────────────────────────────────────────────────── */}
            <EditSyllabusModal
                open={syllabusModalOpen}
                onClose={() => setSyllabusModalOpen(false)}
                course={course}
            />
            <EditMediaContentModal
                open={mediaModalOpen}
                onClose={() => setMediaModalOpen(false)}
                course={course}
            />
            <EditPricingModal
                open={pricingModalOpen}
                onClose={() => setPricingModalOpen(false)}
                course={course}
            />
            <EditAssessmentModal
                open={assessmentModalOpen}
                onClose={() => setAssessmentModalOpen(false)}
                course={course}
            />
        </>
    );
}

Edit.layout = (page) => (
    <MentorLayout auth={page.props.auth} activeTab="Courses">
        {page}
    </MentorLayout>
);
