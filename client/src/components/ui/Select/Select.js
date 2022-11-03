import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// eslint-disable-next-line import/no-anonymous-default-export
export default function({inputLabel, options, onChange, value}) {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id={inputLabel}>{inputLabel}</InputLabel>
        <Select
          labelId={inputLabel}
          id={inputLabel}
          value={value}
          label={inputLabel}
          onChange={onChange}
        >
          {options.map(({value, label}) => {
            return <MenuItem key={value} value={value}>{label}</MenuItem>
          })}
        </Select>
      </FormControl>
    </Box>
  );
}