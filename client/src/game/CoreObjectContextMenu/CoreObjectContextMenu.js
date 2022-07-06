import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

import { openLiveEditor } from '../../store/actions/editorActions';

const CoreObjectContextMenu = ({ openLiveEditor, onMenuItemClick, editor: { editorState: { objectSelectedIdContextMenu } }}) => {
  
  return <div>
    <MenuItem onClick={() => {
      openLiveEditor(objectSelectedIdContextMenu)
      onMenuItemClick()
    }}>Edit Physics</MenuItem>
  </div>
};

const mapStateToProps = (state) => ({
  editor: state.editor
});

export default connect(mapStateToProps, {openLiveEditor })(CoreObjectContextMenu);
