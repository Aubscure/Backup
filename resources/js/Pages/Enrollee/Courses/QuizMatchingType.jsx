import { useState, useRef, useEffect, useCallback } from 'react';
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
import QuizIcon from '@mui/icons-material/Quiz';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const SIDEBAR_WIDTH = 240;

// ─── Static demo data ────────────────────────────────────────────────────────
const SCENARIOS = [
    { id: 'sc1', text: 'You pause before reacting to criticism to consider your response objectively.' },
    { id: 'sc2', text: 'You sense a team member is stressed and offer support without being asked.' },
    { id: 'sc3', text: 'You set challenging personal goals and maintain a positive outlook despite setbacks.' },
];

const ANSWERS = [
    { id: 'an1', label: 'Self-Regulation' },
    { id: 'an2', label: 'Empathy' },
    { id: 'an3', label: 'Motivation' },
    { id: 'an4', label: 'Social Skills' },
];

// correct pair: sc1 → an1, sc2 → an2, sc3 → an3
const CORRECT_MAP = { sc1: 'an1', sc2: 'an2', sc3: 'an3' };

// Pre-matched demo pair (shown highlighted as the "already matched" example)
const INITIAL_MATCHES = { sc1: 'an1' };

const LESSON_TABS = [
    { id: 1, label: '1.1 Introduction', active: false },
    { id: 2, label: '1.2 Core Components', active: false },
    { id: 3, label: '1.3 Why Emotional Intelligence Matter', active: false },
    { id: 4, label: 'Quiz', active: true, isQuiz: true },
];

