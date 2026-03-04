import { Typography } from '@mui/material';

export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <Typography
            component="label"
            variant="body2"
            fontWeight={500}
            color="text.primary"
            sx={{ display: 'block', mb: 0.5 }}
            {...props}
        >
            {value ? value : children}
        </Typography>
    );
}
