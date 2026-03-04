import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

function getError(errors, name) {
  return errors?.[name] ?? '';
}

export default function MentorComboField({
  label,
  name,
  value,
  setData,
  options = [],
  errors = {},
  required = false,
  placeholder,
  sx,
}) {
  const errorMessage = getError(errors, name);

  const handleChange = (_, newValue) => {
    if (typeof newValue === 'string') {
      setData(name, newValue);
    } else if (newValue) {
      setData(name, newValue);
    } else {
      setData(name, '');
    }
  };

  return (
    <Autocomplete
      freeSolo
      options={options}
      value={value || null}
      onChange={handleChange}
      onInputChange={(_, newInputValue) => {
        setData(name, newInputValue ?? '');
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={Boolean(errorMessage)}
          helperText={errorMessage}
          required={required}
          sx={{ bgcolor: 'white', ...sx }}
        />
      )}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
        },
      }}
    />
  );
}
