import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import { editGameModel } from '../../../store/actions/game/gameModelActions'
import { openJsonViewer, openLiveEditor } from '../../../store/actions/game/gameSelectorActions';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { openEditEntityGraphics, openEditEntityDialog } from '../../../store/actions/game/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { ENTITY_MODEL_ID_PREFIX, entityModelTypeToPrefix, initialCameraZoneEntityId } from '../../constants';
import { entityModelTypeToDisplayName } from '../../constants';
import { generateUniqueId } from '../../../utils/webPageUtils';
import ContextMenuTitle from '../../../ui/ContextMenuTitle/ContextMenuTitle';
import { CONTEXT_MENU_ENTITY_CAMERA_IID, 
  COLLISION_EDITOR_IID, PROJECTILE_EDITOR_IID,
  CONTEXT_MENU_ENTITY_DUPLICATE_IID, CONTEXT_MENU_ENTITY_GRAPHICS_IID, CONTEXT_MENU_ENTITY_JUMP_IID, CONTEXT_MENU_ENTITY_MOVEMENT_IID, 
  CONTEXT_MENU_ENTITY_EDIT_IID, CONTEXT_MENU_ENTITY_COLLISIONS_IID, CONTEXT_MENU_ENTITY_PROJECTILE_IID, 
  CONTEXT_MENU_ENTITY_REMOVE_IID, CONTEXT_MENU_ENTITY_SELECT_PLAYER_IID, CONTEXT_MENU_INSTANCE_JSON_IID, 
  EDIT_ENTITY_GRAPHICS_PRIMARY_DIALOG_IID, PLAYER_ENTITY_IID, DATA_SOURCE_GAME_MODEL_IID,
  CAMERA_EDITOR_IID, JUMP_EDITOR_IID, MOVEMENT_EDITOR_IID
} from '../../../constants/interfaceIds';

    // <Unlockable interfaceId={CONTEXT_MENU_ENTITY_RELATIONS_IID}>
    //   <MenuItem onClick={() => {
    //     openRelationsMenu(entityModelId)
    //     onMenuItemClick()
    //   }}>Edit Relationships</MenuItem>
    // </Unlockable>

const EntityContextMenu = ({ 
  editGameModel, 
  openEditEntityGraphics, 
  openLiveEditor, 
  onMenuItemClick, 
  gameModel: { gameModel, currentStageId }, 
  playerInterface: { playerEntityModelId },
  openEditEntityDialog,
  entityModelId, 
  insideEntityInstanceContextMenu,
  openJsonViewer,
}) => {
  const entityModel = gameModel.entityModels[entityModelId]

  if(entityModelId === initialCameraZoneEntityId) {
    return null
  }

  return <>
    {!insideEntityInstanceContextMenu && <ContextMenuTitle onClick={() => {
      openEditEntityDialog(entityModel)
      onMenuItemClick()
    }}>{entityModel.name}</ContextMenuTitle>}
    {!insideEntityInstanceContextMenu && entityModel.entityInterfaceId === PLAYER_ENTITY_IID && <Unlockable interfaceId={CONTEXT_MENU_ENTITY_SELECT_PLAYER_IID}>
      <MenuItem disabled={entityModelId === playerEntityModelId} 
      onClick={() => {
        editGameModel({
          stages: {
            [currentStageId] : {
              playerEntityModelId: entityModelId
            }
          }
        })
        onMenuItemClick()
      }}>Set as Player</MenuItem>
    </Unlockable>}
    <Unlockable interfaceId={CONTEXT_MENU_ENTITY_EDIT_IID}>
      <MenuItem onClick={() => {
        openEditEntityDialog(entityModel)
        onMenuItemClick()
      }}>Edit {entityModelTypeToDisplayName[entityModel.entityInterfaceId]}</MenuItem>
    </Unlockable>
    <Unlockable interfaceId={CONTEXT_MENU_ENTITY_GRAPHICS_IID}>
      <MenuItem onClick={() => {
        openEditEntityGraphics(EDIT_ENTITY_GRAPHICS_PRIMARY_DIALOG_IID, entityModel)
        onMenuItemClick()
      }}>Edit Graphics</MenuItem>
    </Unlockable>
    <Unlockable interfaceId={CONTEXT_MENU_ENTITY_COLLISIONS_IID}>
      <MenuItem onClick={() => {
        openLiveEditor(COLLISION_EDITOR_IID, entityModelId)
        onMenuItemClick()
      }}>Edit Collisions</MenuItem>
    </Unlockable>
    {entityModel.entityInterfaceId === PLAYER_ENTITY_IID &&
      <Unlockable interfaceId={CONTEXT_MENU_ENTITY_CAMERA_IID}>
        <MenuItem onClick={() => {
          openLiveEditor(CAMERA_EDITOR_IID, entityModelId)
          onMenuItemClick()
        }}>Edit Camera</MenuItem>
      </Unlockable>
    }
    <Unlockable interfaceId={CONTEXT_MENU_ENTITY_PROJECTILE_IID}>
      <MenuItem onClick={() => {
        openLiveEditor(PROJECTILE_EDITOR_IID, entityModelId)
        onMenuItemClick()
      }}>Edit Projectile</MenuItem>
    </Unlockable>
    {entityModel.entityInterfaceId === PLAYER_ENTITY_IID && <Unlockable interfaceId={CONTEXT_MENU_ENTITY_JUMP_IID}>
      <MenuItem onClick={() => {
        openLiveEditor(JUMP_EDITOR_IID, entityModelId)
        onMenuItemClick()
      }}>Edit Jump</MenuItem>
    </Unlockable>}
    <Unlockable interfaceId={CONTEXT_MENU_ENTITY_MOVEMENT_IID}>
      <MenuItem onClick={() => {
        openLiveEditor(MOVEMENT_EDITOR_IID, entityModelId)
        onMenuItemClick()
      }}>Edit Movement</MenuItem>
    </Unlockable>
    {!insideEntityInstanceContextMenu && <Unlockable interfaceId={CONTEXT_MENU_ENTITY_DUPLICATE_IID}>
      <MenuItem onClick={() => {  
        const newEntityId = ENTITY_MODEL_ID_PREFIX+entityModelTypeToPrefix[entityModel.entityInterfaceId]+generateUniqueId()
        editGameModel({
          entityModels: {
            [newEntityId]: {
              ...entityModel,
              dataSourceId: DATA_SOURCE_GAME_MODEL_IID,
              entityModelId: newEntityId,
              name: entityModel.name + ' Duplicate',
              isNew: false
            }
          }
        })
        onMenuItemClick()
      }}>Duplicate {entityModelTypeToDisplayName[entityModel.entityInterfaceId]}</MenuItem>
      </Unlockable>}
      {!insideEntityInstanceContextMenu && 
        <Unlockable interfaceId={CONTEXT_MENU_ENTITY_REMOVE_IID}>
          <MenuItem onClick={() => {
            editGameModel({
              entityModels: {
                [entityModelId]: {
                  isRemoved: true
                }
              },
            })
            onMenuItemClick()
          }}>Remove</MenuItem>
        </Unlockable>}
        {!insideEntityInstanceContextMenu && <Unlockable interfaceId={CONTEXT_MENU_INSTANCE_JSON_IID}>
      <MenuItem onClick={() => {
        openJsonViewer(entityModel)
        onMenuItemClick()
      }}>View Json</MenuItem>
    </Unlockable>}
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  playerInterface: state.playerInterface
})

export default connect(mapStateToProps, { 
  openJsonViewer,
  editGameModel, 
  openEditEntityGraphics, 
  openLiveEditor, 
  openEditEntityDialog,
})(EntityContextMenu);
