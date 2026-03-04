import { Button } from '@mui/material';

export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <Button
            {...props}
            variant="contained"
            color="error"
            disabled={disabled}
            sx={{
                textTransform: 'uppercase',
                fontWeight: 600,
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
            }}
        >
            {children}
        </Button>
    );
}
