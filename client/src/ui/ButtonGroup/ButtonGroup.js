import React from 'react';
import { connect } from 'react-redux';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import './ButtonGroup.scss'

const ButtonGroup = ({ onSelectOption, value, formLabel, options, orientation}) => {
  // const [alignment, setAlignment] = React.useState(initialOption);

  // const handleChange = (
  //   event,
  //   newAlignment,
  // ) => {
  //   onSelectOption(newAlignment)
  //   setAlignment(newAlignment);
  // };

  return (
    <div className="ButtonGroup">
      {formLabel && <div>{formLabel}</div>}
      <ToggleButtonGroup
        color="primary"
        value={value}
        orientation={orientation}
        exclusive
        onChange={onSelectOption}
      >
        {options.map(({value, icon}) => {
          return <ToggleButton key={value} size="small" value={value}>{icon}</ToggleButton>
        })}
      </ToggleButtonGroup>
    </div>
  );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { })(ButtonGroup);
