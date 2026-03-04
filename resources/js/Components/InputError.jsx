import { FormHelperText } from '@mui/material';

export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <FormHelperText error sx={{ mt: 0.5 }} {...props}>
            {message}
        </FormHelperText>
    ) : null;
}
