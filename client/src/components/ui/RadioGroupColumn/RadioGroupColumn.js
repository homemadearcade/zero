import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function RadioGroupColumn({title, options, value, onChange}) {
  return (
    <FormControl>
      {title && <FormLabel>{title}</FormLabel>}
      <RadioGroup
        row
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