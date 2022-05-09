import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

import { openLiveEditor } from '../../store/actions/editorActions';

const CoreObjectContextMenu = ({ openLiveEditor, onMenuItemClick, editor: { editorState: { objectSelectedId } }}) => {
  
  return <div>
    <MenuItem onClick={() => {
      openLiveEditor(objectSelectedId)
      onMenuItemClick()
    }}>Edit Physics</MenuItem>
  </div>
};

const mapStateToProps = (state) => ({
  editor: state.editor
});

export default connect(mapStateToProps, {openLiveEditor })(CoreObjectContextMenu);
