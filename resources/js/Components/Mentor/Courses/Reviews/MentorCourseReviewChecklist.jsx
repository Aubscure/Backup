import {
    Box,
    Button,
    Chip,
    Divider,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    Typography,
    Alert,
} from '@mui/material';
import CheckCircleRoundedIcon  from '@mui/icons-material/CheckCircleRounded';
import WarningRoundedIcon      from '@mui/icons-material/WarningRounded';
import EditOutlinedIcon        from '@mui/icons-material/EditOutlined';
import WorkspacePremiumIcon    from '@mui/icons-material/WorkspacePremium';
import { router }              from '@inertiajs/react';

const PALETTE = {
    green: { 100: '#D1FAE5', 600: '#059669', 700: '#047857', 800: '#065F46' },
    gray:  { 200: '#E5E7EB', 600: '#4B5563' },
};

// ─── Single checklist row ─────────────────────────────────────────────────────

const ChecklistItem = ({ label, description, isComplete, stepLabel, onEdit }) => (
    <ListItem
        secondaryAction={
            <Button
                size="small"
                variant="outlined"
                startIcon={<EditOutlinedIcon sx={{ fontSize: '0.85rem !important' }} />}
                onClick={onEdit}
                sx={{
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                    borderColor: PALETTE.gray[200],
                    gap: 0.25,
                    '&:hover': {
                        borderColor: PALETTE.gray[600],
                        color: 'text.primary',
                        bgcolor: 'grey.50',
                    },
                }}
            >
                {stepLabel}
            </Button>
        }
        sx={{ py: 2, pr: '130px' }}
    >
        <ListItemIcon sx={{ minWidth: 40 }}>
            {isComplete
                ? <CheckCircleRoundedIcon color="success" />
                : <WarningRoundedIcon color="warning" />}
        </ListItemIcon>
        <ListItemText
            primary={
                <Typography variant="subtitle2" fontWeight={600}>
                    {label}
                </Typography>
            }
            secondary={
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {description}
                </Typography>
            }
        />
    </ListItem>
);

// ─── Main exported component ──────────────────────────────────────────────────

/**
 * MentorCourseChecklist
 *
 * checklist shape (5 items, progress now out of 5):
 * {
 *   has_basic_info,
 *   has_curriculum, syllabus_count, lesson_count,
 *   has_media, media_count, modules_without_media,
 *   has_pricing,
 *   has_certificate,   ← NEW required step
 * }
 */
export default function MentorCourseChecklist({ checklist, course, progress, onPublish }) {

    const navigate = (routeName, params) =>
        router.visit(route(routeName, params));

    const mediaDescription = () => {
        if (checklist.has_media) {
            return `All modules have media. ${checklist.media_count} resource${checklist.media_count !== 1 ? 's' : ''} uploaded.`;
        }
        if (checklist.modules_without_media?.length > 0) {
            const missing = checklist.modules_without_media;
            return missing.length <= 2
                ? `No media in: ${missing.join(', ')}.`
                : `${missing.length} module${missing.length !== 1 ? 's' : ''} still missing media.`;
        }
        return 'No media resources uploaded yet.';
    };

    const allContentReady = checklist.has_basic_info
        && checklist.has_curriculum
        && checklist.has_media
        && checklist.has_pricing;

    const readyToPublish = allContentReady && checklist.has_certificate;

    return (
        <Paper
            sx={{
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'white',
            }}
        >
            {/* ── Header ── */}
            <Box
                sx={{
                    px: 3,
                    py: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 1.5,
                    bgcolor: 'grey.50',
                }}
            >
                <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircleRoundedIcon fontSize="small" color="action" />
                    <Typography variant="subtitle2" fontWeight={600}>
                        Completeness Checklist
                    </Typography>
                </Stack>

                {readyToPublish ? (
                    <Chip
                        label="✓ All requirements met"
                        size="small"
                        sx={{
                            fontWeight: 600,
                            bgcolor: PALETTE.green[100],
                            color: PALETTE.green[800],
                        }}
                    />
                ) : (
                    <Chip
                        label={`${progress}% Complete`}
                        color="warning"
                        size="small"
                        sx={{ fontWeight: 600 }}
                    />
                )}
            </Box>

            {/* ── Progress bar ── */}
            <LinearProgress
                variant="determinate"
                value={progress}
                color={readyToPublish ? 'success' : 'warning'}
                sx={{ height: 4 }}
            />

            {/* ── Certificate warning banner ── */}
            {allContentReady && !checklist.has_certificate && (
                <Box sx={{ px: 3, pt: 2.5 }}>
                    <Alert
                        severity="warning"
                        icon={<WorkspacePremiumIcon fontSize="inherit" />}
                        action={
                            <Button
                                size="small"
                                color="warning"
                                variant="outlined"
                                sx={{ textTransform: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}
                                onClick={() => router.visit(route('certificates.index'))}
                            >
                                Design Certificate
                            </Button>
                        }
                        sx={{ borderRadius: 2 }}
                    >
                        <strong>Certificate required before publishing.</strong>
                        {' '}Your course content is complete — design a certificate so students have something to earn.
                    </Alert>
                </Box>
            )}

            {/* ── Checklist rows ── */}
            <List disablePadding>
                {/* 1. Basic Information */}
                <ChecklistItem
                    label="Basic Information"
                    description="Title, subtitle, and description."
                    isComplete={checklist.has_basic_info}
                    stepLabel="Edit Details"
                    onEdit={() => navigate('mentor.courses.edit', course.id)}
                />

                <Divider component="li" />

                {/* 2. Curriculum Structure */}
                <ChecklistItem
                    label="Curriculum Structure"
                    description={`${checklist.syllabus_count} module${checklist.syllabus_count !== 1 ? 's' : ''}, ${checklist.lesson_count} lesson${checklist.lesson_count !== 1 ? 's' : ''}.`}
                    isComplete={checklist.has_curriculum}
                    stepLabel="Edit Syllabus"
                    onEdit={() => navigate('mentor.syllabus', course.id)}
                />

                <Divider component="li" />

                {/* 3. Course Content & Media */}
                <ChecklistItem
                    label="Course Content & Media"
                    description={mediaDescription()}
                    isComplete={checklist.has_media}
                    stepLabel="Edit Media"
                    onEdit={() => navigate('mentor.courses.media-content', course.id)}
                />

                <Divider component="li" />

                {/* 4. Pricing */}
                <ChecklistItem
                    label="Pricing"
                    description={
                        checklist.has_pricing
                            ? 'Pricing plans configured.'
                            : 'No pricing plan selected.'
                    }
                    isComplete={checklist.has_pricing}
                    stepLabel="Edit Pricing"
                    onEdit={() => navigate('mentor.courses.pricing', course.id)}
                />

                <Divider component="li" />

                {/* 5. Certificate — required before publish */}
                <ChecklistItem
                    label="Completion Certificate"
                    description={
                        checklist.has_certificate
                            ? 'Certificate designed. Students will receive one on completion.'
                            : 'No certificate yet. Required before the course can be published.'
                    }
                    isComplete={checklist.has_certificate}
                    stepLabel="Design Certificate"
                    onEdit={() => router.visit(route('certificates.index'))}
                />
            </List>
        </Paper>
    );
}
