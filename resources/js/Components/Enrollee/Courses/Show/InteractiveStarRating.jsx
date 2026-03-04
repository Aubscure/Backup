import React, { useState, memo } from 'react';
import { Stack, Typography } from '@mui/material';
import StarRoundedIcon       from '@mui/icons-material/StarRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarHalfRoundedIcon   from '@mui/icons-material/StarHalfRounded';

const InteractiveStarRating = memo(({ value = 0, count = 0, interactive = false, size = 22, onRate }) => {
    const [hovered, setHovered] = useState(0);
    const display = hovered || value;

    return (
        <Stack direction="row" alignItems="center" spacing={0.5} flexWrap="wrap">
            <Stack direction="row" spacing={0.25}>
                {Array.from({ length: 5 }, (_, i) => {
                    const filled = display >= i + 1;
                    const half   = !filled && display >= i + 0.5;
                    const Icon   = filled ? StarRoundedIcon : half ? StarHalfRoundedIcon : StarBorderRoundedIcon;
                    return (
                        <Icon key={i}
                            sx={{
                                fontSize: size,
                                color: filled || half ? '#FFA726' : 'grey.300',
                                cursor: interactive ? 'pointer' : 'default',
                                transition: 'color 0.15s, transform 0.12s',
                                '&:hover': interactive ? { transform: 'scale(1.25)', color: '#FF9800' } : {},
                            }}
                            onMouseEnter={() => interactive && setHovered(i + 1)}
                            onMouseLeave={() => interactive && setHovered(0)}
                            onClick={() => interactive && onRate?.(i + 1)}
                        />
                    );
                })}
            </Stack>
            {value > 0 && (
                <Typography variant="body2" fontWeight={800} sx={{ color: '#E65100' }}>
                    {Number(value).toFixed(1)}
                </Typography>
            )}
            {count > 0 && (
                <Typography variant="caption" color="text.secondary">
                    ({count.toLocaleString()} {count === 1 ? 'review' : 'reviews'})
                </Typography>
            )}
        </Stack>
    );
});

export default InteractiveStarRating;