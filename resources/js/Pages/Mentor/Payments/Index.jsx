import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import {
    Box, Typography, Paper, Stack, Grid, Chip, Card, CardContent,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, InputAdornment, Select, MenuItem, FormControl, Divider,
    keyframes,
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MentorLayout from '@/Layouts/MentorLayout';

// ─── Animation ────────────────────────────────────────────────────────────────
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Static Placeholder Data ──────────────────────────────────────────────────
const STATIC_STATS = {
    totalRevenue:    124500,
    pendingAmount:   8200,
    completedCount:  342,
    revenueGrowth:   '+12%',
};

const STATIC_TRANSACTIONS = [
    { id: 1, date: '2025-02-20', course: 'Advanced Project Management', learner: 'Jane Doe',         amount: 299,  status: 'completed', type: 'Individual'   },
    { id: 2, date: '2025-02-19', course: 'Leadership Essentials',        learner: 'Acme Corp',        amount: 2490, status: 'completed', type: 'Organization' },
    { id: 3, date: '2025-02-18', course: 'Data Analytics Fundamentals',  learner: 'John Smith',       amount: 199,  status: 'pending',   type: 'Individual'   },
    { id: 4, date: '2025-02-17', course: 'Agile Methodologies',          learner: 'Tech Solutions',   amount: 1890, status: 'completed', type: 'Organization' },
    { id: 5, date: '2025-02-16', course: 'Advanced Project Management',  learner: 'Maria Garcia',     amount: 299,  status: 'completed', type: 'Individual'   },
    { id: 6, date: '2025-02-15', course: 'Leadership Essentials',        learner: 'Global Industries', amount: 3200, status: 'pending',  type: 'Organization' },
    { id: 7, date: '2025-02-14', course: 'Data Analytics Fundamentals',  learner: 'Carlos Reyes',     amount: 199,  status: 'completed', type: 'Individual'   },
];

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency', currency: 'PHP',
        minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(amount || 0);
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ title, value, subtitle, icon, trend, iconBg }) {
    return (
        <Card
            elevation={0}
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, height: '100%' }}
        >
            <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="caption"
                            sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.7rem', color: 'text.secondary', display: 'block' }}
                        >
                            {title}
                        </Typography>
                        <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5, mb: 0.25, wordBreak: 'break-word' }}>
                            {value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.78rem', display: 'block', lineHeight: 1.3 }}>
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{
                        width: 48, height: 48, borderRadius: '50%',
                        bgcolor: iconBg || '#f0fdf4',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ml: 1,
                    }}>
                        {icon}
                    </Box>
                </Stack>
                {trend && (
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1.5 }}>
                        <TrendingUpIcon sx={{ fontSize: 15, color: '#16a34a' }} />
                        <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 600 }}>
                            {trend} from last month
                        </Typography>
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PaymentsIndex() {
    const [search,     setSearch]     = useState('');
    const [statusFilter, setStatus]   = useState('');
    const [typeFilter,   setType]     = useState('');

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return STATIC_TRANSACTIONS.filter((t) => {
            const matchSearch = !q || t.course.toLowerCase().includes(q) || t.learner.toLowerCase().includes(q);
            const matchStatus = !statusFilter || t.status === statusFilter;
            const matchType   = !typeFilter   || t.type   === typeFilter;
            return matchSearch && matchStatus && matchType;
        });
    }, [search, statusFilter, typeFilter]);

    const selectSx = {
        height: 40, fontSize: '0.875rem',
        bgcolor: 'white', borderRadius: 1.5,
        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
    };

    return (
        <>
            <Head title="Payments" />

            <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <Box component="main" sx={{ p: { xs: 2, md: 4 } }}>

                        {/* ── Page Header ────────────────────────────────── */}
                        <Box sx={{ animation: `${fadeInUp} 0.4s ease-out both` }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1} mb={0.5}>
                                <Box>
                                    <Typography variant="h4" fontWeight={700} sx={{ color: '#111827' }}>
                                        Payments
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
                                        View and manage your course revenue and transactions.
                                    </Typography>
                                </Box>
                                <Chip
                                    icon={
                                        <FiberManualRecordIcon
                                            sx={{ fontSize: '10px !important', color: '#16a34a !important', animation: 'pulse 2s infinite' }}
                                        />
                                    }
                                    label="LIVE UPDATES ACTIVE"
                                    size="small"
                                    sx={{
                                        bgcolor: '#f0fdf4', color: '#16a34a', fontWeight: 700,
                                        fontSize: '0.65rem', letterSpacing: '0.06em',
                                        border: '1px solid #bbf7d0', borderRadius: 1.5, height: 26,
                                        alignSelf: 'flex-start', mt: 0.5,
                                        '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.4 } },
                                    }}
                                />
                            </Stack>
                        </Box>

                        {/* ── Stat Cards ─────────────────────────────────── */}
                        <Box sx={{ mt: 3, animation: `${fadeInUp} 0.45s ease-out both`, animationDelay: '0.05s' }}>
                            <Grid container spacing={2.5}>
                                <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
                                    <StatCard
                                        title="Total Revenue"
                                        value={formatCurrency(STATIC_STATS.totalRevenue)}
                                        subtitle="Lifetime earnings"
                                        trend={STATIC_STATS.revenueGrowth}
                                        icon={<AttachMoneyIcon sx={{ color: '#16a34a', fontSize: 24 }} />}
                                        iconBg="#f0fdf4"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
                                    <StatCard
                                        title="Pending Amount"
                                        value={formatCurrency(STATIC_STATS.pendingAmount)}
                                        subtitle="Awaiting clearance"
                                        icon={<PendingActionsIcon sx={{ color: '#d97706', fontSize: 24 }} />}
                                        iconBg="#fffbeb"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
                                    <StatCard
                                        title="Completed Transactions"
                                        value={STATIC_STATS.completedCount}
                                        subtitle="Successful payments"
                                        icon={<CheckCircleIcon sx={{ color: '#16a34a', fontSize: 24 }} />}
                                        iconBg="#f0fdf4"
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        {/* ── Transactions Card ──────────────────────────── */}
                        <Paper
                            elevation={0}
                            sx={{
                                mt: 3, border: '1px solid', borderColor: 'divider',
                                borderRadius: 3, overflow: 'hidden',
                                animation: `${fadeInUp} 0.5s ease-out both`, animationDelay: '0.1s',
                            }}
                        >
                            {/* Filters bar */}
                            <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center">
                                    <TextField
                                        size="small"
                                        placeholder="Search course or learner…"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        sx={{ flex: 1, minWidth: 200, bgcolor: 'white', borderRadius: 1.5 }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <FormControl size="small" sx={{ minWidth: 130 }}>
                                        <Select displayEmpty value={statusFilter} onChange={(e) => setStatus(e.target.value)} sx={selectSx}>
                                            <MenuItem value="">All Status</MenuItem>
                                            <MenuItem value="completed">Completed</MenuItem>
                                            <MenuItem value="pending">Pending</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl size="small" sx={{ minWidth: 140 }}>
                                        <Select displayEmpty value={typeFilter} onChange={(e) => setType(e.target.value)} sx={selectSx}>
                                            <MenuItem value="">All Types</MenuItem>
                                            <MenuItem value="Individual">Individual</MenuItem>
                                            <MenuItem value="Organization">Organization</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Stack>
                            </Box>

                            {/* Table */}
                            <TableContainer>
                                <Table size="medium">
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#f9fafb' }}>
                                            {['Date', 'Course', 'Learner / Org', 'Type', 'Amount', 'Status'].map((h) => (
                                                <TableCell key={h} sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', color: 'text.secondary', borderBottom: '2px solid', borderColor: 'divider' }}>
                                                    {h}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filtered.length > 0 ? filtered.map((row) => (
                                            <TableRow key={row.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                                <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>{row.date}</TableCell>
                                                <TableCell sx={{ fontWeight: 500 }}>{row.course}</TableCell>
                                                <TableCell>{row.learner}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={row.type}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: row.type === 'Organization' ? '#fffbeb' : '#f3f4f6',
                                                            color:   row.type === 'Organization' ? '#92400e' : '#374151',
                                                            fontWeight: 600, fontSize: '0.7rem', borderRadius: 1,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 700 }}>{formatCurrency(row.amount)}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: row.status === 'completed' ? '#f0fdf4' : '#fffbeb',
                                                            color:   row.status === 'completed' ? '#16a34a' : '#92400e',
                                                            fontWeight: 700, fontSize: '0.7rem', borderRadius: 1,
                                                        }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                                                    No transactions match your filters.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Divider />
                            <Box sx={{ px: 3, py: 2 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Showing {filtered.length} of {STATIC_TRANSACTIONS.length} transactions &mdash; static placeholder data.
                                </Typography>
                            </Box>
                        </Paper>

                    </Box>
                </Box>
            </Box>
        </>
    );
}

PaymentsIndex.layout = (page) => (
    <MentorLayout auth={page.props.auth} activeTab="Payments">
        {page}
    </MentorLayout>
);
