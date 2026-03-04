import { Link } from '@inertiajs/react';
import { ListItemButton, ListItemText } from '@mui/material';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <ListItemButton
            component={Link}
            {...props}
            selected={active}
            sx={{
                borderLeft: '4px solid',
                borderColor: active ? 'primary.main' : 'transparent',
                bgcolor: active ? 'primary.50' : 'transparent',
                color: active ? 'primary.dark' : 'text.secondary',
                '&:hover': {
                    borderColor: active ? 'primary.dark' : 'grey.300',
                    bgcolor: active ? 'primary.100' : 'grey.50',
                },
            }}
        >
            <ListItemText
                primary={children}
                primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                }}
            />
        </ListItemButton>
    );
}
