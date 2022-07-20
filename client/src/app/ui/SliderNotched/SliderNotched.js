import React, { useEffect, useState } from 'react';
import Slider from '@mui/material/Slider';
import FormLabel from '../FormLabel/FormLabel';

export default function SliderNotched({formLabel, restricted, value, step, options, onChangeCommitted}) {
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
        // label: value
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
      {formLabel && <FormLabel>{formLabel}</FormLabel>}
      <Slider
        aria-label={formLabel}
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