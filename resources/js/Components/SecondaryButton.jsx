import { Button } from '@mui/material';

export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <Button
            {...props}
            type={type}
            variant="outlined"
            disabled={disabled}
            sx={{
                textTransform: 'uppercase',
                fontWeight: 600,
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
                borderColor: 'grey.400',
                color: 'text.primary',
                '&:hover': {
                    bgcolor: 'grey.50',
                    borderColor: 'grey.500',
                },
            }}
        >
            {children}
        </Button>
    );
}
