import * as React from 'react';

import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import Box from '@mui/material/Box';

// eslint-disable-next-line import/no-anonymous-default-export
export default function ({onChange, value}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateRangePicker
          calendars={3}
          value={value}
          onChange={onChange}
          renderInput={(startProps, endProps) => (
            <React.Fragment>
              <TextField {...startProps} />
              <Box sx={{ mx: 2 }}> to </Box>
              <TextField {...endProps} />
            </React.Fragment>
          )}
        />
    </LocalizationProvider>
  );
}