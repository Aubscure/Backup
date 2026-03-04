import { useState, useRef } from 'react';
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
    Divider,
    useMediaQuery,
    useTheme,
    LinearProgress,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import QuizIcon from '@mui/icons-material/Quiz';
import CancelIcon from '@mui/icons-material/Cancel';

const SIDEBAR_WIDTH = 240;

// ─── Static demo data ────────────────────────────────────────────────────────
const DEMO_QUESTION = {
    id: 1,
    title: 'Match the behaviors to their corresponding EI domains.',
    instruction: 'Drag each scenario from the left and drop it into the correct category on the right.',
    totalQuestions: 5,
    currentQuestion: 1,
};

const INITIAL_SCENARIOS = [
    { id: 's1', text: 'You actively listen and validate a colleague\'s frustration without offering immediate solutions.' },
    { id: 's2', text: 'You set clear career goals and pursue them even when facing unexpected setbacks.' },
    { id: 's3', text: 'You recognize that your heart rate increases when your boss enters the room.' },
];

const CATEGORIES = [
    { id: 'self-regulation', label: 'Self-Regulation' },
    { id: 'empathy', label: 'Empathy' },
    { id: 'motivation', label: 'Motivation' },
    { id: 'self-awareness', label: 'Self-Awareness' },
    { id: 'social-skills', label: 'Social Skills' },
];

// Pre-placed item (shown in the screenshot already in Self-Regulation)
const INITIAL_PLACED = {
    'self-regulation': [{ id: 's0', text: 'You pause before reacting to criticism to consider your response objectively.' }],
    'empathy': [],
    'motivation': [],
    'self-awareness': [],
    'social-skills': [],
};

// Lesson nav tabs (breadcrumb style)
const LESSON_TABS = [
    { id: 1, label: '1.1 Introduction', active: false, isQuiz: false },
    { id: 2, label: '1.2 Core Components', active: false, isQuiz: false },
    { id: 3, label: '1.3 Why Emotional Intelligence Matter', active: false, isQuiz: false },
    { id: 4, label: 'Quiz', active: true, isQuiz: true },
];

// ─── DraggableScenario ────────────────────────────────────────────────────────
function DraggableScenario({ scenario, onDragStart }) {
    return (
        <Paper
            draggable
            onDragStart={(e) => onDragStart(e, scenario)}
            elevation={0}
            sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1,
                p: 1.5,
                mb: 1.5,
                border: '1px solid',
                borderColor: 'grey.200',
                borderRadius: 2,
                bgcolor: 'white',
                cursor: 'grab',
                transition: 'all 0.18s',
                '&:hover': {
                    borderColor: 'success.main',
                    boxShadow: '0 2px 8px rgba(22,101,52,0.10)',
                },
                '&:active': {
                    cursor: 'grabbing',
                    opacity: 0.7,
                },
            }}
        >
            <DragIndicatorIcon sx={{ fontSize: 18, color: 'grey.400', mt: 0.25, flexShrink: 0 }} />
            <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.5 }}>
                {scenario.text}
            </Typography>
        </Paper>
    );
}

