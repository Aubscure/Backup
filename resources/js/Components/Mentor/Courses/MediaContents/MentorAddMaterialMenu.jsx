import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

export default function MentorAddMaterialMenu({ anchorEl, onClose, onReadingMaterialClick, onVideoLessonClick }) {
    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            MenuListProps={{ onMouseLeave: onClose }}
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    minWidth: 240,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                },
            }}
        >
            <MenuItem onClick={onVideoLessonClick}>
                <ListItemIcon>
                    <PlayCircleOutlineIcon sx={{ color: '#ef4444' }} fontSize="small" />
                </ListItemIcon>
                <ListItemText
                    primary="Video Lesson"
                    secondary="MP4"
                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                />
            </MenuItem>
            <MenuItem onClick={onReadingMaterialClick}>
                <ListItemIcon>
                    <DescriptionIcon sx={{ color: '#3b82f6' }} fontSize="small" />
                </ListItemIcon>
                <ListItemText
                    primary="Reading Material"
                    secondary="PDF, PPT, DOCX"
                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                />
            </MenuItem>
            <MenuItem disabled sx={{ opacity: 0.85 }}>
                <ListItemIcon>
                    <NotificationsNoneIcon sx={{ color: '#10b981' }} fontSize="small" />
                </ListItemIcon>
                <ListItemText
                    primary="Live Session"
                    secondary="Coming Soon..."
                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                />
            </MenuItem>
        </Menu>
    );
}