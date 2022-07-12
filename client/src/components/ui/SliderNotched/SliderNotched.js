import React, { useEffect, useState } from 'react';
import Slider from '@mui/material/Slider';

export default function SliderNotched({title, initialValue, options, onChangeCommitted}) {
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

  if(!defaultValue) {
    return null
  }

  return (
    <div className="SliderNotched">
      <div>{title}</div>
      <Slider
        aria-label={title}
        defaultValue={defaultValue}
        valueLabelDisplay="auto"
        onChangeCommitted={handleChangeCommited}
        marks={marks}
      />
    </div>
  );
}