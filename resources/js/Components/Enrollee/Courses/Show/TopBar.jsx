import React, { memo } from 'react';
import { Paper, Box, IconButton, InputBase, Stack, Typography } from '@mui/material';
import SearchIcon            from '@mui/icons-material/Search';
import MenuIcon              from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const TopBar = memo(({ onMenuToggle }) => (
    <Paper square elevation={0} sx={{
        borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'white',
        position: 'sticky', top: 0, zIndex: 1100,
    }}>
        <Box sx={{
            display: 'flex', height: 60, alignItems: 'center',
            justifyContent: 'space-between', px: { xs: 2, sm: 3, lg: 4 },
        }}>
            <IconButton edge="start" onClick={onMenuToggle}
                sx={{ mr: 1.5, display: { md: 'none' }, color: 'text.secondary' }}>
                <MenuIcon />
            </IconButton>
            <Box sx={{
                display: 'flex', alignItems: 'center', bgcolor: 'grey.50',
                border: '1px solid', borderColor: 'grey.200', borderRadius: 50,
                px: 2, py: 0.6, width: { xs: '100%', sm: 300 },
                maxWidth: { xs: 'calc(100% - 100px)', sm: 300 },
                transition: 'box-shadow 0.2s, border-color 0.2s',
                '&:focus-within': { boxShadow: '0 0 0 3px rgba(76,175,80,0.12)', borderColor: 'success.light' },
            }}>
                <SearchIcon sx={{ color: 'grey.400', mr: 1, fontSize: 18 }} />
                <InputBase placeholder="Search skills, mentors, topics…"
                    sx={{ fontSize: '0.8rem', flex: 1, '& input': { py: 0 } }} />
            </Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: 'auto', flexShrink: 0, pl: 2 }}>
                <Typography variant="body2" fontWeight={600}
                    sx={{ color: 'text.secondary', display: { xs: 'none', md: 'block' } }}>
                    ManPro Learning Hub
                </Typography>
                <IconButton size="small" sx={{ color: 'grey.500' }}>
                    <NotificationsNoneIcon fontSize="small" />
                </IconButton>
            </Stack>
        </Box>
    </Paper>
));

export default TopBar;