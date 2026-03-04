import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Box, Typography, Paper, Stack, Divider, Chip, keyframes,
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

// ─── Layout Components ───────────────────────────────────────────────────────
import MentorLayout from '@/Layouts/MentorLayout';

// ─── Enrollee-specific Components ───────────────────────────────────────────
import EnrolleeStatsCards  from '@/Components/Mentor/Enrollees/EnrolleeStatCards';
import EnrolleeFilters     from '@/Components/Mentor/Enrollees/EnrolleeFilters';
import EnrolleeTable       from '@/Components/Mentor/Enrollees/EnrolleeTable';
import EnrolleePagination  from '@/Components/Mentor/Enrollees/EnrolleePagination';
import { STATIC_ENROLLEES, STATIC_STATS } from '@/Components/Mentor/Enrollees/enrolleeData';

// ─── Animation ───────────────────────────────────────────────────────────────
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const PER_PAGE = 10;

/**
 * Enrollees/Index
 *
 * Props (all optional — falls back to static seed data until the backend is wired up):
 *   enrollees  – array of enrollee objects
 *   stats      – { total_enrollees, active_enrollments, completion_rate, issued_certificates }
 *   pagination – { current_page, last_page, per_page, total }
 *   filters    – { search, status, course, source, plan }
 *   auth       – Inertia shared auth prop
 */
export default function EnrolleesIndex({
    auth,
    enrollees  = STATIC_ENROLLEES,
    stats      = STATIC_STATS,
    pagination = null,
    filters    = {},
}) {
    // ── Client-side state (used while no server pagination) ──────────────────
    const [search,        setSearch]        = useState(filters.search  ?? '');
    const [statusFilter,  setStatusFilter]  = useState(filters.status  ?? '');
    const [courseFilter,  setCourseFilter]  = useState(filters.course  ?? '');
    const [sourceFilter,  setSourceFilter]  = useState(filters.source  ?? '');
    const [planFilter,    setPlanFilter]    = useState(filters.plan    ?? '');
    const [page,          setPage]          = useState(1);

    // Derive unique course list from data
    const courses = useMemo(
        () => [...new Set(enrollees.map((e) => e.enrolled_course))].sort(),
        [enrollees],
    );

    // Client-side filtering (replace with Inertia router.get when backend ready)
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return enrollees.filter((e) => {
            const fullName = `${e.firstname} ${e.lastname}`.toLowerCase();
            const matchSearch  = !q || fullName.includes(q) || e.email.toLowerCase().includes(q);
            const matchStatus  = !statusFilter || e.enrollment_status === statusFilter;
            const matchCourse  = !courseFilter || e.enrolled_course === courseFilter;
            const matchSource  = !sourceFilter || e.source === sourceFilter;
            const matchPlan    = !planFilter   || e.course_plan === planFilter;
            return matchSearch && matchStatus && matchCourse && matchSource && matchPlan;
        });
    }, [enrollees, search, statusFilter, courseFilter, sourceFilter, planFilter]);

    // If server pagination is provided, skip client paging
    const useServerPaging = !!pagination;
    const totalCount  = useServerPaging ? pagination.total     : filtered.length;
    const totalPages  = useServerPaging ? pagination.last_page : Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const currentPage = useServerPaging ? pagination.current_page : page;

    const displayedRows = useServerPaging
        ? enrollees
        : filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handlePageChange = (p) => {
        if (useServerPaging) {
            // TODO: router.get(route('enrollees.index'), { ...filters, page: p }, { preserveState: true });
        } else {
            setPage(p);
        }
    };

    // Reset to page 1 when filters change
    const handleFilterChange = (setter) => (val) => {
        setter(val);
        setPage(1);
    };

    const handleRowClick = (enrollee) => {
        router.visit(route('enrollee.show', { id: enrollee.id }));
    };

    return (
        <>
            <Head title="Enrollees" />

            <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f8' }}>

                {/* Main Content */}
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

                    <Box
                        component="main"
                        sx={{
                            p: { xs: 2, md: 4 },
                        }}
                    >
                        {/* ── Page Header ──────────────────────────────────── */}
                        <Box sx={{ animation: `${fadeInUp} 0.4s ease-out both` }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1} mb={0.5}>
                                <Box>
                                    <Typography variant="h4" fontWeight={700} sx={{ color: '#111827' }}>
                                        Enrolled Students
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
                                        Manage and track student progress across your training courses.
                                    </Typography>
                                </Box>

                                {/* Live badge */}
                                <Chip
                                    icon={
                                        <FiberManualRecordIcon
                                            sx={{ fontSize: '10px !important', color: '#16a34a !important', animation: 'pulse 2s infinite' }}
                                        />
                                    }
                                    label="LIVE UPDATES ACTIVE"
                                    size="small"
                                    sx={{
                                        bgcolor: '#f0fdf4',
                                        color: '#16a34a',
                                        fontWeight: 700,
                                        fontSize: '0.65rem',
                                        letterSpacing: '0.06em',
                                        border: '1px solid #bbf7d0',
                                        borderRadius: 1.5,
                                        height: 26,
                                        alignSelf: 'flex-start',
                                        mt: 0.5,
                                        '@keyframes pulse': {
                                            '0%, 100%': { opacity: 1 },
                                            '50%': { opacity: 0.4 },
                                        },
                                    }}
                                />
                            </Stack>
                        </Box>

                        {/* ── Stat Cards ───────────────────────────────────── */}
                        <Box sx={{ mt: 3, animation: `${fadeInUp} 0.45s ease-out both`, animationDelay: '0.05s' }}>
                            <EnrolleeStatsCards stats={stats} />
                        </Box>

                        {/* ── Table Card ───────────────────────────────────── */}
                        <Paper
                            elevation={0}
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 3,
                                overflow: 'hidden',
                                animation: `${fadeInUp} 0.5s ease-out both`,
                                animationDelay: '0.1s',
                                
                            }}
                        >
                            {/* Filters */}
                            <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                                <EnrolleeFilters
                                    search={search}               onSearchChange={handleFilterChange(setSearch)}
                                    statusFilter={statusFilter}   onStatusChange={handleFilterChange(setStatusFilter)}
                                    courseFilter={courseFilter}   onCourseChange={handleFilterChange(setCourseFilter)}
                                    sourceFilter={sourceFilter}   onSourceChange={handleFilterChange(setSourceFilter)}
                                    planFilter={planFilter}       onPlanChange={handleFilterChange(setPlanFilter)}
                                    courses={courses}
                                />
                            </Box>

                            {/* Table */}
                            <Box sx={{ px: { xs: 1, sm: 2 },}}>
                                <EnrolleeTable
                                enrollees={displayedRows}
                                onRowClick={handleRowClick} 
                                />
                            </Box>

                            {/* Pagination */}
                            {totalCount > 0 && (
                                <>
                                    <Divider />
                                    <Box sx={{ px: 3, py: 2 }}>
                                        <EnrolleePagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            totalCount={totalCount}
                                            perPage={useServerPaging ? pagination.per_page : PER_PAGE}
                                            onPageChange={handlePageChange}
                                        />
                                    </Box>
                                </>
                            )}
                        </Paper>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

EnrolleesIndex.layout = (page) => (
    <MentorLayout auth={page.props.auth} activeTab="Enrollees">
        {page}
    </MentorLayout>
);