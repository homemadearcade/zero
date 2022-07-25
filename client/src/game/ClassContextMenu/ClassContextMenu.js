import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

import { openLivePhysicsEditor, openLiveCameraEditor } from '../../store/actions/editorActions';
import { mapCobrowsingState } from '../../utils/cobrowsing';

const ClassContextMenu = ({ openLivePhysicsEditor, openLiveCameraEditor, onMenuItemClick,  game: { gameModel },  editor: { classSelectedIdContextMenu }}) => {
  const objectClass = gameModel.classes[classSelectedIdContextMenu]
  return <>
    <MenuItem onClick={() => {
      openLivePhysicsEditor(classSelectedIdContextMenu)
      onMenuItemClick()
    }}>Edit Physics</MenuItem>
    {objectClass?.camera &&
      <MenuItem onClick={() => {
      openLiveCameraEditor(classSelectedIdContextMenu)
      onMenuItemClick()
      }}>Edit Camera</MenuItem>
    }
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  game: state.game,
  editor: state.editor,
})

export default connect(mapStateToProps, { openLiveCameraEditor, openLivePhysicsEditor })(ClassContextMenu);
