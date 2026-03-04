import React from 'react';
import { router } from '@inertiajs/react';
import {
    Card,
    CardContent,
    Box,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    IconButton,
    Link,
    Button,
} from '@mui/material';
import { LayoutGrid, MoreVertical } from 'lucide-react';

const DEFAULT_COURSES = [
    { rank: '#1', title: 'Advanced Project Management', category: 'Business',     enrollees: 342, revenue: '₱6,840' },
    { rank: '#2', title: 'Digital Marketing Strategy',  category: 'Marketing',    enrollees: 285, revenue: '₱5,700' },
    { rank: '#3', title: 'Product Design Essentials',   category: 'Design',       enrollees: 210, revenue: '₱4,200' },
    { rank: '#4', title: 'Business Analytics for Leads',category: 'Data Science', enrollees: 195, revenue: '₱3,900' },
];

const headSx = {
    fontSize: '11px',
    fontWeight: 700,
    color: 'text.secondary',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    py: 1.25,
    borderBottom: '1px solid',
    borderColor: 'divider',
};

export default function TopPerformingCourses({ courses }) {
    const rows = courses ?? DEFAULT_COURSES;

    return (
        <Card
            elevation={0}
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            {/* Card header */}
            <Box
                sx={{
                    px: 2,
                    py: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LayoutGrid size={16} color="#15803d" />
                    <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                        Top Performing Courses
                    </Typography>
                </Box>
                    <Button
                        onClick={() => router.visit(route('mentor.courses.index'))}
                        sx={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#15803d',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            cursor: 'pointer',
                            '&:hover': {
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: '#15803d',
                            }
                        }}
                    >
                        View All
                    </Button>

            </Box>

            {/* Table */}
            <CardContent sx={{ p: 0, flex: 1, '&:last-child': { pb: 0 } }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ '& th': { ...headSx } }}>
                            <TableCell sx={{ pl: 3 }}>Rank</TableCell>
                            <TableCell>Course Title</TableCell>
                            <TableCell align="right">Enrollees</TableCell>
                            <TableCell align="right" sx={{ pr: 3 }}>Revenue</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((course) => (
                            <TableRow
                                key={course.rank}
                                hover
                                sx={{
                                    cursor: 'pointer',
                                    transition: 'background 0.15s',
                                    '&:last-child td': { border: 0 },
                                    '&:hover .course-title': { color: '#15803d' },
                                    '&:hover .more-btn': { opacity: 1 },
                                }}
                            >
                                <TableCell sx={{ pl: 3, fontWeight: 700, color: 'text.disabled', py: 2 }}>
                                    {course.rank}
                                </TableCell>
                                <TableCell sx={{ py: 2 }}>
                                    <Typography
                                        className="course-title"
                                        variant="body2"
                                        fontWeight={700}
                                        color="text.primary"
                                        sx={{ transition: 'color 0.15s', lineHeight: 1.2, mb: 0.25 }}
                                    >
                                        {course.title}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                        {course.category}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, color: 'text.primary', py: 2 }}>
                                    {course.enrollees}
                                </TableCell>
                                <TableCell align="right" sx={{ py: 2, pr: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                        <Typography variant="body2" fontWeight={700} color="#15803d">
                                            {course.revenue}
                                        </Typography>
                                        <IconButton
                                            className="more-btn"
                                            size="small"
                                            sx={{ opacity: 0, transition: 'opacity 0.15s', color: 'text.disabled', p: 0.5 }}
                                        >
                                            <MoreVertical size={14} />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
