import * as React from 'react';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker';

// eslint-disable-next-line import/no-anonymous-default-export
export default function({onChange, value}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CalendarPicker
        renderInput={(props) => <TextField {...props} />}
        label="CalendarPicker"
        value={dayjs(value)}
        onChange={onChange}
      />
    </LocalizationProvider>
  );
}