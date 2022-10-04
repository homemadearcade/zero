import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import { editGameModel } from '../../store/actions/gameActions'
import { openLivePhysicsEditor, openLiveCameraEditor, openLiveProjectileEditor, openLiveMovementEditor } from '../../store/actions/editorActions';
import Unlockable from '../../app/cobrowsing/Unlockable/Unlockable';
import { openCreateClassFlow } from '../../store/actions/editorFormsActions';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';

const ClassContextMenu = ({ editGameModel, openCreateClassFlow, openLivePhysicsEditor, openLiveCameraEditor, openLiveProjectileEditor, onMenuItemClick, openLiveMovementEditor,  game: { gameModel }, classId, editorForms : { isCreateClassFlowOpen }}) => {
  const objectClass = gameModel.classes[classId]

  return <>
    {objectClass.type === 'hero' && classId !== gameModel.hero.initialClassId && 
      <Unlockable interfaceId="contextMenu/class/setPlayerClass">
          <MenuItem onClick={() => {
            editGameModel({
              hero: {
                initialClassId: classId
              }
            })
            onMenuItemClick()
          }}>Set as Player</MenuItem>
      </Unlockable>
    }
    <Unlockable interfaceId="contextMenu/class/graphics">
      <MenuItem onClick={() => {
        openCreateClassFlow(objectClass)
        onMenuItemClick()
      }}>Edit Graphics</MenuItem>
    </Unlockable>
    <Unlockable interfaceId="contextMenu/class/physics">
      <MenuItem onClick={() => {
        openLivePhysicsEditor(classId)
        onMenuItemClick()
      }}>Edit Collision Response</MenuItem>
    </Unlockable>
    {objectClass.type === 'hero' &&
      <Unlockable interfaceId="contextMenu/class/camera">
        <MenuItem onClick={() => {
          openLiveCameraEditor(classId)
          onMenuItemClick()
        }}>Edit Camera</MenuItem>
      </Unlockable>
    }
    {objectClass.type === 'hero' && <Unlockable interfaceId="contextMenu/class/projectile">
        <MenuItem onClick={() => {
          openLiveProjectileEditor(classId)
          onMenuItemClick()
        }}>Edit Projectile</MenuItem>
    </Unlockable>}
    <Unlockable interfaceId="contextMenu/class/movement">
      <MenuItem onClick={() => {
        openLiveMovementEditor(classId)
        onMenuItemClick()
      }}>Edit Movement</MenuItem>
    </Unlockable>
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  game: state.game,
  editorForms: state.editorForms
})

export default connect(mapStateToProps, { editGameModel, openCreateClassFlow, openLiveCameraEditor, openLivePhysicsEditor, openLiveProjectileEditor, openLiveMovementEditor })(ClassContextMenu);
