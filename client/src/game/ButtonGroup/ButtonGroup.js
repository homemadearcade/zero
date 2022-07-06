import React from 'react';
import { connect } from 'react-redux';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import './ButtonGroup.scss'

const ButtonGroup = ({ onSelectOption, title, options, initialOption = 'normal' }) => {
  const [alignment, setAlignment] = React.useState(initialOption);

  const handleChange = (
    event,
    newAlignment,
  ) => {
    onSelectOption(newAlignment)
    setAlignment(newAlignment);
  };

  return (
    <div className="ButtonGroup">
      <div>{title}</div>
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChange}
      >
        {options.map((option) => {
          return <ToggleButton key={option} size="small" value={option}>{option}</ToggleButton>
        })}
      </ToggleButtonGroup>
    </div>
  );
};

const mapStateToProps = (state) => ({
  editor: state.editor
});

export default connect(mapStateToProps, { })(ButtonGroup);
