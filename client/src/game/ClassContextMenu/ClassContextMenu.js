import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import { editGameModel } from '../../store/actions/gameActions'
import { openLiveEditor } from '../../store/actions/editorActions';
import Unlockable from '../../app/cobrowsing/Unlockable/Unlockable';
import { openCreateClassFlow } from '../../store/actions/editorFormsActions';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import { CAMERA_EDITOR, HERO_CLASS, MOVEMENT_EDITOR, PHYSICS_EDITOR, PROJECTILE_EDITOR } from '../../constants';

const ClassContextMenu = ({ editGameModel, openCreateClassFlow, openLiveEditor, onMenuItemClick, game: { gameModel }, classId, editorForms : { isCreateClassFlowOpen }}) => {
  const objectClass = gameModel.classes[classId]

  return <>
    {objectClass.type === HERO_CLASS && classId !== gameModel.hero.initialClassId && 
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
        openLiveEditor(PHYSICS_EDITOR, classId)
        onMenuItemClick()
      }}>Edit Collisions</MenuItem>
    </Unlockable>
    {objectClass.type === HERO_CLASS &&
      <Unlockable interfaceId="contextMenu/class/camera">
        <MenuItem onClick={() => {
          openLiveEditor(CAMERA_EDITOR, classId)
          onMenuItemClick()
        }}>Edit Camera</MenuItem>
      </Unlockable>
    }
    {objectClass.type === HERO_CLASS && <Unlockable interfaceId="contextMenu/class/projectile">
        <MenuItem onClick={() => {
          openLiveEditor(PROJECTILE_EDITOR, classId)
          onMenuItemClick()
        }}>Edit Projectile</MenuItem>
    </Unlockable>}
    <Unlockable interfaceId="contextMenu/class/movement">
      <MenuItem onClick={() => {
        openLiveEditor(MOVEMENT_EDITOR, classId)
        onMenuItemClick()
      }}>Edit Movement</MenuItem>
    </Unlockable>
    <Unlockable interfaceId="contextMenu/class/spawn">
      <MenuItem onClick={() => {
        editGameModel({
          classes: {
            [classId]: {
              unspawned: !objectClass.unspawned
            }
          }
        })
        onMenuItemClick()
      }}>{objectClass.unspawned ? 'Set as Spawned' : 'Set as Unspawned'}</MenuItem>
    </Unlockable>
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  game: state.game,
  editorForms: state.editorForms
})

export default connect(mapStateToProps, { editGameModel, openCreateClassFlow, openLiveEditor })(ClassContextMenu);
