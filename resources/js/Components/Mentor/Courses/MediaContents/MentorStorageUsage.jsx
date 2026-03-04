import { memo } from 'react';
import { Box, Typography, LinearProgress, Tooltip } from '@mui/material';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';

const MentorStorageUsage = memo(function MentorStorageUsage({
    totalBytes,
    maxBytes = 5 * 1024 * 1024 * 1024,
    formatBytes,
}) {
    const pct     = Math.min((totalBytes / maxBytes) * 100, 100);
    const isHigh  = pct > 80;
    const isMid   = pct > 50;
    const barColor = isHigh ? 'error.main' : isMid ? 'warning.main' : 'success.main';

    return (
        <Tooltip title={`${pct.toFixed(1)}% of 5 GB used`} placement="bottom">
            <Box
                sx={{
                    minWidth: 220,
                    p: 1.75,
                    borderRadius: 2.5,
                    border: '1px solid',
                    borderColor: isHigh ? 'error.200' : 'grey.200',
                    bgcolor: isHigh ? '#fff5f5' : 'white',
                    transition: 'border-color 0.3s, background-color 0.3s',
                    cursor: 'default',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                    <StorageRoundedIcon
                        sx={{
                            fontSize: 15,
                            color: barColor,
                            transition: 'color 0.3s',
                        }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Storage
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{ ml: 'auto', fontWeight: 700, color: barColor, transition: 'color 0.3s' }}
                    >
                        {formatBytes(totalBytes)} / 5 GB
                    </Typography>
                </Box>

                <LinearProgress
                    variant="determinate"
                    value={pct}
                    sx={{
                        height: 7,
                        borderRadius: 1,
                        bgcolor: 'grey.100',
                        '& .MuiLinearProgress-bar': {
                            bgcolor: barColor,
                            transition: 'width 0.6s ease, background-color 0.3s',
                        },
                    }}
                />
            </Box>
        </Tooltip>
    );
});

export default MentorStorageUsage;