// ─── DroppableCategory ────────────────────────────────────────────────────────
function DroppableCategory({ category, placedItems, onDrop, onDragOver, onRemoveItem }) {
    const [hovering, setHovering] = useState(false);
    const hasItems = placedItems.length > 0;

    return (
        <Paper
            elevation={0}
            onDragOver={(e) => { e.preventDefault(); setHovering(true); onDragOver(e); }}
            onDragLeave={() => setHovering(false)}
            onDrop={(e) => { setHovering(false); onDrop(e, category.id); }}
            sx={{
                mb: 1.5,
                border: '1.5px dashed',
                borderColor: hovering ? 'success.main' : hasItems ? 'success.light' : 'grey.300',
                borderRadius: 2,
                bgcolor: hovering ? 'success.50' : hasItems ? '#f0fdf4' : 'white',
                minHeight: 56,
                transition: 'all 0.18s',
                overflow: 'hidden',
            }}
        >
            {/* Category header */}
            <Box
                sx={{
                    px: 1.5,
                    py: 0.75,
                    borderBottom: hasItems ? '1px solid' : 'none',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Typography
                    variant="caption"
                    fontWeight={700}
                    sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'success.dark', fontSize: '0.65rem' }}
                >
                    {category.label}
                </Typography>
                {hasItems && (
                    <Box
                        sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            bgcolor: 'success.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography sx={{ fontSize: '0.6rem', color: 'white', fontWeight: 700 }}>
                            {placedItems.length}
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Placed items */}
            {hasItems ? (
                <Box sx={{ p: 1 }}>
                    {placedItems.map((item) => (
                        <Box
                            key={item.id}
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 0.5,
                                p: 1,
                                mb: 0.5,
                                bgcolor: 'white',
                                borderRadius: 1.5,
                                border: '1px solid',
                                borderColor: 'success.light',
                            }}
                        >
                            <Typography variant="body2" color="text.primary" sx={{ flex: 1, fontSize: '0.8rem', lineHeight: 1.4 }}>
                                "{item.text}"
                            </Typography>
                            <IconButton
                                size="small"
                                onClick={() => onRemoveItem(item.id, category.id)}
                                sx={{ p: 0.25, color: 'grey.400', '&:hover': { color: 'error.main' }, flexShrink: 0 }}
                            >
                                <CancelIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
            ) : (
                <Box sx={{ px: 1.5, py: 1.25, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                        Drop here
                    </Typography>
                </Box>
            )}
        </Paper>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function QuizDragAndDrop({ course, lesson, allLessonsForNav = [] }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    // drag state
    const [scenarios, setScenarios] = useState(INITIAL_SCENARIOS);
    const [placed, setPlaced] = useState(INITIAL_PLACED);
    const [dragging, setDragging] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [showResult, setShowResult] = useState(false);

    // ── drag handlers ──────────────────────────────────────────────────────────
    const handleDragStart = (e, scenario) => {
        setDragging(scenario);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDrop = (e, categoryId) => {
        e.preventDefault();
        if (!dragging) return;

        // Remove from scenarios list if it came from there
        setScenarios((prev) => prev.filter((s) => s.id !== dragging.id));

        // Remove from any other category it might already be in
        setPlaced((prev) => {
            const updated = {};
            for (const [key, items] of Object.entries(prev)) {
                updated[key] = items.filter((i) => i.id !== dragging.id);
            }
            updated[categoryId] = [...updated[categoryId], dragging];
            return updated;
        });

        setDragging(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    // Remove item from category → return to scenarios
    const handleRemoveItem = (itemId, categoryId) => {
        const item = placed[categoryId].find((i) => i.id === itemId);
        if (!item) return;
        setPlaced((prev) => ({
            ...prev,
            [categoryId]: prev[categoryId].filter((i) => i.id !== itemId),
        }));
        setScenarios((prev) => [...prev, item]);
    };

    // Reset everything (except the pre-placed demo item)
    const handleReset = () => {
        setScenarios(INITIAL_SCENARIOS);
        setPlaced(INITIAL_PLACED);
        setSubmitted(false);
        setShowResult(false);
    };

    const handleSubmit = () => {
        setSubmitted(true);
        setShowResult(true);
    };

    const progress = (DEMO_QUESTION.currentQuestion / DEMO_QUESTION.totalQuestions) * 100;
    const allPlaced = scenarios.length === 0;

    return (
        <>
            <Head title={`Quiz — ${course?.title || 'Emotional Intelligence at Work'}`} />
            <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
                {/* Sidebar */}
                <EnrolleeSidebar
                    activePage="courses"
                    mobileOpen={mobileOpen}
                    onMobileClose={() => setMobileOpen(false)}
                />

                <Box sx={{ ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` }, transition: theme.transitions.create('margin') }}>
                    {/* Top bar */}
                    <Paper
                        square
                        elevation={0}
                        sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'white', position: 'sticky', top: 0, zIndex: 1100 }}
                    >
                        <Box sx={{ display: 'flex', height: 64, alignItems: 'center', justifyContent: 'space-between', px: { xs: 2, sm: 3, lg: 4 } }}>
                            <IconButton
                                color="inherit"
                                edge="start"
                                onClick={() => setMobileOpen(!mobileOpen)}
                                sx={{ mr: 2, display: { md: 'none' } }}
                            >
                                <MenuIcon />
                            </IconButton>

                            {/* Search placeholder */}
                            <Box
                                sx={{
                                    display: { xs: 'none', sm: 'flex' },
                                    alignItems: 'center',
                                    bgcolor: 'grey.100',
                                    borderRadius: 50,
                                    px: 2,
                                    py: 0.75,
                                    width: 380,
                                    gap: 1,
                                }}
                            >
                                <Typography variant="body2" color="text.disabled" sx={{ fontSize: '0.85rem' }}>
                                    Search for skills, mentors, or topics...
                                </Typography>
                            </Box>

                            <Stack direction="row" spacing={2} alignItems="center" sx={{ ml: 'auto' }}>
                                <Typography
                                    variant="body2"
                                    fontWeight={500}
                                    sx={{ color: 'text.secondary', display: { xs: 'none', md: 'block' } }}
                                >
                                    ManPro Learning Hub
                                </Typography>
                                <Box sx={{ position: 'relative', cursor: 'pointer' }}>
                                    <NotificationsNoneIcon sx={{ color: 'grey.500' }} />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            bgcolor: 'error.main',
                                        }}
                                    />
                                </Box>
                            </Stack>
                        </Box>
                    </Paper>

                    {/* Content */}
                    <Box sx={{ p: { xs: 2, sm: 3, lg: 4 }, maxWidth: 1100, mx: 'auto' }}>

                        {/* Breadcrumb */}
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1 }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                COURSES
                            </Typography>
                            <Typography variant="caption" color="text.secondary">/</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                QUIZ
                            </Typography>
                        </Stack>

                        {/* Title & progress row */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 1.5 }}>
                            <Box>
                                <Typography variant="h5" fontWeight={800}>
                                    {course?.title || 'Emotional Intelligence at Work'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Drag and Drop Assessment
                                </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right', minWidth: 160 }}>
                                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    Question {DEMO_QUESTION.currentQuestion} of {DEMO_QUESTION.totalQuestions}
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={progress}
                                    sx={{
                                        mt: 0.75,
                                        height: 6,
                                        borderRadius: 3,
                                        bgcolor: 'grey.200',
                                        '& .MuiLinearProgress-bar': { bgcolor: 'success.main', borderRadius: 3 },
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Lesson tabs / nav chips */}
                        <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={0} gap={0.75} sx={{ mb: 3 }}>
                            {LESSON_TABS.map((tab, i) => (
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
                                        cursor: 'pointer',
                                        '& .MuiChip-icon': { color: tab.active ? 'white' : 'success.main' },
                                        '&:hover': {
                                            bgcolor: tab.active ? 'success.dark' : 'grey.100',
                                        },
                                    }}
                                />
                            ))}
                        </Stack>

                        {/* Main quiz card */}
                        <Paper
                            elevation={0}
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 3,
                                p: { xs: 2, sm: 3 },
                                bgcolor: 'white',
                                mb: 2,
                            }}
                        >
                            {/* Question heading */}
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                                {DEMO_QUESTION.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                {DEMO_QUESTION.instruction}
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                                {/* ── Left: Scenarios ── */}
                                <Box sx={{ flex: 1 }}>
                                    <Typography
                                        variant="caption"
                                        fontWeight={700}
                                        sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary', fontSize: '0.68rem', mb: 1.5, display: 'block' }}
                                    >
                                        Scenarios
                                    </Typography>

                                    {scenarios.length > 0 ? (
                                        scenarios.map((scenario) => (
                                            <DraggableScenario
                                                key={scenario.id}
                                                scenario={scenario}
                                                onDragStart={handleDragStart}
                                            />
                                        ))
                                    ) : (
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                p: 3,
                                                textAlign: 'center',
                                                borderStyle: 'dashed',
                                                borderRadius: 2,
                                                bgcolor: 'grey.50',
                                            }}
                                        >
                                            <CheckCircleIcon sx={{ fontSize: 32, color: 'success.main', mb: 0.5 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                All scenarios have been placed!
                                            </Typography>
                                        </Paper>
                                    )}
                                </Box>

                                {/* ── Divider ── */}
                                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

                                {/* ── Right: Categories ── */}
                                <Box sx={{ flex: 1 }}>
                                    <Typography
                                        variant="caption"
                                        fontWeight={700}
                                        sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary', fontSize: '0.68rem', mb: 1.5, display: 'block' }}
                                    >
                                        Categories
                                    </Typography>

                                    {CATEGORIES.map((cat) => (
                                        <DroppableCategory
                                            key={cat.id}
                                            category={cat}
                                            placedItems={placed[cat.id] || []}
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                            onRemoveItem={handleRemoveItem}
                                        />
                                    ))}
                                </Box>
                            </Box>

                            {/* Action row */}
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider', flexWrap: 'wrap', gap: 1 }}
                            >
                                <Button
                                    startIcon={<RefreshIcon />}
                                    onClick={handleReset}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        color: 'text.secondary',
                                        '&:hover': { bgcolor: 'grey.100' },
                                    }}
                                >
                                    Reset Assessment
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={submitted}
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
                            </Stack>
                        </Paper>

                        {/* ── Result feedback ── */}
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

                        {/* ── Prev / Next ── */}
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            sx={{ pt: 1 }}
                        >
                            <Button
                                startIcon={<ArrowBackIcon />}
                                sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
                            >
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
