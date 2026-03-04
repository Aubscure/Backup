import { Button } from '@mui/material';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <Button
            {...props}
            variant="contained"
            color="primary"
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
