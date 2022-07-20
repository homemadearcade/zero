import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

import { openLivePhysicsEditor } from '../../store/actions/editorActions';
import { editGameModel } from '../../store/actions/gameActions';
import ClassContextMenu from '../ClassContextMenu/ClassContextMenu';

const ObjectInstanceContextMenu = ({ editGameModel, onMenuItemClick, editorState: { objectSelectedIdContextMenu }}) => {
  return <>
    <MenuItem onClick={() => {
      editGameModel({ objects: { [objectSelectedIdContextMenu]: null } })
      onMenuItemClick()
    }}>Delete</MenuItem>
    <ClassContextMenu onMenuItemClick={onMenuItemClick}/>
  </>
};

const mapStateToProps = (state) => {
  const isCobrowsing = state.cobrowsing.isSubscribedCobrowsing

  // console.log(isCobrowsing, isCobrowsing ? state.cobrowsing.remoteState.editor : state.editor.editorState)
  return {
    editorState: isCobrowsing ? state.cobrowsing.remoteState.editor : state.editor.editorState,
  }
};

export default connect(mapStateToProps, { openLivePhysicsEditor, editGameModel })(ObjectInstanceContextMenu);
