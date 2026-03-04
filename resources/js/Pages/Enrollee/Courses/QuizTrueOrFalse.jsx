import { useState } from 'react';
import { Head } from '@inertiajs/react';
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import QuizIcon from '@mui/icons-material/Quiz';

const SIDEBAR_WIDTH = 240;

// ─── Demo data ────────────────────────────────────────────────────────────────
const DEMO_QUESTION = {
    id: 1,
    text: 'Emotional Intelligence is a fixed trait that cannot be developed or improved over time.',
    totalQuestions: 5,
    currentQuestion: 2,
    correctAnswer: 'false',   // the correct answer is FALSE
};

const LESSON_TABS = [
    { id: 1, label: '1.1 Introduction', active: false },
    { id: 2, label: '1.2 Core Components', active: false },
    { id: 3, label: '1.3 Why EI Matters', active: false },
    { id: 4, label: 'Quiz', active: true, isQuiz: true },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function QuizTrueOrFalse({ course }) {
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [selected, setSelected] = useState(null);    // 'true' | 'false'
    const [submitted, setSubmitted] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const progress = (DEMO_QUESTION.currentQuestion / DEMO_QUESTION.totalQuestions) * 100;
    const isCorrect = submitted && selected === DEMO_QUESTION.correctAnswer;

    const handleSelect = (val) => {
        if (submitted) return;
        setSelected(val);
    };

    const handleSubmit = () => {
        if (!selected) return;
        setSubmitted(true);
        setShowResult(true);
    };

    const getButtonStyle = (val) => {
        const isThis = selected === val;
        const isThisCorrect = submitted && DEMO_QUESTION.correctAnswer === val;
        const isThisWrong = submitted && isThis && val !== DEMO_QUESTION.correctAnswer;

        if (isThisCorrect) {
            return {
                borderColor: 'success.main',
                bgcolor: '#f0fdf4',
                color: 'success.dark',
                boxShadow: '0 0 0 2px #16a34a',
            };
        }
        if (isThisWrong) {
            return {
                borderColor: 'error.main',
                bgcolor: '#fef2f2',
                color: 'error.dark',
                boxShadow: '0 0 0 2px #dc2626',
            };
        }
        if (isThis) {
            return {
                borderColor: 'success.main',
                bgcolor: '#f0fdf4',
                color: 'success.dark',
                boxShadow: '0 0 0 2px #16a34a',
            };
        }
        return {
            borderColor: 'grey.300',
            bgcolor: 'white',
            color: 'text.secondary',
        };
    };

    return (
        <>
            <Head title={`Quiz — ${course?.title || 'Emotional Intelligence at Work'}`} />
            <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
                <EnrolleeSidebar activePage="courses" mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

                <Box sx={{ ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` }, transition: theme.transitions.create('margin') }}>
                    {/* Top bar */}
                    <Paper square elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'white', position: 'sticky', top: 0, zIndex: 1100 }}>
                        <Box sx={{ display: 'flex', height: 64, alignItems: 'center', justifyContent: 'space-between', px: { xs: 2, sm: 3, lg: 4 } }}>
                            <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2, display: { md: 'none' } }}>
                                <MenuIcon />
                            </IconButton>
                            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', bgcolor: 'grey.100', borderRadius: 50, px: 2, py: 0.75, width: 380 }}>
                                <Typography variant="body2" color="text.disabled" sx={{ fontSize: '0.85rem' }}>Search for skills, mentors, or topics...</Typography>
                            </Box>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ ml: 'auto' }}>
                                <Typography variant="body2" fontWeight={500} sx={{ color: 'text.secondary', display: { xs: 'none', md: 'block' } }}>ManPro Learning Hub</Typography>
                                <Box sx={{ position: 'relative', cursor: 'pointer' }}>
                                    <NotificationsNoneIcon sx={{ color: 'grey.500' }} />
                                    <Box sx={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main' }} />
                                </Box>
                            </Stack>
                        </Box>
                    </Paper>

                    {/* Content — centered card like the screenshot */}
                    <Box sx={{ p: { xs: 2, sm: 3, lg: 4 }, maxWidth: 720, mx: 'auto' }}>

                        {/* Breadcrumb */}
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1 }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={500}>COURSES</Typography>
                            <Typography variant="caption" color="text.secondary">/</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={500}>QUIZ</Typography>
                        </Stack>

                        {/* Lesson tabs */}
                        <Stack direction="row" flexWrap="wrap" alignItems="center" gap={0.75} sx={{ mb: 3 }}>
                            {LESSON_TABS.map((tab) => (
                                <Chip
                                    key={tab.id}
                                    icon={tab.isQuiz ? <QuizIcon sx={{ fontSize: '14px !important' }} /> : undefined}
                                    label={tab.label}
                                    size="small"
                                    sx={{
                                        fontSize: '0.72rem', fontWeight: tab.active ? 700 : 500,
                                        bgcolor: tab.active ? 'success.main' : 'transparent',
                                        color: tab.active ? 'white' : 'text.secondary',
                                        border: '1px solid', borderColor: tab.active ? 'success.main' : 'divider',
                                        '& .MuiChip-icon': { color: tab.active ? 'white' : 'success.main' },
                                        '&:hover': { bgcolor: tab.active ? 'success.dark' : 'grey.100' },
                                    }}
                                />
                            ))}
                        </Stack>

                        {/* Main quiz card */}
                        <Paper
                            elevation={0}
                            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: { xs: 2.5, sm: 4 }, bgcolor: 'white', mb: 2 }}
                        >
                            {/* Question number + progress */}
                            <Box sx={{ mb: 2.5 }}>
                                <Typography
                                    variant="caption"
                                    fontWeight={700}
                                    color="success.main"
                                    sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.7rem' }}
                                >
                                    Question {DEMO_QUESTION.currentQuestion} of {DEMO_QUESTION.totalQuestions}
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={progress}
                                    sx={{ mt: 0.75, height: 5, borderRadius: 3, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: 'success.main', borderRadius: 3 } }}
                                />
                            </Box>

                            {/* Question text */}
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{ lineHeight: 1.4, mb: 4, fontSize: { xs: '1.1rem', sm: '1.2rem' } }}
                            >
                                {DEMO_QUESTION.text}
                            </Typography>

                            {/* TRUE / FALSE buttons */}
                            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                {['true', 'false'].map((val) => {
                                    const btnStyle = getButtonStyle(val);
                                    const isThisSelected = selected === val;
                                    const isThisCorrect = submitted && DEMO_QUESTION.correctAnswer === val;
                                    const isThisWrong = submitted && isThisSelected && val !== DEMO_QUESTION.correctAnswer;

                                    return (
                                        <Paper
                                            key={val}
                                            elevation={0}
                                            onClick={() => handleSelect(val)}
                                            sx={{
                                                flex: 1,
                                                py: 3,
                                                border: '2px solid',
                                                borderRadius: 3,
                                                cursor: submitted ? 'default' : 'pointer',
                                                textAlign: 'center',
                                                transition: 'all 0.2s',
                                                '&:hover': submitted ? {} : {
                                                    borderColor: 'success.main',
                                                    bgcolor: '#f0fdf4',
                                                },
                                                ...btnStyle,
                                            }}
                                        >
                                            <Stack alignItems="center" spacing={1}>
                                                {isThisCorrect && <CheckCircleOutlineIcon sx={{ fontSize: 28, color: 'success.main' }} />}
                                                {isThisWrong && <CancelOutlinedIcon sx={{ fontSize: 28, color: 'error.main' }} />}
                                                <Typography
                                                    variant="h6"
                                                    fontWeight={800}
                                                    sx={{
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.12em',
                                                        fontSize: '1rem',
                                                        color: isThisCorrect ? 'success.dark' : isThisWrong ? 'error.dark' : isThisSelected ? 'success.dark' : 'text.secondary',
                                                    }}
                                                >
                                                    {val}
                                                </Typography>
                                            </Stack>
                                        </Paper>
                                    );
                                })}
                            </Box>

                            {/* Submit */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={!selected || submitted}
                                    sx={{
                                        textTransform: 'none', fontWeight: 700, px: 4, py: 1.25,
                                        bgcolor: '#166534', borderRadius: 2,
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
                                    borderColor: isCorrect ? 'success.light' : 'error.light',
                                    borderRadius: 3,
                                    p: 2.5,
                                    bgcolor: isCorrect ? '#f0fdf4' : '#fef2f2',
                                    mb: 3,
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 1.5,
                                }}
                            >
                                <CheckCircleIcon sx={{ fontSize: 28, color: isCorrect ? 'success.main' : 'error.main', flexShrink: 0, mt: 0.25 }} />
                                <Box>
                                    <Typography variant="body1" fontWeight={700} color={isCorrect ? 'success.dark' : 'error.dark'}>
                                        {isCorrect ? 'Correct!' : 'Not quite!'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        {isCorrect
                                            ? 'Emotional Intelligence is a skill set that can be cultivated and improved with practice.'
                                            : 'Research shows Emotional Intelligence can be developed through self-awareness and consistent practice over time.'}
                                    </Typography>
                                </Box>
                            </Paper>
                        )}

                        {/* Prev / Next */}
                        <Stack direction="row" justifyContent="space-between">
                            <Button startIcon={<ArrowBackIcon />} sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}>Previous</Button>
                            <Button
                                variant="contained"
                                endIcon={<ArrowForwardIcon />}
                                sx={{ textTransform: 'none', fontWeight: 700, px: 3, bgcolor: '#1a1a2e', borderRadius: 2, '&:hover': { bgcolor: '#16213e' } }}
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
