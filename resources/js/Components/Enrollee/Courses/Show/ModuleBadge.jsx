import React, { memo } from 'react';
import { Stack, Typography, Tooltip } from '@mui/material';

const ModuleBadge = memo(({ icon: Icon, count, tooltip, color = 'text.disabled' }) => {
    if (!count) return null;
    return (
        <Tooltip title={tooltip} arrow>
            <Stack direction="row" alignItems="center" spacing={0.3} sx={{ flexShrink: 0 }}>
                <Icon sx={{ fontSize: 13, color }} />
                <Typography variant="caption" sx={{ color, fontWeight: 600, fontSize: '0.7rem' }}>
                    {count}
                </Typography>
            </Stack>
        </Tooltip>
    );
});

export default ModuleBadge;