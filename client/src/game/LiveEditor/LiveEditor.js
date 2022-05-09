import React from 'react';
import { connect } from 'react-redux';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { editGameModel } from '../../store/actions/gameActions';

const LiveEditor = ({ editor: { editorState: { objectSelectedId } }}) => {
  const [alignment, setAlignment] = React.useState('normal');

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
      <ToggleButton value="laggard">Snail</ToggleButton>
      <ToggleButton value="slow">Slow</ToggleButton>
      <ToggleButton value="normal">Normal</ToggleButton>
      <ToggleButton value="fast">Fast</ToggleButton>
      <ToggleButton value="cheetah">Cheetah</ToggleButton>
    </ToggleButtonGroup>
  );
};

const mapStateToProps = (state) => ({
  editor: state.editor
});

export default connect(mapStateToProps, { editGameModel  })(LiveEditor);
