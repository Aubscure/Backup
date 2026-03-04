import { Link } from '@inertiajs/react';
import { Box } from '@mui/material';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Box
            component={Link}
            {...props}
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                borderBottom: '2px solid',
                borderColor: active ? 'primary.main' : 'transparent',
                px: 0.5,
                pt: 0.5,
                fontSize: '0.875rem',
                fontWeight: 500,
                color: active ? 'text.primary' : 'text.secondary',
                textDecoration: 'none',
                transition: 'all 150ms ease-in-out',
                '&:hover': {
                    borderColor: active ? 'primary.dark' : 'grey.400',
                    color: active ? 'text.primary' : 'text.primary',
                },
            }}
        >
            {children}
        </Box>
    );
}
