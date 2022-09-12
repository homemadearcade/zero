import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

import { openLivePhysicsEditor, openLiveCameraEditor, openLiveProjectileEditor } from '../../store/actions/editorActions';
import Unlockable from '../../app/cobrowsing/Unlockable/Unlockable';

const ClassContextMenu = ({ openLivePhysicsEditor,  openLiveCameraEditor, openLiveProjectileEditor, onMenuItemClick,  game: { gameModel }, classId }) => {
  const objectClass = gameModel.classes[classId]

  return <>
    <Unlockable interfaceId="contextMenu/class/physics">
      <MenuItem onClick={() => {
        openLivePhysicsEditor(classId)
        onMenuItemClick()
      }}>Edit Physics</MenuItem>
    </Unlockable>
    {objectClass?.camera &&
      <Unlockable interfaceId="contextMenu/class/camera">
        <MenuItem onClick={() => {
          openLiveCameraEditor(classId)
          onMenuItemClick()
        }}>Edit Camera</MenuItem>
      </Unlockable>
    }
    {objectClass?.projectileClassId &&
      <Unlockable interfaceId="contextMenu/class/projectile">
        <MenuItem onClick={() => {
          openLiveProjectileEditor(classId)
          onMenuItemClick()
        }}>Edit Projectile</MenuItem>
      </Unlockable>
    }
  </>
};

const mapStateToProps = (state) => ({
  game: state.game,
})

export default connect(mapStateToProps, { openLiveCameraEditor, openLivePhysicsEditor, openLiveProjectileEditor })(ClassContextMenu);
