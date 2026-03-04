import { memo, useState } from 'react';
import { Box, Typography, IconButton, Tooltip, Fade } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';

const MentorMaterialItem = memo(function MentorMaterialItem({
    material,
    subtitle,
    onDelete,
    formatBytes,
}) {
    const [hovered, setHovered] = useState(false);
    const isVideo = material.type === 'video';

    return (
        <Fade in timeout={300}>
            <Box
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.75,
                    bgcolor: hovered ? (isVideo ? '#fff5f5' : '#f0f7ff') : 'grey.50',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: hovered
                        ? (isVideo ? '#ffcdd2' : '#bbdefb')
                        : 'transparent',
                    transition: 'all 0.2s ease',
                    transform: hovered ? 'translateX(3px)' : 'translateX(0)',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, flex: 1, minWidth: 0 }}>
                    <Box
                        sx={{
                            width: 38,
                            height: 38,
                            borderRadius: 2,
                            flexShrink: 0,
                            bgcolor: isVideo ? '#ffebee' : '#e3f2fd',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'transform 0.2s',
                            transform: hovered ? 'scale(1.1)' : 'scale(1)',
                        }}
                    >
                        {isVideo
                            ? <PlayCircleOutlineIcon sx={{ color: '#e53935', fontSize: 20 }} />
                            : <DescriptionIcon       sx={{ color: '#1e88e5', fontSize: 20 }} />
                        }
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="body2"
                            fontWeight={600}
                            noWrap
                            sx={{ color: hovered ? (isVideo ? '#c62828' : '#1565c0') : 'text.primary', transition: 'color 0.2s' }}
                        >
                            {material.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {subtitle ?? (isVideo ? 'Video' : 'File')}
                            {material.size_bytes ? ` • ${formatBytes(material.size_bytes)}` : ''}
                        </Typography>
                    </Box>
                </Box>

                <Tooltip title="Remove">
                    <IconButton
                        size="small"
                        onClick={() => onDelete(material.id)}
                        sx={{
                            ml: 1,
                            flexShrink: 0,
                            color: 'error.main',
                            opacity: hovered ? 1 : 0.25,
                            transition: 'opacity 0.2s, transform 0.2s',
                            '&:hover': { bgcolor: 'error.50', transform: 'scale(1.2)' },
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        </Fade>
    );
});

export default MentorMaterialItem;