import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import './RadioGroupColumn.scss';
import Icon from '../Icon/Icon';

export default function RadioGroupColumn({formLabel, options, value, onChange}) {
  React.useEffect(() => {
    const el = document.getElementById(formLabel)
    function handleKeyDown(e) {
        var arrowKeys = [37, 38, 39, 40];
        if (arrowKeys.indexOf(e.which) !== -1)
        {
            e.target.blur();
            e.preventDefault();
            // if (e.which == 38)
            // {
            //     var y = $(window).scrollTop();
            //     $(window).scrollTop(y - 10);
            // }
            // else if (e.which == 40)
            // {
            //     var y = $(window).scrollTop();
            //     $(window).scrollTop(y + 10);
            // }
            return false;
        }
    }

    if(el) {
      el.addEventListener('keydown', handleKeyDown);

      return () => {
        el.removeEventListener('keydown', handleKeyDown);
      }
    }

  }, [])

  return (
    <FormControl key={formLabel}>
      {formLabel && <FormLabel>{formLabel}</FormLabel>}
      <RadioGroup
        id={formLabel}
        row
        value={value}
        onChange={onChange}
      >
        {options.map(({label, value, icon}) => {
          return <FormControlLabel value={value} key={label+value} control={<Radio />} label={<>
            {icon && <div className="RadioGroupColumn__icon"><Icon icon={icon}></Icon></div>}
            {label}
          </>} />
        })}
      </RadioGroup>
    </FormControl>
  );
}