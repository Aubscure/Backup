import React from 'react';
import {
    Box, InputAdornment, TextField, Select, MenuItem,
    FormControl, InputLabel, Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function EnrolleeFilters({
    search,         onSearchChange,
    statusFilter,   onStatusChange,
    courseFilter,   onCourseChange,
    sourceFilter,   onSourceChange,
    planFilter,     onPlanChange,
    courses = [],
}) {
    return (
        <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ sm: 'center' }}
            flexWrap="wrap"
            useFlexGap
        >
            {/* Search */}
            <TextField
                placeholder="Search by name or email…"
                size="small"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                sx={{
                    flexGrow: 1,
                    minWidth: 220,
                    '& .MuiOutlinedInput-root': { borderRadius: 2.5 },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                        </InputAdornment>
                    ),
                }}
            />

            {/* Status */}
            <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Status</InputLabel>
                <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => onStatusChange(e.target.value)}
                    sx={{ borderRadius: 2.5 }}
                >
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="ongoing">Ongoing</MenuItem>
                    <MenuItem value="graduate">Graduate</MenuItem>
                </Select>
            </FormControl>

            {/* Course */}
            <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Course</InputLabel>
                <Select
                    value={courseFilter}
                    label="Course"
                    onChange={(e) => onCourseChange(e.target.value)}
                    sx={{ borderRadius: 2.5 }}
                >
                    <MenuItem value="">All Courses</MenuItem>
                    {courses.map((c) => (
                        <MenuItem key={c} value={c}>{c}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Plan */}
            <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Plan</InputLabel>
                <Select
                    value={planFilter}
                    label="Plan"
                    onChange={(e) => onPlanChange(e.target.value)}
                    sx={{ borderRadius: 2.5 }}
                >
                    <MenuItem value="">All Plans</MenuItem>
                    <MenuItem value="Individual">Individual</MenuItem>
                    <MenuItem value="Organization">Organization</MenuItem>
                </Select>
            </FormControl>
        </Stack>
    );
}