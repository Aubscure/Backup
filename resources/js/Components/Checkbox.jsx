import { Checkbox as MuiCheckbox } from '@mui/material';

export default function Checkbox({ className = '', ...props }) {
    return (
        <MuiCheckbox
            {...props}
            size="small"
            sx={{
                color: 'primary.main',
                '&.Mui-checked': {
                    color: 'primary.main',
                },
            }}
        />
    );
}
