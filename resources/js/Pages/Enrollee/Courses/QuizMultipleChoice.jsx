import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import EnrolleeSidebar from '@/Components/Enrollee/EnrolleeSidebar';
import {
    Box,
    Typography,
    Paper,
    Stack,
    Button,
    Chip,
    IconButton,
    useMediaQuery,
    useTheme,
    LinearProgress,
    Radio,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import QuizIcon from '@mui/icons-material/Quiz';

const SIDEBAR_WIDTH = 240;

// ─── Static demo data ────────────────────────────────────────────────────────
const DEMO_QUESTION = {
    id: 1,
    text: 'You pause before reacting to criticism to consider your response objectively.',
    subLabel: 'IDENTIFY THE CORRESPONDING EI DOMAIN:',
    totalQuestions: 5,
    currentQuestion: 1,
};

const OPTIONS = [
    { id: 'a', label: 'A) Empathy' },
    { id: 'b', label: 'B) Self-Regulation' },
    { id: 'c', label: 'C) Motivation' },
    { id: 'd', label: 'D) Social Skills' },
];

const CORRECT_ANSWER = 'b';

const LESSON_TABS = [
    { id: 1, label: '1.1 Introduction', active: false },
    { id: 2, label: '1.2 Core Components', active: false },
    { id: 3, label: '1.3 Why Emotional Intelligence Matter', active: false },
    { id: 4, label: 'Quiz', active: true, isQuiz: true },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function QuizMultipleChoice({ course }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const handleSelect = (optionId) => {
        if (submitted) return;
        setSelected(optionId);
    };

    const handleSubmit = () => {
        if (!selected) return;
        setSubmitted(true);
        setShowResult(true);
    };

    const progress = (DEMO_QUESTION.currentQuestion / DEMO_QUESTION.totalQuestions) * 100;

    const getOptionStyle = (optionId) => {
        const isSelected = selected === optionId;
        const isCorrect = submitted && optionId === CORRECT_ANSWER;
        const isWrong = submitted && isSelected && optionId !== CORRECT_ANSWER;

        if (isCorrect) {
            return {
                borderColor: 'success.main',
                bgcolor: '#f0fdf4',
                boxShadow: '0 0 0 1.5px #16a34a',
            };
        }
        if (isWrong) {
            return {
                borderColor: 'error.main',
                bgcolor: '#fef2f2',
                boxShadow: '0 0 0 1.5px #dc2626',
            };
        }
        if (isSelected) {
            return {
                borderColor: 'success.main',
                bgcolor: '#f0fdf4',
                boxShadow: '0 0 0 1.5px #16a34a',
            };
        }
        return {
            borderColor: 'grey.200',
            bgcolor: 'white',
        };
    };

    return (
        <>
            <Head title={`Quiz — ${course?.title || 'Emotional Intelligence at Work'}`} />
            <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
                <EnrolleeSidebar
                    activePage="courses"
                    mobileOpen={mobileOpen}
                    onMobileClose={() => setMobileOpen(false)}
                />

                <Box sx={{ ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` }, transition: theme.transitions.create('margin') }}>
                    {/* Top bar */}
                    <Paper square elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'white', position: 'sticky', top: 0, zIndex: 1100 }}>
                        <Box sx={{ display: 'flex', height: 64, alignItems: 'center', justifyContent: 'space-between', px: { xs: 2, sm: 3, lg: 4 } }}>
                            <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2, display: { md: 'none' } }}>
                                <MenuIcon />
                            </IconButton>
                            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', bgcolor: 'grey.100', borderRadius: 50, px: 2, py: 0.75, width: 380, gap: 1 }}>
                                <Typography variant="body2" color="text.disabled" sx={{ fontSize: '0.85rem' }}>
                                    Search for skills, mentors, or topics...
                                </Typography>
                            </Box>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ ml: 'auto' }}>
                                <Typography variant="body2" fontWeight={500} sx={{ color: 'text.secondary', display: { xs: 'none', md: 'block' } }}>
                                    ManPro Learning Hub
                                </Typography>
                                <Box sx={{ position: 'relative', cursor: 'pointer' }}>
                                    <NotificationsNoneIcon sx={{ color: 'grey.500' }} />
                                    <Box sx={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main' }} />
                                </Box>
                            </Stack>
                        </Box>
                    </Paper>

                    {/* Content */}
                    <Box sx={{ p: { xs: 2, sm: 3, lg: 4 }, maxWidth: 900, mx: 'auto' }}>

                        {/* Breadcrumb */}
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1 }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={500}>COURSES</Typography>
                            <Typography variant="caption" color="text.secondary">/</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={500}>QUIZ</Typography>
                        </Stack>

                        {/* Course title */}
                        <Box sx={{ mb: 1.5 }}>
                            <Typography variant="h5" fontWeight={800}>{course?.title || 'Emotional Intelligence at Work'}</Typography>
                            <Typography variant="body2" color="text.secondary">Multiple Choice Assessment</Typography>
                        </Box>

                        {/* Lesson tabs */}
                        <Stack direction="row" flexWrap="wrap" alignItems="center" gap={0.75} sx={{ mb: 3 }}>
                            {LESSON_TABS.map((tab) => (
                                <Chip
                                    key={tab.id}
                                    icon={tab.isQuiz ? <QuizIcon sx={{ fontSize: '14px !important' }} /> : undefined}
                                    label={tab.label}
                                    size="small"
                                    sx={{
                                        fontSize: '0.72rem',
                                        fontWeight: tab.active ? 700 : 500,
                                        bgcolor: tab.active ? 'success.main' : 'transparent',
                                        color: tab.active ? 'white' : 'text.secondary',
                                        border: '1px solid',
                                        borderColor: tab.active ? 'success.main' : 'divider',
                                        '& .MuiChip-icon': { color: tab.active ? 'white' : 'success.main' },
                                        '&:hover': { bgcolor: tab.active ? 'success.dark' : 'grey.100' },
                                    }}
                                />
                            ))}
                        </Stack>

                        {/* Main quiz card */}
                        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: { xs: 2, sm: 3 }, bgcolor: 'white', mb: 2 }}>

                            {/* Question header */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 2.5 }}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1" fontWeight={700} sx={{ fontSize: '1.05rem', lineHeight: 1.5 }}>
                                        {DEMO_QUESTION.text}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        fontWeight={700}
                                        sx={{ display: 'block', mt: 1, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary', fontSize: '0.68rem' }}
                                    >
                                        {DEMO_QUESTION.subLabel}
                                    </Typography>
                                </Box>
                                {/* Question progress (top-right) */}
                                <Box sx={{ textAlign: 'right', minWidth: 130, flexShrink: 0 }}>
                                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.65rem' }}>
                                        Question {DEMO_QUESTION.currentQuestion} of {DEMO_QUESTION.totalQuestions}
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={progress}
                                        sx={{
                                            mt: 0.75,
                                            height: 5,
                                            borderRadius: 3,
                                            bgcolor: 'grey.200',
                                            '& .MuiLinearProgress-bar': { bgcolor: 'success.main', borderRadius: 3 },
                                        }}
                                    />
                                </Box>
                            </Box>

                            {/* Options */}
                            <Stack spacing={1.25}>
                                {OPTIONS.map((option) => {
                                    const isSelected = selected === option.id;
                                    const isCorrect = submitted && option.id === CORRECT_ANSWER;
                                    const optStyle = getOptionStyle(option.id);

                                    return (
                                        <Paper
                                            key={option.id}
                                            elevation={0}
                                            onClick={() => handleSelect(option.id)}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1.5,
                                                p: '10px 16px',
                                                border: '1.5px solid',
                                                borderRadius: 2,
                                                cursor: submitted ? 'default' : 'pointer',
                                                transition: 'all 0.18s',
                                                '&:hover': submitted ? {} : { borderColor: 'success.light', bgcolor: '#f0fdf4' },
                                                ...optStyle,
                                            }}
                                        >
                                            <Radio
                                                checked={isSelected || isCorrect}
                                                readOnly
                                                size="small"
                                                sx={{
                                                    p: 0,
                                                    color: isSelected || isCorrect ? 'success.main' : 'grey.400',
                                                    '&.Mui-checked': { color: 'success.main' },
                                                    pointerEvents: 'none',
                                                }}
                                            />
                                            <Typography
                                                variant="body2"
                                                fontWeight={isSelected || isCorrect ? 600 : 400}
                                                sx={{
                                                    flex: 1,
                                                    color: isCorrect ? 'success.dark' : isSelected ? 'success.dark' : 'text.primary',
                                                }}
                                            >
                                                {option.label}
                                            </Typography>
                                            {(isSelected || isCorrect) && (
                                                <CheckCircleOutlineIcon sx={{ fontSize: 20, color: 'success.main' }} />
                                            )}
                                        </Paper>
                                    );
                                })}
                            </Stack>

                            {/* Submit row */}
                            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={!selected || submitted}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        px: 4,
                                        py: 1.25,
                                        bgcolor: '#166534',
                                        borderRadius: 2,
                                        '&:hover': { bgcolor: '#14532d' },
                                        '&.Mui-disabled': { bgcolor: 'grey.300' },
                                    }}
                                >
                                    Submit Answer
                                </Button>
                            </Box>
                        </Paper>

                        {/* Result feedback */}
                        {showResult && (
                            <Paper
                                elevation={0}
                                sx={{
                                    border: '1px solid',
                                    borderColor: 'success.light',
                                    borderRadius: 3,
                                    p: 2.5,
                                    bgcolor: '#f0fdf4',
                                    mb: 3,
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 1.5,
                                }}
                            >
                                <CheckCircleIcon sx={{ fontSize: 28, color: 'success.main', flexShrink: 0, mt: 0.25 }} />
                                <Box>
                                    <Typography variant="body1" fontWeight={700} color="success.dark">
                                        Well done!
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        You demonstrate a strong understanding of Emotional Intelligence concepts. You've correctly identified the core components of self-regulation and empathy in the workplace.
                                    </Typography>
                                </Box>
                            </Paper>
                        )}

                        {/* Prev / Next */}
                        <Stack direction="row" justifyContent="space-between">
                            <Button startIcon={<ArrowBackIcon />} sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}>
                                Previous
                            </Button>
                            <Button
                                variant="contained"
                                endIcon={<ArrowForwardIcon />}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    px: 3,
                                    bgcolor: '#1a1a2e',
                                    borderRadius: 2,
                                    '&:hover': { bgcolor: '#16213e' },
                                }}
                            >
                                Next Question
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Box>
        </>
    );
}
