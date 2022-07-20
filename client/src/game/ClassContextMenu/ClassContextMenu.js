import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

import { openLivePhysicsEditor } from '../../store/actions/editorActions';

const ClassContextMenu = ({ openLivePhysicsEditor, onMenuItemClick,  editorState: { classSelectedIdContextMenu }}) => {
  return <>
    <MenuItem onClick={() => {
      openLivePhysicsEditor(classSelectedIdContextMenu)
      onMenuItemClick()
    }}>Edit Physics</MenuItem>
  </>
};

const mapStateToProps = (state) => {
  const isCobrowsing = state.cobrowsing.isSubscribedCobrowsing

  // console.log(isCobrowsing, isCobrowsing ? state.cobrowsing.remoteState.editor : state.editor.editorState)
  return {
    editorState: isCobrowsing ? state.cobrowsing.remoteState.editor : state.editor.editorState,
  }
};
export default connect(mapStateToProps, {openLivePhysicsEditor })(ClassContextMenu);
