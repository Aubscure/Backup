import React from 'react';
import { Box, Typography, Paper, Stack, Avatar, Divider, Fade } from '@mui/material';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import GroupRoundedIcon  from '@mui/icons-material/GroupRounded';
import StarRoundedIcon   from '@mui/icons-material/StarRounded';

import StatTile       from '@/Components/Enrollee/Courses/Show/StatTile';
import { stripHTML }  from '@/Components/Enrollee/Courses/Show/utils';

export default function InstructorTab({ course, mentorName, mentorInitial, totalCourses, enrolleeCount, rating }) {
    return (
        <Fade in key="instructor">
            <Box>
                <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, p: { xs: 2, sm: 3 } }}>
                    <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 2.5 }}>Meet your instructor</Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} alignItems="flex-start">
                        <Avatar src={course.user?.avatar_url} alt={mentorName}
                            sx={{ width: { xs: 72, sm: 80 }, height: { xs: 72, sm: 80 }, bgcolor: 'success.main', fontSize: '1.6rem', fontWeight: 800, flexShrink: 0, boxShadow: '0 8px 24px rgba(76,175,80,0.3)' }}>
                            {mentorInitial}
                        </Avatar>
                        <Box flex={1}>
                            <Typography variant="h6" fontWeight={800} sx={{ mb: 0.25 }}>{mentorName}</Typography>
                            {course.user?.title && (
                                <Typography variant="body2" color="success.main" fontWeight={600} sx={{ mb: 1 }}>
                                    {course.user.title}
                                </Typography>
                            )}
                            {course.user?.bio
                                ? <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.85 }}>{stripHTML(course.user.bio)}</Typography>
                                : <Typography variant="body2" color="text.disabled" fontStyle="italic">No bio provided by this instructor.</Typography>
                            }
                        </Box>
                    </Stack>

                    <Divider sx={{ my: 2.5 }} />

                    <Stack direction="row" flexWrap="wrap" gap={1}>
                        <StatTile icon={<SchoolRoundedIcon sx={{ fontSize: 20 }} />}                                      label="Total Courses" value={totalCourses || '—'} />
                        <StatTile icon={<GroupRoundedIcon  sx={{ fontSize: 20 }} />}                                      label="Students"      value={enrolleeCount != null ? Number(enrolleeCount).toLocaleString() : '—'} />
                        <StatTile icon={<StarRoundedIcon   sx={{ fontSize: 20, color: '#FFA726 !important' }} />}         label="Rating"        value={rating > 0 ? `${Number(rating).toFixed(1)} / 5` : '—'} />
                    </Stack>
                </Paper>
            </Box>
        </Fade>
    );
}