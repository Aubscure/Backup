import React from 'react';
import {
    Box, Typography, Stack, Chip, Tooltip, LinearProgress,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Avatar,
} from '@mui/material';
import { STATUS_META, SOURCE_META } from './enrolleeData';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import StarIcon from '@mui/icons-material/Star';

// ─── Progress Bar ────────────────────────────────────────────────────────────
function ProgressCell({ value }) {
    const color =
        value === 100 ? '#16a34a' :
        value >= 60   ? '#1a7309' :
        value >= 30   ? '#d97706' :
                        '#e5e7eb';

    return (
        <Box sx={{ minWidth: 120 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ flex: 1 }}>
                    <LinearProgress
                        variant="determinate"
                        value={value}
                        sx={{
                            height: 7,
                            borderRadius: 4,
                            bgcolor: '#f3f4f6',
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                bgcolor: color,
                            },
                        }}
                    />
                </Box>
                <Typography variant="caption" fontWeight={600} sx={{ color: '#374151', minWidth: 30 }}>
                    {value}%
                </Typography>
            </Stack>
        </Box>
    );
}

// ─── Status Chip ─────────────────────────────────────────────────────────────
function StatusChip({ status }) {
    const meta = STATUS_META[status] ?? STATUS_META.pending;
    return (
        <Chip
            label={meta.label.toUpperCase()}
            size="small"
            sx={{
                bgcolor: meta.bg,
                color: meta.color,
                fontWeight: 700,
                fontSize: '0.65rem',
                letterSpacing: '0.06em',
                border: `1px solid ${meta.color}30`,
                borderRadius: 1.5,
                height: 22,
            }}
        />
    );
}

// ─── Source Chip ─────────────────────────────────────────────────────────────
function SourceChip({ source, orgName }) {
    const meta = SOURCE_META[source] ?? SOURCE_META.manpro;
    const label = source === 'organization' && orgName ? orgName : meta.label;
    const Icon = source === 'organization' ? BusinessIcon : SchoolIcon;
    return (
        <Tooltip title={source === 'organization' ? `Organization: ${orgName}` : 'Direct via ManPro'} arrow placement="top">
            <Chip
                icon={<Icon sx={{ fontSize: '13px !important', color: `${meta.color} !important` }} />}
                label={label}
                size="small"
                sx={{
                    bgcolor: meta.bg,
                    color: meta.color,
                    fontWeight: 600,
                    fontSize: '0.68rem',
                    border: `1px solid ${meta.color}25`,
                    borderRadius: 1.5,
                    height: 22,
                    maxWidth: 140,
                    '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' },
                }}
            />
        </Tooltip>
    );
}

// ─── Score Cell ──────────────────────────────────────────────────────────────
function ScoreCell({ score }) {
    if (score === null || score === undefined) {
        return <Typography variant="caption" sx={{ color: 'text.disabled' }}>—</Typography>;
    }
    const color = score >= 90 ? '#16a34a' : score >= 75 ? '#d97706' : '#ef4444';
    return (
        <Stack direction="row" alignItems="center" spacing={0.4}>
            <StarIcon sx={{ fontSize: 13, color }} />
            <Typography variant="body2" fontWeight={700} sx={{ color }}>
                {score}%
            </Typography>
        </Stack>
    );
}

// ─── Main Table ──────────────────────────────────────────────────────────────
const COLUMNS = [
    { id: 'name',     label: 'Enrollee',          width: '22%' },
    { id: 'course',   label: 'Course / Plan',      width: '22%' },
    { id: 'source',   label: 'Source',             width: '14%' },
    { id: 'progress', label: 'Progress',           width: '16%' },
    { id: 'score',    label: 'Avg Score',          width: '10%' },
    { id: 'status',   label: 'Status',             width: '10%' },
    { id: 'date',     label: 'Enrolled',           width: '10%' },
];

export default function EnrolleeTable({ enrollees = [], onRowClick }) {
    if (enrollees.length === 0) {
        return (
            <Box sx={{ py: 8, textAlign: 'center' }}>
                <Typography color="text.secondary">No enrollees match the current filters.</Typography>
            </Box>
        );
    }

    return (
        <TableContainer component={Box} sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 780 }}>
                <TableHead>
                    <TableRow sx={{ bgcolor: '#f9fafb' }}>
                        {COLUMNS.map((col) => (
                            <TableCell
                                key={col.id}
                                sx={{
                                    width: col.width,
                                    fontWeight: 700,
                                    fontSize: '0.7rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.07em',
                                    color: 'text.secondary',
                                    borderBottom: '1px solid #e5e7eb',
                                    py: 1.5,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {col.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {enrollees.map((enrollee) => (
                        <TableRow
                            key={enrollee.id}
                            onClick={() => onRowClick?.(enrollee)}
                            sx={{ cursor: 'pointer' }}
                        >
                            {/* Enrollee Name + Email */}
                            <TableCell sx={{ py: 1.75 }}>
                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                    <Avatar
                                        sx={{
                                            width: 36,
                                            height: 36,
                                            bgcolor: enrollee.avatar_color,
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {enrollee.avatar_initials}
                                    </Avatar>
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                            sx={{ color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                        >
                                            {enrollee.firstname} {enrollee.lastname}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{ color: 'text.secondary', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}
                                        >
                                            {enrollee.email}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </TableCell>

                            {/* Course + Plan */}
                            <TableCell sx={{ py: 1.75 }}>
                                <Typography variant="body2" fontWeight={500} sx={{ color: '#111827' }}>
                                    {enrollee.enrolled_course}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {enrollee.course_plan} Plan
                                </Typography>
                            </TableCell>

                            {/* Source */}
                            <TableCell sx={{ py: 1.75 }}>
                                <SourceChip source={enrollee.source} orgName={enrollee.organization_name} />
                            </TableCell>

                            {/* Progress */}
                            <TableCell sx={{ py: 1.75 }}>
                                <ProgressCell value={enrollee.learning_progress} />
                            </TableCell>

                            {/* Avg Score */}
                            <TableCell sx={{ py: 1.75 }}>
                                <ScoreCell score={enrollee.avg_course_score} />
                            </TableCell>

                            {/* Status */}
                            <TableCell sx={{ py: 1.75 }}>
                                <StatusChip status={enrollee.enrollment_status} />
                            </TableCell>

                            {/* Enrolled Date */}
                            <TableCell sx={{ py: 1.75 }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {new Date(enrollee.enrolled_at).toLocaleDateString('en-US', {
                                        month: 'short', day: 'numeric', year: 'numeric',
                                    })}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}