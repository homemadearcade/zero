import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function RadioGroupColumn({title, options, value, onChange}) {
  return (
    <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">{title}</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={value}
        onChange={onChange}
      >
        {options.map(({label, value}) => {
          return <FormControlLabel value={value} key={label} control={<Radio />} label={label} />
        })}
      </RadioGroup>
    </FormControl>
  );
}