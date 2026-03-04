import React from 'react';
import { TextField, MenuItem, InputAdornment } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

export default function MentorFormField({
  label,
  name,
  value,
  setData,
  errors = {},
  type = 'text',
  placeholder,
  select = false,
  options = [],
  readOnly = false,
  startAdornment,
  endAdornment,
  multiline = false,
  rows,
  slotProps,
  ...props
}) {
  return (
    <TextField
      label={label}
      name={name}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={
        readOnly ? undefined : (e) => setData(name, e.target.value)
      }
      fullWidth
      select={select}
      multiline={multiline}
      rows={rows}
      error={!!errors[name]}
      helperText={errors[name]}
      slotProps={{
        input: { readOnly },
        ...slotProps,
      }}
      InputProps={{
        startAdornment: startAdornment ? (
          <InputAdornment position="start">
            {startAdornment}
          </InputAdornment>
        ) : undefined,
        endAdornment: readOnly ? (
          <InputAdornment position="end">
            <LockIcon color="action" />
          </InputAdornment>
        ) : endAdornment ? (
          <InputAdornment position="end">
            {endAdornment}
          </InputAdornment>
        ) : undefined,
      }}
      sx={readOnly ? { bgcolor: '#f9fafb' } : undefined}
      {...props}
    >
      {select &&
        options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
    </TextField>
  );
}
