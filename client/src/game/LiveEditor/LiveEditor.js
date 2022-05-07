import React from 'react';
import { connect } from 'react-redux';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const LiveEditor = ({ onMenuItemClick, interface: { interfaceState: { contextMenuObjectSelected } }}) => {
  const [alignment, setAlignment] = React.useState('web');

  const handleChange = (
    event,
    newAlignment,
  ) => {
    setAlignment(newAlignment);
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={alignment}
      exclusive
      onChange={handleChange}
    >
      <ToggleButton value="web">Web</ToggleButton>
      <ToggleButton value="android">Android</ToggleButton>
      <ToggleButton value="ios">iOS</ToggleButton>
    </ToggleButtonGroup>
  );
};

const mapStateToProps = (state) => ({
  interface: state.interface
});

export default connect(mapStateToProps, { })(LiveEditor);
