import React, { useEffect, useState } from 'react';
import Slider from '@mui/material/Slider';

export default function SliderNotched({title, initialValue, step, options, onChangeCommitted}) {
  const [defaultValue, setDefaultValue] = useState()

  useEffect(() => {
    setDefaultValue(initialValue)
  }, [])

  let marks = []
  if(typeof options[0] === 'number' || typeof options[0] === 'string') {
    marks = options.map((value) => {
      return {
        value,
        label: value
      }
    })
  } else {
    marks = options
  }

  function handleChangeCommited(event, value) {
    onChangeCommitted(value)
  }

  if(defaultValue === undefined) {
    return null
  }

  return (
    <div className="SliderNotched">
      <div>{title}</div>
      <Slider
        aria-label={title}
        defaultValue={defaultValue}
        min={marks[0].value}
        max={marks[marks.length-1].value}
        marks={marks}
        step={step}
        onChangeCommitted={handleChangeCommited}
        valueLabelDisplay="auto"
      />
    </div>
  );
}