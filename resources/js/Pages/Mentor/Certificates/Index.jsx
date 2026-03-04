// resources/js/Pages/Mentor/Certificates/Index.jsx
import { useState, useMemo, useEffect, useRef } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Box, Typography, Button, Paper, Stack,
    TextField, InputAdornment, Snackbar, Alert,
    Divider, IconButton,
} from '@mui/material';
import SearchIcon  from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import MentorLayout from '@/Layouts/MentorLayout';
import CertificateContent, { CERT_W, CERT_H, PALETTES, TEMPLATES } from '@/Components/Mentor/Certificates/MentorCertificateContent';
import VerificationModal from '@/Components/Mentor/Verifications/VerificationNotificationModal';
import DeleteCertificateModal from '@/Components/Mentor/Certificates/DeleteCertificateModal';


import { fadeInUp, slideInRight, scaleIn, shimmerBg, spinSlow, accentBarSlide } from '../../../Components/Mentor/Certificates/keyframes';
import useDragScroll        from '../../../Hooks/useDragScroll';
import exportCertificatePdf from '../../../Utils/exportCertificatePdf';
import PaletteSwatch        from '../../../Components/Mentor/Certificates/PaletteSwatch';
import CertThumb            from '../../../Components/Mentor/Certificates/CertThumb';
import TemplateButton       from '../../../Components/Mentor/Certificates/TemplateButton';
import CourseRow            from '../../../Components/Mentor/Certificates/CourseRow';
import UnverifiedNotice     from '../../../Components/Mentor/Certificates/UnverifiedNotice';

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function CertificatesIndex({
    courses               = [],
    certificates          = [],
    mentorName            = '',
    mentorVerified        = false,
    verificationSubmitted = false,
}) {
    const { props } = usePage();
    const flash     = props.flash || {};

    const [template,          setTemplate]          = useState('Minimal');
    const [paletteId,         setPaletteId]         = useState('sunset');
    const [courseSearch,      setCourseSearch]      = useState('');
    const [selectedCourseIds, setSelectedCourseIds] = useState([]);
    const [activeCertIdx,     setActiveCertIdx]     = useState(null);
    const [processing,        setProcessing]        = useState(false);
    const [exporting,         setExporting]         = useState(false);
    const [snack,             setSnack]             = useState(flash.success || null);
    const [previewKey,        setPreviewKey]        = useState(0);
    const [verificationOpen,  setVerificationOpen]  = useState(false);
    const [deleteDialogOpen,   setDeleteDialogOpen]   = useState(false);
    const [certToDelete,      setCertToDelete]      = useState(null);

    const certCaptureRef = useRef(null);
    const { scrollRef: paletteScrollRef, dragHandlers: paletteDragHandlers } = useDragScroll();

    useEffect(() => { setPreviewKey(k => k + 1); }, [template, paletteId]);

    const safeCourses       = Array.isArray(courses) ? courses : [];
    const filteredCourses   = useMemo(() =>
        safeCourses.filter(c => c?.title?.toLowerCase().includes(courseSearch.toLowerCase())),
        [safeCourses, courseSearch],
    );
    const assignedCourseIds = useMemo(() => certificates.map(c => c.course_id), [certificates]);
    const currentPalette    = PALETTES.find(p => p.id === paletteId) || PALETTES[0];
    const activeCert        = activeCertIdx !== null ? certificates[activeCertIdx] : null;

    const previewCourseName = useMemo(() => {
        if (activeCert) return activeCert.course?.title || 'Advanced Project Management Strategies';
        if (selectedCourseIds.length > 0)
            return safeCourses.find(c => c.id === selectedCourseIds[0])?.title || 'Advanced Project Management Strategies';
        return 'Advanced Project Management Strategies';
    }, [activeCert, selectedCourseIds, safeCourses]);

    const previewInstructorName = activeCert?.course?.user?.name || mentorName || 'Alex Morgan';
    const previewDateLabel      = activeCert?.date_issued
        ? new Date(activeCert.date_issued).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const previewCertId = activeCert ? `CRT-${activeCert.id}` : 'CRT-PREVIEW';

    const toggleCourse = id =>
        setSelectedCourseIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const handleSelectAllCourses = () => {
        const visibleIds = filteredCourses.map(c => c.id);
        const allSelected = visibleIds.length > 0 && visibleIds.every(id => selectedCourseIds.includes(id));
        if (allSelected) {
            setSelectedCourseIds(prev => prev.filter(id => !visibleIds.includes(id)));
        } else {
            setSelectedCourseIds(prev => {
                const added = visibleIds.filter(id => !prev.includes(id));
                return added.length ? [...prev, ...added] : prev;
            });
        }
    };

    const handleReset = () => {
        setTemplate('Minimal');
        setPaletteId('sunset');
        setSelectedCourseIds([]);
        setCourseSearch('');
        setActiveCertIdx(null);
    };

    const handleSave = () => {
        if (!mentorVerified) return;
        if (selectedCourseIds.length === 0) {
            setSnack('⚠ Please assign this certificate to at least one course before saving.');
            return;
        }
        setProcessing(true);
        router.post(
            route('certificates.store'),
            { design_layout: template.toLowerCase(), color_palette: paletteId, course_ids: selectedCourseIds },
            {
                onFinish:  () => setProcessing(false),
                onSuccess: () => { setSnack('Certificate design saved successfully!'); setSelectedCourseIds([]); },
            },
        );
    };

    const handleDelete = (certId) => {
        setCertToDelete(certId);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!certToDelete) return;

        router.delete(route('certificates.destroy', certToDelete), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setCertToDelete(null);
            },
        });
    };

    const loadCert = (cert, idx) => {
        setActiveCertIdx(idx);
        setTemplate(cert.design_layout.charAt(0).toUpperCase() + cert.design_layout.slice(1));
        setPaletteId(cert.color_palette);
    };

    const handleExportPDF = async () => {
        const node = certCaptureRef.current;
        if (!node) { setSnack('⚠ Certificate preview not found.'); return; }
        setExporting(true);
        try {
            const pdf      = await exportCertificatePdf(node);
            const dateStr  = new Date().toISOString().slice(0, 10);
            const filename = `certificate-${template.toLowerCase()}-${paletteId}-${dateStr}.pdf`;
            pdf.save(filename);
            setSnack(`✅ Certificate exported as "${filename}"`);
        } catch (err) {
            console.error('PDF export failed:', err);
            setSnack('⚠ Export failed. Make sure html2canvas and jspdf are installed.');
        } finally {
            setExporting(false);
        }
    };

    return (
        <>
            <Head title="Certificate Generator" />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <Box sx={{ flex: 1, display: 'flex', overflow: { xs: 'visible', md: 'auto' }, mt: '4px', bgcolor: '#F4F6F4', flexDirection: { xs: 'column', md: 'row' } }}>

                        {/* ════ LEFT COLUMN ════ */}
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2.5, gap: 1.5, minWidth: 0 }}>

                            {/* Header */}
                            <Box sx={{ flexShrink: 0, animation: `${fadeInUp} 0.5s ease 0.05s both` }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Box sx={{
                                        width: 4, height: 28, borderRadius: 2,
                                        bgcolor: currentPalette.primary,
                                        transition: 'background-color 0.4s ease',
                                        animation: `${scaleIn} 0.4s ease 0.1s both`,
                                    }} />
                                    <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                                        Certificate Generator
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, ml: '20px' }}>
                                    Design and manage professional certificates for your students.
                                </Typography>
                            </Box>

                            {/* Main preview */}
                            <Paper
                                variant="outlined"
                                sx={{
                                    borderRadius: 3,
                                    bgcolor: '#fff',
                                    position: 'relative',
                                    p: { xs: 1.5, md: 3 },
                                    minHeight: { xs: 'auto', md: '600px' },
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    alignContent: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                    animation: `${fadeInUp} 0.55s ease 0.12s both`,
                                    transition: 'box-shadow 0.4s,border-color 0.4s',
                                    borderColor: `${currentPalette.border}55`,
                                    '&:hover': { boxShadow: `0 8px 40px rgba(0,0,0,0.07),0 0 0 1px ${currentPalette.border}33` },
                                }}
                            >
                                {/* Corner accents */}
                                <Box sx={{ position: 'absolute', top: 12, right: 12, width: 40, height: 40, borderTop: `2px solid ${currentPalette.secondary}55`, borderRight: `2px solid ${currentPalette.secondary}55`, borderRadius: '0 8px 0 0', transition: 'border-color 0.4s', pointerEvents: 'none', display: { xs: 'none', md: 'block' } }} />
                                <Box sx={{ position: 'absolute', bottom: 12, left: 12, width: 40, height: 40, borderBottom: `2px solid ${currentPalette.secondary}55`, borderLeft: `2px solid ${currentPalette.secondary}55`, borderRadius: '0 0 0 8px', transition: 'border-color 0.4s', pointerEvents: 'none', display: { xs: 'none', md: 'block' } }} />

                                {/* Swipe hint — mobile only */}
                                <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', mb: 1, width: '100%' }}>
                                    <Box component="span" sx={{ fontSize: '0.68rem', color: 'text.disabled', fontStyle: 'italic' }}>
                                        ← Swipe to view full certificate →
                                    </Box>
                                </Box>

                                {/* Scrollable wrapper */}
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        overflowX: { xs: 'auto', md: 'visible' },
                                        overflowY: 'visible',
                                        width: '100%',
                                        WebkitOverflowScrolling: 'touch',
                                        '&::-webkit-scrollbar': { height: 5 },
                                        '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
                                        '&::-webkit-scrollbar-thumb': { bgcolor: `${currentPalette.primary}55`, borderRadius: 2 },
                                    }}
                                >
                                    <Box
                                        key={previewKey}
                                        sx={{
                                            animation: `${scaleIn} 0.4s cubic-bezier(0.34,1.56,0.64,1) both`,
                                            filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.10))',
                                            transition: 'filter 0.3s',
                                            '&:hover': { filter: 'drop-shadow(0 14px 40px rgba(0,0,0,0.14))' },
                                            display: 'inline-block',
                                            minWidth: 'max-content',
                                        }}
                                    >
                                        <Box ref={certCaptureRef} sx={{ display: 'inline-block' }}>
                                            <CertificateContent
                                                template={template}
                                                palette={paletteId}
                                                courseName={previewCourseName}
                                                instructorName={previewInstructorName}
                                                dateLabel={previewDateLabel}
                                                certId={previewCertId}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </Paper>

                            {/* Assign to Courses / Verification gate */}
                            {mentorVerified ? (
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 3, p: 2.5, bgcolor: '#fff',
                                        animation: `${fadeInUp} 0.5s ease 0.22s both`,
                                        transition: 'box-shadow 0.3s',
                                        '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.06)' },
                                    }}
                                >
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
                                        Assign to Courses
                                    </Typography>

                                    <TextField
                                        fullWidth size="small" placeholder="Search courses..."
                                        value={courseSearch} onChange={e => setCourseSearch(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            mb: 1.5,
                                            '& .MuiOutlinedInput-root': {
                                                transition: 'box-shadow 0.2s',
                                                '&:focus-within': { boxShadow: `0 0 0 3px ${currentPalette.primary}18` },
                                            },
                                        }}
                                    />

                                    {filteredCourses.length > 0 && (
                                        <Button
                                            size="small"
                                            onClick={handleSelectAllCourses}
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                color: 'success.main',
                                                mb: 1,
                                                alignSelf: 'flex-start',
                                            }}
                                        >
                                            {filteredCourses.every(c => selectedCourseIds.includes(c.id))
                                                ? 'Deselect all'
                                                : 'Select all'}
                                        </Button>
                                    )}

                                    {safeCourses.length === 0 ? (
                                        <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center', py: 3 }}>
                                            No courses available. Create a course first.
                                        </Typography>
                                    ) : (
                                        <Box sx={{
                                            height: 300, overflowY: 'auto', mb: 2, pr: 1,
                                            '&::-webkit-scrollbar': { width: 8 },
                                            '&::-webkit-scrollbar-track': { bgcolor: '#f5f5f5', borderRadius: 4 },
                                            '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 4 },
                                        }}>
                                            {filteredCourses.length === 0 ? (
                                                <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center', py: 2 }}>
                                                    {courseSearch ? 'No matching courses found.' : 'No courses available.'}
                                                </Typography>
                                            ) : (
                                                <Stack spacing={0.5}>
                                                    {filteredCourses.map((course, i) => (
                                                        <CourseRow
                                                            key={course.id}
                                                            course={course}
                                                            isAssigned={assignedCourseIds.includes(course.id)}
                                                            isChecked={selectedCourseIds.includes(course.id)}
                                                            onToggle={() => toggleCourse(course.id)}
                                                            delay={i * 0.04}
                                                        />
                                                    ))}
                                                </Stack>
                                            )}
                                        </Box>
                                    )}

                                    {selectedCourseIds.length === 0 && (
                                        <Typography variant="caption" color="warning.main" sx={{ display: 'block', mb: 1.5, fontStyle: 'italic' }}>
                                            ⚠ Select at least one course to save the certificate design.
                                        </Typography>
                                    )}

                                    <Button
                                        fullWidth variant="contained"
                                        disabled={processing || selectedCourseIds.length === 0}
                                        onClick={handleSave}
                                        sx={{
                                            textTransform: 'none', fontWeight: 700,
                                            bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' },
                                            '&.Mui-disabled': { bgcolor: '#e0e0e0', color: '#aaa' },
                                            py: 1.5, borderRadius: 2, position: 'relative', overflow: 'hidden',
                                            transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                                            '&:not(.Mui-disabled):hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 6px 20px rgba(30,77,43,0.35)',
                                            },
                                            '&:not(.Mui-disabled)::after': {
                                                content: '""', position: 'absolute', inset: 0,
                                                background: 'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.15) 50%,transparent 100%)',
                                                backgroundSize: '200% 100%',
                                                animation: selectedCourseIds.length > 0 ? `${shimmerBg} 2.5s linear infinite` : 'none',
                                            },
                                        }}
                                    >
                                        {processing ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box sx={{
                                                    width: 14, height: 14, borderRadius: '50%',
                                                    border: '2px solid rgba(255,255,255,0.4)',
                                                    borderTopColor: 'white',
                                                    animation: `${spinSlow} 0.7s linear infinite`,
                                                }} />
                                                Saving…
                                            </Box>
                                        ) : 'Save Certificate Design'}
                                    </Button>
                                </Paper>
                            ) : (
                                <UnverifiedNotice onVerify={() => setVerificationOpen(true)} />
                            )}

                            {/* Issued certificates */}
                            <Box sx={{ flexShrink: 0, animation: `${fadeInUp} 0.5s ease 0.3s both` }}>
                                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                                    Issued Certificates
                                    <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                        ({certificates.length})
                                    </Typography>
                                </Typography>

                                {certificates.length === 0 ? (
                                    <Paper variant="outlined" sx={{ borderRadius: 2, p: 2.5, textAlign: 'center', bgcolor: '#fafafa', border: '1px dashed #e0e0e0' }}>
                                        <Typography variant="caption" color="text.disabled">
                                            No certificates issued yet. Design one and assign it to a course.
                                        </Typography>
                                    </Paper>
                                ) : (
                                    <Stack
                                        direction="row" spacing={1.5}
                                        sx={{
                                            overflowX: 'auto', pb: 0.5,
                                            '&::-webkit-scrollbar': { height: 5 },
                                            '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.15)', borderRadius: 3 },
                                        }}
                                    >
                                        {certificates.map((cert, idx) => (
                                            <CertThumb
                                                key={cert.id} cert={cert}
                                                active={idx === activeCertIdx}
                                                onClick={() => loadCert(cert, idx)}
                                                onDelete={() => handleDelete(cert.id)}
                                                delay={idx * 0.06}
                                            />
                                        ))}
                                    </Stack>
                                )}
                            </Box>
                        </Box>

                        {/* ════ RIGHT PANEL ════ */}
                        <Paper
                            square elevation={0}
                            sx={{
                                width: { xs: '100%', md: 340 },
                                flexShrink: 0,
                                borderLeft: { xs: 'none', md: '1px solid' },
                                borderTop: { xs: '1px solid', md: 'none' },
                                borderColor: 'divider',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                                bgcolor: '#fff',
                                position: { xs: 'relative', md: 'sticky' },
                                top: { md: '64px' },
                                alignSelf: { md: 'flex-start' },
                                maxHeight: { md: 'calc(100vh - 64px)' },
                                animation: `${slideInRight} 0.5s ease 0.08s both`,
                            }}
                        >
                            {/* Panel header */}
                            <Box sx={{
                                px: 2.5, py: 1.75, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                borderBottom: 1, borderColor: 'divider', flexShrink: 0,
                                background: `linear-gradient(135deg,#fff 0%,${currentPalette.bg} 100%)`,
                                transition: 'background 0.5s ease',
                            }}>
                                <Typography variant="subtitle1" fontWeight={700}>Design Certificate</Typography>
                                <Button
                                    size="small" startIcon={<RefreshIcon fontSize="small" />}
                                    onClick={handleReset}
                                    sx={{
                                        textTransform: 'none', color: 'success.main', fontWeight: 600, minWidth: 0,
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            color: 'success.dark', bgcolor: 'rgba(30,77,43,0.06)',
                                            '& .MuiSvgIcon-root': { transform: 'rotate(-180deg)', transition: 'transform 0.4s' },
                                        },
                                    }}
                                >
                                    Reset
                                </Button>
                            </Box>

                            {/* Panel body */}
                            <Box sx={{
                                flex: 1, overflowY: 'auto', px: 2.5, py: 2,
                                display: 'flex', flexDirection: 'column', gap: 2,
                                '&::-webkit-scrollbar': { width: 4 },
                                '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.15)', borderRadius: 2 },
                            }}>

                                {/* Templates */}
                                <Box sx={{ animation: `${fadeInUp} 0.4s ease 0.2s both` }}>
                                    <Typography variant="caption" fontWeight={700} color="text.secondary"
                                        sx={{ textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 1 }}>
                                        Template
                                    </Typography>
                                    <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                                        {TEMPLATES.map((t, i) => (
                                            <TemplateButton
                                                key={t} label={t}
                                                active={template === t}
                                                onClick={() => setTemplate(t)}
                                                delay={0.22 + i * 0.05}
                                            />
                                        ))}
                                    </Stack>
                                </Box>

                                {/* Color palette — drag-to-scroll */}
                                <Box sx={{ animation: `${fadeInUp} 0.4s ease 0.32s both` }}>
                                    <Typography variant="caption" fontWeight={700} color="text.secondary"
                                        sx={{ textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 1 }}>
                                        Choose Color Palette
                                    </Typography>
                                    <Box sx={{
                                        position: 'relative',
                                        '&::before,&::after': {
                                            content: '""', position: 'absolute', top: 0, bottom: 12,
                                            width: 24, zIndex: 1, pointerEvents: 'none',
                                        },
                                        '&::before': { left: 0,  background: 'linear-gradient(to right, #fff 0%, transparent 100%)' },
                                        '&::after':  { right: 0, background: 'linear-gradient(to left,  #fff 0%, transparent 100%)' },
                                    }}>
                                        <Box
                                            ref={paletteScrollRef}
                                            {...paletteDragHandlers}
                                            sx={{
                                                display: 'flex', alignItems: 'center',
                                                overflowX: 'auto', overflowY: 'hidden',
                                                pb: 1.5, px: 0.5, cursor: 'grab',
                                                WebkitOverflowScrolling: 'touch',
                                                '&::-webkit-scrollbar': { height: 3 },
                                                '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
                                                '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.12)', borderRadius: 2 },
                                                userSelect: 'none', scrollBehavior: 'smooth',
                                            }}
                                        >
                                            <Stack direction="row" spacing={1.5}
                                                sx={{ width: 'max-content', flexWrap: 'nowrap', py: 0.5 }}>
                                                {PALETTES.map((p, i) => (
                                                    <PaletteSwatch
                                                        key={p.id} palette={p}
                                                        selected={paletteId === p.id}
                                                        onClick={() => setPaletteId(p.id)}
                                                        delay={0.34 + i * 0.05}
                                                    />
                                                ))}
                                            </Stack>
                                        </Box>
                                    </Box>
                                    <Box sx={{
                                        mt: 1, height: 3, borderRadius: 2,
                                        background: `linear-gradient(90deg, ${currentPalette.primary}, ${currentPalette.secondary})`,
                                        transition: 'background 0.5s ease',
                                        animation: `${accentBarSlide} 0.4s ease both`,
                                    }} />
                                    <Typography variant="caption" color="text.secondary"
                                        sx={{ display: 'block', mt: 0.75, fontSize: '0.72rem', fontWeight: 600 }}>
                                        {currentPalette.label}
                                    </Typography>
                                </Box>



                                {/* Export */}
                                <Box sx={{ animation: `${fadeInUp} 0.4s ease 0.5s both` }}>
                                    <Divider sx={{ mb: 2 }} />
                                    <Typography variant="caption" fontWeight={700} color="text.secondary"
                                        sx={{ textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 1 }}>
                                        Export
                                    </Typography>
                                    <Button
                                        fullWidth variant="outlined" disabled={exporting}
                                        onClick={handleExportPDF}
                                        startIcon={
                                            exporting
                                                ? <Box sx={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(211,47,47,0.4)', borderTopColor: '#d32f2f', animation: `${spinSlow} 0.7s linear infinite` }} />
                                                : <DownloadIcon sx={{ fontSize: 18 }} />
                                        }
                                        sx={{
                                            textTransform: 'none', fontWeight: 700,
                                            borderColor: '#d32f2f', color: '#d32f2f',
                                            borderRadius: 2, py: 1.25,
                                            position: 'relative', overflow: 'hidden',
                                            transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                                            '&:hover': {
                                                bgcolor: 'rgba(211,47,47,0.05)',
                                                borderColor: '#b71c1c', color: '#b71c1c',
                                                boxShadow: '0 4px 16px rgba(211,47,47,0.2)',
                                            },
                                            '&.Mui-disabled': { borderColor: '#e0e0e0', color: '#bbb' },
                                        }}
                                    >
                                        {exporting ? 'Generating PDF…' : 'Export as PDF'}
                                    </Button>
                                    <Typography variant="caption" color="text.disabled"
                                        sx={{ display: 'block', mt: 0.75, textAlign: 'center', fontSize: '0.68rem' }}>
                                        Exports the current preview as a landscape A4 PDF
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            </Box>

            {/* Toast */}
            <Snackbar
                open={!!snack} autoHideDuration={5000} onClose={() => setSnack(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnack(null)}
                    severity={snack?.startsWith('⚠') ? 'warning' : 'success'}
                    sx={{
                        width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                        borderRadius: 2, animation: `${fadeInUp} 0.35s cubic-bezier(0.34,1.56,0.64,1) both`,
                    }}
                >
                    {snack}
                </Alert>
            </Snackbar>

            {/* VerificationModal intermediary */}
            <VerificationModal
                show={verificationOpen}
                onClose={() => setVerificationOpen(false)}
            />

            <DeleteCertificateModal
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
            />
        </>
    );
}

CertificatesIndex.layout = (page) => (
    <MentorLayout auth={page.props.auth}
    activeTab="Certificates">
        {page}
    </MentorLayout>
);
