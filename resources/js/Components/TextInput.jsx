import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { TextField } from '@mui/material';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, label, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <TextField
            {...props}
            type={type}
            label={label}
            inputRef={localRef}
            variant="outlined"
            size="small"
            fullWidth
        />
    );
});
