import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import './RadioGroupColumn.scss';
import Icon from '../Icon/Icon';

export default function RadioGroupColumn({formLabel, options, value, onChange}) {
  return (
    <FormControl>
      {formLabel && <FormLabel>{formLabel}</FormLabel>}
      <RadioGroup
        row
        value={value}
        onChange={onChange}
      >
        {options.map(({label, value, icon}) => {
          return <>
            <FormControlLabel value={value} key={label} control={<Radio />} label={<>
              {icon && <div className="RadioGroupColumn__icon"><Icon icon={icon}></Icon></div>}
              {label}
            </>} />
          </>
        })}
      </RadioGroup>
    </FormControl>
  );
}