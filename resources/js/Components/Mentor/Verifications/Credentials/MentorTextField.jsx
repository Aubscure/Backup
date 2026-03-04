import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

function getError(errors, name) {
  return errors?.[name] ?? '';
}

export default function MentorTextField({
  label,
  name,
  value,
  setData,
  errors = {},
  type = 'text',
  placeholder,
  required = false,
  readOnly = false,
  startAdornment,
  endAdornment,
  multiline = false,
  rows,
  slotProps = {},
  sx,
  ...props
}) {
  const errorMessage = getError(errors, name);

  const handleChange = (e) => {
    if (!readOnly && setData) {
      setData(name, e.target.value);
    }
  };

  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      type={type}
      value={value ?? ''}
      placeholder={placeholder}
      required={required}
      multiline={multiline}
      rows={rows}
      error={Boolean(errorMessage)}
      helperText={errorMessage}
      onChange={handleChange}
      slotProps={{
        ...slotProps,
        input: {
          ...(slotProps.input || {}),
          readOnly,
        },
      }}
      InputProps={{
        ...(startAdornment && {
          startAdornment: (
            <InputAdornment position="start">
              {startAdornment}
            </InputAdornment>
          ),
        }),
        ...(readOnly
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
            }
          : endAdornment && {
              endAdornment: (
                <InputAdornment position="end">
                  {endAdornment}
                </InputAdornment>
              ),
            }),
      }}
      sx={{
        bgcolor: readOnly ? '#f9fafb' : 'white',
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
        },
        ...sx,
      }}
      {...props}
    />
  );
}
