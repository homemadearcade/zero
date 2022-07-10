import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

import { openLiveWorldEditor } from '../../store/actions/editorActions';

const WorldContextMenu = ({ openLiveWorldEditor, onMenuItemClick }) => {
  return <>
    <MenuItem onClick={() => {
      openLiveWorldEditor()
      onMenuItemClick()
    }}>Edit Gravity</MenuItem>
  </>
};

const mapStateToProps = (state) => ({
  editor: state.editor
});

export default connect(mapStateToProps, { openLiveWorldEditor })( WorldContextMenu );
