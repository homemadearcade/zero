import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

import { openLivePhysicsEditor, openLiveCameraEditor } from '../../store/actions/editorActions';

const ClassContextMenu = ({ openLivePhysicsEditor, openLiveCameraEditor, onMenuItemClick,  game: { gameModel }, classId }) => {
  const objectClass = gameModel.classes[classId]

return <>
    <MenuItem onClick={() => {
      openLivePhysicsEditor(classId)
      onMenuItemClick()
    }}>Edit Physics</MenuItem>
    {objectClass?.camera &&
      <MenuItem onClick={() => {
      openLiveCameraEditor(classId)
      onMenuItemClick()
      }}>Edit Camera</MenuItem>
    }
  </>
};

const mapStateToProps = (state) => ({
  game: state.game,
})

export default connect(mapStateToProps, { openLiveCameraEditor, openLivePhysicsEditor })(ClassContextMenu);