// ─── ConnectorLine component ──────────────────────────────────────────────────
// Draws an SVG line between two DOM nodes (their connector dots)
function ConnectorLines({ matches, leftRefs, rightRefs, containerRef }) {
    const [lines, setLines] = useState([]);

    const recalc = useCallback(() => {
        if (!containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const newLines = [];

        Object.entries(matches).forEach(([scId, anId]) => {
            const leftEl = leftRefs.current[scId];
            const rightEl = rightRefs.current[anId];
            if (!leftEl || !rightEl) return;

            const lRect = leftEl.getBoundingClientRect();
            const rRect = rightEl.getBoundingClientRect();

            newLines.push({
                id: `${scId}-${anId}`,
                x1: lRect.left + lRect.width / 2 - containerRect.left,
                y1: lRect.top + lRect.height / 2 - containerRect.top,
                x2: rRect.left + rRect.width / 2 - containerRect.left,
                y2: rRect.top + rRect.height / 2 - containerRect.top,
            });
        });

        setLines(newLines);
    }, [matches, leftRefs, rightRefs, containerRef]);

    useEffect(() => {
        recalc();
        window.addEventListener('resize', recalc);
        return () => window.removeEventListener('resize', recalc);
    }, [recalc]);

    return (
        <svg
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10, overflow: 'visible' }}
        >
            {lines.map((ln) => (
                <line
                    key={ln.id}
                    x1={ln.x1} y1={ln.y1}
                    x2={ln.x2} y2={ln.y2}
                    stroke="#16a34a"
                    strokeWidth={2}
                    strokeDasharray="0"
                />
            ))}
        </svg>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function QuizMatchingType({ course }) {
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [matches, setMatches] = useState(INITIAL_MATCHES);       // { scId: anId }
    const [activeScenario, setActiveScenario] = useState(null);    // selected left item waiting for a right selection
    const [submitted, setSubmitted] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const containerRef = useRef(null);
    const leftDotsRef = useRef({});
    const rightDotsRef = useRef({});

    const DEMO_QUESTION = {
        text: 'Match each scenario to its corresponding Emotional Intelligence domain.',
        subLabel: 'SELECT THE PAIRS THAT CORRESPOND:',
        totalQuestions: 5,
        currentQuestion: 1,
    };

    const progress = (DEMO_QUESTION.currentQuestion / DEMO_QUESTION.totalQuestions) * 100;

    const handleScenarioClick = (scId) => {
        if (submitted) return;
        setActiveScenario(scId === activeScenario ? null : scId);
    };

    const handleAnswerClick = (anId) => {
        if (submitted || !activeScenario) return;
        setMatches((prev) => {
            const updated = { ...prev };
            // Remove any prior match that used this answer
            Object.keys(updated).forEach((k) => { if (updated[k] === anId) delete updated[k]; });
            updated[activeScenario] = anId;
            return updated;
        });
        setActiveScenario(null);
    };

    const handleSubmit = () => {
        setSubmitted(true);
        setShowResult(true);
    };

    const handleReset = () => {
        setMatches(INITIAL_MATCHES);
        setActiveScenario(null);
        setSubmitted(false);
        setShowResult(false);
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
                            <Typography variant="body2" color="text.secondary">Matching Type Assessment</Typography>
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

                        {/* Main card */}
                        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: { xs: 2, sm: 3 }, bgcolor: 'white', mb: 2 }}>

                            {/* Question header */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 2.5 }}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1" fontWeight={700} sx={{ fontSize: '1.05rem', lineHeight: 1.5 }}>
                                        {DEMO_QUESTION.text}
                                    </Typography>
                                    <Typography variant="caption" fontWeight={700} sx={{ display: 'block', mt: 1, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary', fontSize: '0.68rem' }}>
                                        {DEMO_QUESTION.subLabel}
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right', minWidth: 130, flexShrink: 0 }}>
                                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.65rem' }}>
                                        Question {DEMO_QUESTION.currentQuestion} of {DEMO_QUESTION.totalQuestions}
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate" value={progress}
                                        sx={{ mt: 0.75, height: 5, borderRadius: 3, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: 'success.main', borderRadius: 3 } }}
                                    />
                                </Box>
                            </Box>

                            {/* Instruction hint */}
                            {!submitted && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5, fontStyle: 'italic' }}>
                                    Click a scenario on the left, then click the matching category on the right to connect them.
                                </Typography>
                            )}

                            {/* Matching area */}
                            <Box
                                ref={containerRef}
                                sx={{ position: 'relative', display: 'flex', gap: { xs: 2, sm: 4 }, alignItems: 'flex-start' }}
                            >
                                {/* Left column – scenarios */}
                                <Box sx={{ flex: 1 }}>
                                    {SCENARIOS.map((sc) => {
                                        const isActive = activeScenario === sc.id;
                                        const isMatched = !!matches[sc.id];
                                        const matchedAnId = matches[sc.id];
                                        const isCorrect = submitted && matchedAnId === CORRECT_MAP[sc.id];
                                        const isWrong = submitted && isMatched && !isCorrect;

                                        return (
                                            <Box
                                                key={sc.id}
                                                sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}
                                            >
                                                <Paper
                                                    elevation={0}
                                                    onClick={() => handleScenarioClick(sc.id)}
                                                    sx={{
                                                        flex: 1,
                                                        p: '10px 14px',
                                                        border: '1.5px solid',
                                                        borderRadius: 2,
                                                        cursor: submitted ? 'default' : 'pointer',
                                                        transition: 'all 0.18s',
                                                        borderColor: isActive ? 'success.main'
                                                            : isCorrect ? 'success.main'
                                                            : isWrong ? 'error.main'
                                                            : isMatched ? 'success.light'
                                                            : 'grey.300',
                                                        bgcolor: isActive ? '#f0fdf4'
                                                            : isCorrect ? '#f0fdf4'
                                                            : isWrong ? '#fef2f2'
                                                            : isMatched ? '#f0fdf4'
                                                            : 'white',
                                                        boxShadow: isActive ? '0 0 0 2px #16a34a' : 'none',
                                                    }}
                                                >
                                                    <Typography variant="body2" fontWeight={isMatched ? 600 : 400} color={isMatched || isActive ? 'success.dark' : 'text.primary'} sx={{ lineHeight: 1.5 }}>
                                                        {sc.text}
                                                    </Typography>
                                                </Paper>
                                                {/* Dot connector */}
                                                <Box
                                                    ref={(el) => { leftDotsRef.current[sc.id] = el; }}
                                                    sx={{ width: 12, height: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                >
                                                    {isMatched
                                                        ? <FiberManualRecordIcon sx={{ fontSize: 12, color: 'success.main' }} />
                                                        : <RadioButtonUncheckedIcon sx={{ fontSize: 12, color: isActive ? 'success.main' : 'grey.400' }} />
                                                    }
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </Box>

                                {/* SVG connector lines */}
                                <ConnectorLines matches={matches} leftRefs={leftDotsRef} rightRefs={rightDotsRef} containerRef={containerRef} />

                                {/* Right column – answer options */}
                                <Box sx={{ flex: 1 }}>
                                    {ANSWERS.map((an) => {
                                        const isUsed = Object.values(matches).includes(an.id);
                                        const matchedScId = Object.keys(matches).find((k) => matches[k] === an.id);
                                        const isCorrect = submitted && matchedScId && CORRECT_MAP[matchedScId] === an.id;
                                        const isWrong = submitted && isUsed && !isCorrect;

                                        return (
                                            <Box
                                                key={an.id}
                                                sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}
                                            >
                                                {/* Dot connector */}
                                                <Box
                                                    ref={(el) => { rightDotsRef.current[an.id] = el; }}
                                                    sx={{ width: 12, height: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                >
                                                    {isUsed
                                                        ? <FiberManualRecordIcon sx={{ fontSize: 12, color: 'success.main' }} />
                                                        : <RadioButtonUncheckedIcon sx={{ fontSize: 12, color: 'grey.400' }} />
                                                    }
                                                </Box>
                                                <Paper
                                                    elevation={0}
                                                    onClick={() => handleAnswerClick(an.id)}
                                                    sx={{
                                                        flex: 1,
                                                        p: '10px 14px',
                                                        border: '1.5px solid',
                                                        borderRadius: 2,
                                                        cursor: submitted ? 'default' : activeScenario ? 'pointer' : 'default',
                                                        transition: 'all 0.18s',
                                                        borderColor: isCorrect ? 'success.main'
                                                            : isWrong ? 'error.main'
                                                            : isUsed ? 'success.light'
                                                            : 'grey.300',
                                                        bgcolor: isCorrect ? '#f0fdf4'
                                                            : isWrong ? '#fef2f2'
                                                            : isUsed ? '#f0fdf4'
                                                            : 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        '&:hover': (submitted || !activeScenario) ? {} : { borderColor: 'success.light', bgcolor: '#f0fdf4' },
                                                    }}
                                                >
                                                    <Typography variant="body2" fontWeight={isUsed ? 600 : 400} color={isUsed ? 'success.dark' : 'text.secondary'}>
                                                        {an.label}
                                                    </Typography>
                                                    {isCorrect && <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />}
                                                </Paper>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            </Box>

                            {/* Submit row */}
                            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={Object.keys(matches).length === 0 || submitted}
                                    sx={{ textTransform: 'none', fontWeight: 700, px: 4, py: 1.25, bgcolor: '#166534', borderRadius: 2, '&:hover': { bgcolor: '#14532d' }, '&.Mui-disabled': { bgcolor: 'grey.300' } }}
                                >
                                    Submit Answer
                                </Button>
                            </Box>
                        </Paper>

                        {/* Result feedback */}
                        {showResult && (
                            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'success.light', borderRadius: 3, p: 2.5, bgcolor: '#f0fdf4', mb: 3, display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                <CheckCircleIcon sx={{ fontSize: 28, color: 'success.main', flexShrink: 0, mt: 0.25 }} />
                                <Box>
                                    <Typography variant="body1" fontWeight={700} color="success.dark">Well done!</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        You correctly matched the scenarios to their Emotional Intelligence domains. Recognizing these behaviors is key to mastering workplace interpersonal dynamics.
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
