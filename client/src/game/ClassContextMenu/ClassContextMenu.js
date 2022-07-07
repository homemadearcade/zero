import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

import { openLiveEditor } from '../../store/actions/editorActions';

const ClassContextMenu = ({ openLiveEditor, onMenuItemClick,  editor: { editorState: { classSelectedIdContextMenu }} }) => {
  return <>
    <MenuItem onClick={() => {
      openLiveEditor(classSelectedIdContextMenu)
      onMenuItemClick()
    }}>Edit Physics</MenuItem>
  </>
};

const mapStateToProps = (state) => ({
  editor: state.editor
});

export default connect(mapStateToProps, {openLiveEditor })(ClassContextMenu);
