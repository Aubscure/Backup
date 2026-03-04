import React from 'react';
import { Box, Typography, Paper, Stack, Button, Divider, LinearProgress, Fade } from '@mui/material';
import StarRoundedIcon       from '@mui/icons-material/StarRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import CheckCircleIcon       from '@mui/icons-material/CheckCircle';
import RateReviewRoundedIcon from '@mui/icons-material/RateReviewRounded';

import InteractiveStarRating from '@/Components/Enrollee/Courses/Show/InteractiveStarRating';
import { EASE, EASE_SPRING } from '@/Components/Enrollee/Courses/Show/utils';

export default function ReviewsTab({
    rating, reviewCount, hasAccess,
    userRating, setUserRating,
    ratingHover, setRatingHover,
    reviewSubmitted, onSubmitReview,
}) {
    return (
        <Fade in key="reviews">
            <Box>
                {/* ── Rating summary ────────────────────────────────────── */}
                <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, p: { xs: 2, sm: 3 }, mb: 2.5 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                        <Box sx={{ textAlign: 'center', flexShrink: 0 }}>
                            <Typography sx={{ fontSize: { xs: '3.5rem', sm: '4rem' }, fontWeight: 900, color: '#E65100', lineHeight: 1 }}>
                                {rating > 0 ? Number(rating).toFixed(1) : '—'}
                            </Typography>
                            <InteractiveStarRating value={rating} size={18} />
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25, display: 'block' }}>
                                {reviewCount.toLocaleString()} {reviewCount === 1 ? 'review' : 'reviews'}
                            </Typography>
                        </Box>

                        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />

                        <Box flex={1} sx={{ width: '100%' }}>
                            {[5, 4, 3, 2, 1].map((star) => (
                                <Stack key={star} direction="row" alignItems="center" spacing={1} sx={{ mb: 0.75 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ minWidth: 8, fontWeight: 600 }}>{star}</Typography>
                                    <StarRoundedIcon sx={{ fontSize: 14, color: '#FFA726', flexShrink: 0 }} />
                                    <LinearProgress
                                        variant="determinate"
                                        value={rating > 0 && star === Math.round(rating) ? 70 : star > Math.round(rating) ? 10 : 20}
                                        sx={{ flex: 1, height: 7, borderRadius: 4, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { bgcolor: '#FFA726', borderRadius: 4 } }}
                                    />
                                </Stack>
                            ))}
                        </Box>
                    </Stack>
                </Paper>

                {/* ── Leave a rating — enrolled only ────────────────────── */}
                {hasAccess && !reviewSubmitted && (
                    <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, p: { xs: 2, sm: 3 }, mb: 2.5 }}>
                        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 2 }}>
                            <RateReviewRoundedIcon sx={{ fontSize: 20, color: 'success.main' }} />
                            <Typography variant="subtitle2" fontWeight={800}>Leave a review</Typography>
                        </Stack>

                        <Stack direction="row" spacing={0.5} sx={{ mb: 1.5 }}>
                            {[1, 2, 3, 4, 5].map((star) => {
                                const active = (ratingHover || userRating) >= star;
                                return (
                                    <Box key={star}
                                        onMouseEnter={() => setRatingHover(star)}
                                        onMouseLeave={() => setRatingHover(0)}
                                        onClick={() => setUserRating(star)}
                                        sx={{ cursor: 'pointer' }}>
                                        <StarRoundedIcon sx={{
                                            fontSize: { xs: 32, sm: 38 },
                                            color: active ? '#FFA726' : 'grey.300',
                                            transition: `color 120ms ${EASE}, transform 120ms ${EASE_SPRING}`,
                                            transform: active ? 'scale(1.2)' : 'scale(1)',
                                        }} />
                                    </Box>
                                );
                            })}
                        </Stack>

                        {userRating > 0 && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                                {['', 'Terrible', 'Poor', 'Average', 'Good', 'Excellent'][userRating]}
                            </Typography>
                        )}

                        <Button variant="contained" onClick={onSubmitReview} disabled={!userRating}
                            sx={{ bgcolor: 'success.main', textTransform: 'none', fontWeight: 700, borderRadius: 2, px: 3, '&:hover': { bgcolor: 'success.dark' }, '&:disabled': { bgcolor: 'grey.200', color: 'text.disabled' } }}>
                            Submit Rating
                        </Button>
                    </Paper>
                )}

                {/* ── Submitted confirmation ────────────────────────────── */}
                {reviewSubmitted && (
                    <Paper elevation={0} sx={{ borderRadius: 3, p: 2.5, mb: 2.5, bgcolor: 'success.50', border: '1px solid #c8e6c9' }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <CheckCircleIcon sx={{ color: 'success.main', fontSize: 24 }} />
                            <Box>
                                <Typography variant="body2" fontWeight={700} color="success.dark">Review submitted!</Typography>
                                <Typography variant="caption" color="text.secondary">Thank you for your feedback. It helps other learners.</Typography>
                            </Box>
                        </Stack>
                    </Paper>
                )}

                {/* ── Empty state ───────────────────────────────────────── */}
                {reviewCount === 0 && (
                    <Paper elevation={0} variant="outlined" sx={{ p: 5, borderRadius: 3, textAlign: 'center' }}>
                        <StarBorderRoundedIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>No reviews yet.</Typography>
                        <Typography variant="caption" color="text.disabled">
                            {hasAccess ? 'Be the first to leave a review above.' : 'Enroll to leave the first review.'}
                        </Typography>
                    </Paper>
                )}
            </Box>
        </Fade>
    );
}