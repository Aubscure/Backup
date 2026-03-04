import React, { memo } from 'react';
import { Box, Typography, Paper, Stack, Chip, Avatar, Tooltip } from '@mui/material';

import PersonOutlineRoundedIcon  from '@mui/icons-material/PersonOutlineRounded';
import BusinessRoundedIcon       from '@mui/icons-material/BusinessRounded';
import CheckCircleIcon           from '@mui/icons-material/CheckCircle';
import AccessTimeRoundedIcon     from '@mui/icons-material/AccessTimeRounded';
import GroupRoundedIcon          from '@mui/icons-material/GroupRounded';
import SchoolRoundedIcon         from '@mui/icons-material/SchoolRounded';
import QuizRoundedIcon           from '@mui/icons-material/QuizRounded';
import FolderOpenRoundedIcon     from '@mui/icons-material/FolderOpenRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';

import InteractiveStarRating from './InteractiveStarRating';
import StatTile              from './StatTile';
import { EASE, EASE_SPRING, formatCurrency } from './utils';

// ── Local PlanCard Component ──────────────────────────────────────────────────
const PlanCard = memo(({ plan, isFree }) => {
    const free    = isFree || !plan.price || parseFloat(plan.price) === 0;
    const isOrg   = plan.type === 'organization';
    const Icon    = isOrg ? BusinessRoundedIcon : PersonOutlineRoundedIcon;
    const color   = isOrg ? '#5c6bc0' : '#2e7d32';
    const bgColor = isOrg ? '#e8eaf6' : '#e8f5e9';

    return (
        <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            p: { xs: 1.25, sm: 1.5 }, borderRadius: 3,
            border: '1px solid', borderColor: 'grey.100', bgcolor: 'background.paper',
            transition: `all 280ms ${EASE}`, gap: 1,
            '&:hover': {
                borderColor: color, transform: 'translateX(4px)',
                boxShadow: `0 4px 20px -5px ${color}33`,
                '& .plan-avatar': { transform: 'scale(1.1)' },
            },
        }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
                <Avatar className="plan-avatar"
                    sx={{ bgcolor: bgColor, width: { xs: 34, sm: 38 }, height: { xs: 34, sm: 38 }, flexShrink: 0, transition: `transform 300ms ${EASE_SPRING}` }}>
                    <Icon sx={{ color, fontSize: { xs: 18, sm: 20 } }} />
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={700} noWrap sx={{ fontSize: { xs: '0.78rem', sm: '0.875rem' } }}>
                        {isOrg ? 'Organization' : 'Individual'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>
                        {plan.access_duration_label || 'Lifetime Access'}
                    </Typography>
                </Box>
            </Stack>
            <Typography fontWeight={800} sx={{ flexShrink: 0, color: free ? 'success.main' : 'text.primary', fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                {free ? 'FREE' : formatCurrency(parseFloat(plan.price))}
            </Typography>
        </Box>
    );
});

// ── Exported CourseHero Component ─────────────────────────────────────────────
export default function CourseHero({ 
    course, category, hasAccess, isFree, mentorName, mentorInitial, 
    userRating, rating, reviewCount, durationLabel, totalModules, 
    totalLessons, totalFiles, totalVideos, totalAssessments, enrolleeCount, 
    hasCertificate, plans, CtaButton 
}) {
    return (
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'grey.100', borderRadius: 4, overflow: 'hidden', mb: 4, boxShadow: '0 20px 60px -12px rgba(0,0,0,0.08)' }}>
            
            {/* Thumbnail & Badges */}
            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                {course.course_thumbnail_url ? (
                    <>
                        <Box component="img" src={course.course_thumbnail_url} alt={course.title}
                            sx={{ width: '100%', height: { xs: 180, sm: 240, md: 320 }, objectFit: 'cover', display: 'block', transition: `transform 1.4s ${EASE}`, '&:hover': { transform: 'scale(1.04)' } }} />
                        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.55) 100%)' }} />
                    </>
                ) : (
                    <Box sx={{ height: { xs: 180, sm: 240, md: 320 }, background: 'linear-gradient(135deg, #1b5e20 0%, #388e3c 50%, #66bb6a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <SchoolRoundedIcon sx={{ fontSize: 72, color: 'rgba(255,255,255,0.3)' }} />
                    </Box>
                )}
                
                {category && (
                    <Chip 
                        label={category.toUpperCase()} size="small"
                        sx={{ 
                            position: 'absolute', top: { xs: 12, sm: 18 }, left: { xs: 12, sm: 18 }, zIndex: 2,
                            bgcolor: 'rgba(255, 255, 255, 0.58)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(44px)',
                            border: '2px solid rgba(255, 255, 255, 0)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            color: '#111827', fontWeight: 700, fontSize: { xs: '0.6rem', sm: '0.65rem' }, 
                            letterSpacing: '0.5px', height: 24 
                        }} 
                    />
                )}
                
                {hasAccess && (
                    <Chip 
                        icon={<CheckCircleIcon sx={{ fontSize: '14px !important', color: '#156534 !important' }} />} 
                        label="ENROLLED" size="small"
                        sx={{ 
                            position: 'absolute', top: { xs: 12, sm: 18 }, right: { xs: 12, sm: 18 }, zIndex: 2,
                            bgcolor: 'rgba(255, 255, 255, 0.58)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(44px)',
                            border: '2px solid rgba(255, 255, 255, 0)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            color: '#111827', fontWeight: 700, fontSize: { xs: '0.6rem', sm: '0.65rem' }, 
                            letterSpacing: '0.5px', height: 24 
                        }} 
                    />
                )}
            </Box>

            <Box sx={{ p: { xs: 2, sm: 2.5, md: 3, lg: 3.5 } }}>
                
                {/* Title & Instructor */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'flex-start' }, gap: 2, mb: 2.5 }}>
                    <Box sx={{ flex: 1, pr: { md: 2 } }}>
                        <Typography variant="h4" fontWeight={800} sx={{ mb: 1, lineHeight: 1.15, letterSpacing: '-0.02em', fontSize: { xs: '1.35rem', sm: '1.7rem', md: '2.1rem' } }}>
                            {course.title}
                        </Typography>
                        <Box>
                            <InteractiveStarRating value={userRating || rating} count={reviewCount} size={20} />
                        </Box>
                    </Box>

                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flexShrink: 0, bgcolor: 'rgba(0,0,0,0.02)', p: 0.75, pr: 2.5, borderRadius: 50, border: '1px solid', borderColor: 'grey.100' }}>
                        <Avatar src={course.user?.avatar_url} alt={mentorName} sx={{ width: 36, height: 36, bgcolor: 'success.main', fontSize: '0.85rem', fontWeight: 700 }}>
                            {mentorInitial}
                        </Avatar>
                        <Box>
                            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', lineHeight: 1, fontSize: '0.65rem', mb: 0.25 }}>Instructor</Typography>
                            <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.85rem', lineHeight: 1 }}>{mentorName}</Typography>
                        </Box>
                    </Stack>
                </Box>

                {/* Stat Tiles */}
                <Stack direction="row" spacing={{ xs: 0.75, sm: 1 }} flexWrap="nowrap" sx={{ overflowX: 'auto', py: 0.5, pb: 1 }}>
                    {durationLabel !== '-' && (
                        <Tooltip title={`This course is good for ${durationLabel}`} placement="top"> 
                            <StatTile icon={<AccessTimeRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />} label="Duration" value={durationLabel} />
                        </Tooltip>
                    )}
                    {totalLessons > 0 && (
                        <StatTile 
                            icon={<SchoolRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}  
                            label="Curriculum"   
                            value={
                                <>
                                    <span style={{ fontWeight: 800 }}>{totalModules}</span> <span style={{ fontWeight: 400 }}>Modules</span><br />
                                    <span style={{ fontWeight: 800 }}>{totalLessons}</span> <span style={{ fontWeight: 400 }}>Lessons</span>
                                </>
                            } 
                        />
                    )}
                    {(totalFiles > 0 || totalVideos > 0) && (
                        <StatTile 
                            icon={<FolderOpenRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}  
                            label="Resources"        
                            value={
                                <>
                                    <span style={{ fontWeight: 800 }}>{totalFiles}</span> <span style={{ fontWeight: 400 }}>Files</span><br />
                                    <span style={{ fontWeight: 800 }}>{totalVideos}</span> <span style={{ fontWeight: 400 }}>Videos</span>
                                </>
                            } 
                        />
                    )}
                    {totalAssessments > 0  && <StatTile icon={<QuizRoundedIcon       sx={{ fontSize: { xs: 18, sm: 20 }, color: '#307d31 !important' }} />} label="Quizzes"      value={totalAssessments} />}
                    {enrolleeCount != null && <StatTile icon={<GroupRoundedIcon       sx={{ fontSize: { xs: 18, sm: 20 } }} />} label="Students"     value={Number(enrolleeCount).toLocaleString()} />}
                    {hasCertificate        && <StatTile icon={<WorkspacePremiumRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}    label="Certificate"  value="After completion" />}
                </Stack>

                {/* Plans and CTA */}
                <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'grey.100', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: { xs: 'stretch', md: 'center' }, justifyContent: 'space-between' }}>
                    <Box sx={{ flex: 1 }}>
                        {plans.length > 0 ? (
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                                {plans.map((p) => <Box key={p.id || p.type} sx={{ flex: 1 }}><PlanCard plan={p} isFree={isFree} /></Box>)}
                            </Stack>
                        ) : isFree ? (
                            <Box sx={{ display: 'inline-flex' }}>
                                <Chip label="FREE COURSE" sx={{ bgcolor: 'success.50', color: 'success.dark', fontWeight: 800, letterSpacing: 0.5, px: 2, py: 2.5, fontSize: '1rem', borderRadius: 2 }} />
                            </Box>
                        ) : null}
                    </Box>
                    <Box sx={{ width: { xs: '100%', md: 'auto' }, minWidth: { md: 240 } }}>
                        {CtaButton}
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
}