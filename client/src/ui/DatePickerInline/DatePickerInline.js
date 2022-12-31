import * as React from 'react';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

const isWeekend = (date) => {
  const day = date.day();

  return day === 0 || day === 6;
};

        // shouldDisableDate={isWeekend}

function div() {
  return <div></div>
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function({ onChange, value, disablePast }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker
        components={{
          ActionBar: div
        }}
        disablePast={disablePast}
        orientation="landscape"
        openTo="day"
        value={dayjs(value)}
        onChange={onChange}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}