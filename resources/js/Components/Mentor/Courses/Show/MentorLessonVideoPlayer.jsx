/**
 * Components/Mentor/Courses/Show/MentorLessonVideoPlayer.jsx
 * RESPONSIVE: xs/sm breakpoints added — md/lg/xl behaviour is unchanged.
 */

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';

function formatDuration(seconds) {
    if (!seconds) return 'N/A';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (!h) return `${m}m`;
    if (!m) return `${h}h`;
    return `${h}h ${m}m`;
}

export default function MentorLessonVideoPlayer({ videos = [] }) {
    const [playingVideo, setPlayingVideo] = useState(null);

    if (videos.length === 0) return null;

    return (
        <>
            {videos.map((video) => {
                console.log('video thumbnail:', video.resolved_thumbnail_url, video.thumbnail_url);

                return (
                    <Box
                        key={video.id}
                        sx={{
                            // xs/sm: reduce horizontal padding so video fills the card nicely
                            px: { xs: 2, sm: 3, md: 4 },
                            pb: { xs: 1.5, sm: 2 },
                        }}
                    >
                        {/* Title + duration row */}
                        <Box sx={{
                            mb: 1,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 1,
                        }}>
                            <Typography
                                variant="body2"
                                fontWeight={600}
                                noWrap
                                sx={{ fontSize: { xs: '0.78rem', sm: '0.875rem' } }}
                            >
                                {video.title ?? 'Video Lesson'}
                            </Typography>
                            {video.duration && (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                        fontWeight: 600,
                                        flexShrink: 0,
                                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                    }}
                                >
                                    {formatDuration(video.duration)}
                                </Typography>
                            )}
                        </Box>

                        {/* Player / thumbnail */}
                        {playingVideo === video.id ? (
                            <Box
                                sx={{
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    bgcolor: '#000',
                                    aspectRatio: '16/9',
                                }}
                            >
                                <iframe
                                    src={`https://player.vimeo.com/video/${video.vimeo_id}?autoplay=1&title=0&byline=0&portrait=0&badge=0&autopause=0`}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 'none', display: 'block' }}
                                    allow="autoplay; fullscreen; picture-in-picture"
                                    allowFullScreen
                                />
                            </Box>
                        ) : (
                            <Box
                                onClick={() => setPlayingVideo(video.id)}
                                sx={{
                                    position: 'relative',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    aspectRatio: '16/9',
                                    bgcolor: 'grey.900',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid',
                                    borderColor: 'grey.200',
                                    // xs: slightly smaller play icon via CSS hover
                                    '&:hover .play-icon': {
                                        transform: 'scale(1.15)',
                                        color: 'success.light',
                                    },
                                    '&:hover .overlay': {
                                        bgcolor: 'rgba(0,0,0,0.2)',
                                    },
                                    // xs: active state for touch feedback
                                    '&:active .play-icon': {
                                        transform: 'scale(0.95)',
                                    },
                                }}
                            >
                                {(video.resolved_thumbnail_url ?? video.thumbnail_url) ? (
                                    <Box
                                        component="img"
                                        src={video.resolved_thumbnail_url ?? video.thumbnail_url}
                                        alt={video.title ?? 'Video thumbnail'}
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            zIndex: 0,
                                        }}
                                    />
                                ) : (
                                    <Box sx={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
                                        zIndex: 0,
                                    }} />
                                )}

                                <Box
                                    className="overlay"
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        bgcolor: 'rgba(0,0,0,0.45)',
                                        transition: 'background-color 0.3s ease',
                                        zIndex: 1,
                                    }}
                                />

                                <PlayCircleOutlineRoundedIcon
                                    className="play-icon"
                                    sx={{
                                        color: 'white',
                                        // xs: slightly smaller play icon so it doesn't dominate small screens
                                        fontSize: { xs: 48, sm: 56, md: 64 },
                                        transition: 'all 0.2s ease',
                                        zIndex: 2,
                                        filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.5))',
                                    }}
                                />
                            </Box>
                        )}
                    </Box>
                );
            })}
        </>
    );
}