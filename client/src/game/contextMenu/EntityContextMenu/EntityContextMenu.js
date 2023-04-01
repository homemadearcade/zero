import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import { editGameModel } from '../../../store/actions/game/gameModelActions'
import { openJsonViewer, openLiveEditor } from '../../../store/actions/game/gameSelectorActions';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { openEditEntityGraphics, openEditEntityModal } from '../../../store/actions/game/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { CAMERA_EDITOR, PLAYER_ENTITY_IID, JUMP_EDITOR, MOVEMENT_EDITOR, ENTITY_MODEL_ID_PREFIX, PHYSICS_EDITOR, PROJECTILE_EDITOR, RELATION_ID_PREFIX, entityModelTypeToPrefix, initialCameraZoneEntityId, DATA_SOURCE_GAME_MODEL } from '../../constants';
import { entityModelTypeToDisplayName } from '../../constants';
import { generateUniqueId } from '../../../utils/webPageUtils';
import ContextMenuTitle from '../../../ui/ContextMenuTitle/ContextMenuTitle';
import { CONTEXT_MENU_CLASS_CAMERA_IID, CONTEXT_MENU_CLASS_DUPLICATE_IID, CONTEXT_MENU_CLASS_GRAPHICS_IID, CONTEXT_MENU_CLASS_JUMP_IID, CONTEXT_MENU_CLASS_MOVEMENT_IID, CONTEXT_MENU_CLASS_EDIT_IID, CONTEXT_MENU_CLASS_PHYSICS_IID, CONTEXT_MENU_CLASS_PROJECTILE_IID, CONTEXT_MENU_CLASS_RELATIONS_IID, CONTEXT_MENU_CLASS_REMOVE_IID, CONTEXT_MENU_CLASS_SELECT_PLAYER_IID, CONTEXT_MENU_INSTANCE_JSON_IID } from '../../../constants/interfaceIds';
import { addEntityModelToLibrary } from '../../../store/actions/library/entityModelLibraryActions';

    // <Unlockable interfaceId={CONTEXT_MENU_CLASS_RELATIONS_IID}>
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
  openEditEntityModal,
  entityModelId, 
  insideEntityInstanceContextMenu,
  openJsonViewer,
  addEntityModelToLibrary,
  entityModelLibrary: {
    entityModelLibrary
  }
}) => {
  const entityModel = gameModel.entityModels[entityModelId]
  const isInLibrary = entityModelLibrary.find(entityModel => entityModel.entityModelId === entityModelId)

  if(entityModelId === initialCameraZoneEntityId) {
    return null
  }

  return <>
    {!insideEntityInstanceContextMenu && <ContextMenuTitle onClick={() => {
      openEditEntityModal(entityModel)
      onMenuItemClick()
    }}>{entityModel.name}</ContextMenuTitle>}
    {entityModel.entityInterfaceId === PLAYER_ENTITY_IID && <Unlockable interfaceId={CONTEXT_MENU_CLASS_SELECT_PLAYER_IID}>
      <MenuItem disabled={entityModelId === playerEntityModelId} 
      onClick={() => {
        console.log('??')
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
    <Unlockable interfaceId={CONTEXT_MENU_CLASS_EDIT_IID}>
      <MenuItem onClick={() => {
        openEditEntityModal(entityModel)
        onMenuItemClick()
      }}>Edit {entityModelTypeToDisplayName[entityModel.entityInterfaceId]}</MenuItem>
    </Unlockable>
    <Unlockable interfaceId={CONTEXT_MENU_CLASS_GRAPHICS_IID}>
      <MenuItem onClick={() => {
        openEditEntityGraphics(entityModel)
        onMenuItemClick()
      }}>Edit Graphics</MenuItem>
    </Unlockable>
    <Unlockable interfaceId={CONTEXT_MENU_CLASS_PHYSICS_IID}>
      <MenuItem onClick={() => {
        openLiveEditor(PHYSICS_EDITOR, entityModelId)
        onMenuItemClick()
      }}>Edit Collisions</MenuItem>
    </Unlockable>
    {entityModel.entityInterfaceId === PLAYER_ENTITY_IID &&
      <Unlockable interfaceId={CONTEXT_MENU_CLASS_CAMERA_IID}>
        <MenuItem onClick={() => {
          openLiveEditor(CAMERA_EDITOR, entityModelId)
          onMenuItemClick()
        }}>Edit Camera</MenuItem>
      </Unlockable>
    }
    <Unlockable interfaceId={CONTEXT_MENU_CLASS_PROJECTILE_IID}>
      <MenuItem onClick={() => {
        openLiveEditor(PROJECTILE_EDITOR, entityModelId)
        onMenuItemClick()
      }}>Edit Projectile</MenuItem>
    </Unlockable>
    {entityModel.entityInterfaceId === PLAYER_ENTITY_IID && <Unlockable interfaceId={CONTEXT_MENU_CLASS_JUMP_IID}>
      <MenuItem onClick={() => {
        openLiveEditor(JUMP_EDITOR, entityModelId)
        onMenuItemClick()
      }}>Edit Jump</MenuItem>
    </Unlockable>}
    <Unlockable interfaceId={CONTEXT_MENU_CLASS_MOVEMENT_IID}>
      <MenuItem onClick={() => {
        openLiveEditor(MOVEMENT_EDITOR, entityModelId)
        onMenuItemClick()
      }}>Edit Movement</MenuItem>
    </Unlockable>
    {!insideEntityInstanceContextMenu && <Unlockable interfaceId={CONTEXT_MENU_CLASS_DUPLICATE_IID}>
      <MenuItem onClick={() => {  
        const newEntityId = ENTITY_MODEL_ID_PREFIX+entityModelTypeToPrefix[entityModel.entityInterfaceId]+generateUniqueId()
        editGameModel({
          entityModels: {
            [newEntityId]: {
              ...entityModel,
              dataSource: DATA_SOURCE_GAME_MODEL,
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
        <Unlockable interfaceId={CONTEXT_MENU_CLASS_REMOVE_IID}>
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
        {<Unlockable interfaceId={CONTEXT_MENU_INSTANCE_JSON_IID}>
      <MenuItem onClick={() => {
        openJsonViewer(entityModel)
        onMenuItemClick()
      }}>View Json</MenuItem>
    </Unlockable>}
     <Unlockable interfaceId={CONTEXT_MENU_CLASS_GRAPHICS_IID}>
      <MenuItem disabled={isInLibrary} onClick={() => {
        addEntityModelToLibrary(entityModel)
        onMenuItemClick()
      }}>Add to Library</MenuItem>
    </Unlockable>
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  entityModelLibrary: state.entityModelLibrary,
  playerInterface: state.playerInterface
})

export default connect(mapStateToProps, { 
  openJsonViewer,
  editGameModel, 
  openEditEntityGraphics, 
  openLiveEditor, 
  openEditEntityModal,
  addEntityModelToLibrary
})(EntityContextMenu);
