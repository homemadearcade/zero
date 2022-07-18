import React, { useEffect, useState } from 'react';
import Slider from '@mui/material/Slider';

export default function SliderNotched({title, value, step, options, onChangeCommitted}) {
  const [sliderValue, setSliderValue] = useState()

  useEffect(() => {
    setSliderValue(value)
  }, [])

  useEffect(() => {
    if(value !== sliderValue) {
      setSliderValue(value)
    }
  }, [value])

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

  if(sliderValue === undefined) {
    return null
  }

  return (
    <div className="SliderNotched">
      <div>{title}</div>
      <Slider
        aria-label={title}
        value={sliderValue}
        min={marks[0].value}
        max={marks[marks.length-1].value}
        marks={marks}
        step={step}
        onChange={(event, value) => {
          setSliderValue(value)
        }}
        onChangeCommitted={(event, value) => {
          onChangeCommitted(value)
        }}
        valueLabelDisplay="auto"
      />
    </div>
  );
}