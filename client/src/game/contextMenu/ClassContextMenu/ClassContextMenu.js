import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import { editGameModel } from '../../../store/actions/game/gameModelActions'
import { openJsonViewer, openLiveEditor } from '../../../store/actions/game/gameSelectorActions';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { openEditClassGraphics, openEditClassModal } from '../../../store/actions/game/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { CAMERA_EDITOR, PLAYER_CLASS, JUMP_EDITOR, MOVEMENT_EDITOR, ENTITY_CLASS_ID_PREFIX, PHYSICS_EDITOR, PROJECTILE_EDITOR, RELATION_ID_PREFIX, classTypeToPrefix, initialCameraZoneClassId } from '../../constants';
import { classTypeToDisplayName } from '../../constants';
import { generateUniqueId } from '../../../utils/webPageUtils';
import ContextMenuTitle from '../../../ui/ContextMenuTitle/ContextMenuTitle';
import { CONTEXT_MENU_CLASS_CAMERA_IID, CONTEXT_MENU_CLASS_DUPLICATE_IID, CONTEXT_MENU_CLASS_GRAPHICS_IID, CONTEXT_MENU_CLASS_JUMP_IID, CONTEXT_MENU_CLASS_MOVEMENT_IID, CONTEXT_MENU_CLASS_EDIT_IID, CONTEXT_MENU_CLASS_PHYSICS_IID, CONTEXT_MENU_CLASS_PROJECTILE_IID, CONTEXT_MENU_CLASS_RELATIONS_IID, CONTEXT_MENU_CLASS_REMOVE_IID, CONTEXT_MENU_CLASS_SELECT_PLAYER_IID, CONTEXT_MENU_INSTANCE_JSON_IID } from '../../../constants/interfaceIds';
import { addEntityClassToLibrary } from '../../../store/actions/library/entityClassLibraryActions';

    // <Unlockable interfaceId={CONTEXT_MENU_CLASS_RELATIONS_IID}>
    //   <MenuItem onClick={() => {
    //     openRelationsMenu(entityClassId)
    //     onMenuItemClick()
    //   }}>Edit Relationships</MenuItem>
    // </Unlockable>

const ClassContextMenu = ({ 
  editGameModel, 
  openEditClassGraphics, 
  openLiveEditor, 
  onMenuItemClick, 
  gameModel: { gameModel, currentStageId }, 
  openEditClassModal,
  entityClassId, 
  insideEntityInstanceContextMenu,
  openJsonViewer,
  addEntityClassToLibrary,
  entityClassLibrary: {
    entityClassLibrary
  }
}) => {
  const entityClass = gameModel.entityClasses[entityClassId]
  const isInLibrary = entityClassLibrary.find(entityClass => entityClass.entityClassId === entityClassId)

  if(entityClassId === initialCameraZoneClassId) {
    return null
  }

  return <>
    {!insideEntityInstanceContextMenu && <ContextMenuTitle onClick={() => {
      openEditClassModal(entityClass)
      onMenuItemClick()
    }}>{entityClass.name}</ContextMenuTitle>}
    {entityClass.classInterfaceCategory === PLAYER_CLASS && entityClassId !== gameModel.stages[currentStageId].playerClassId && 
      <Unlockable interfaceId={CONTEXT_MENU_CLASS_SELECT_PLAYER_IID}>
          <MenuItem onClick={() => {
            editGameModel({
              stages: {
                [currentStageId] : {
                  playerClassId: entityClassId
                }
              }
            })
            onMenuItemClick()
          }}>Set as Player</MenuItem>
      </Unlockable>
    }
    <Unlockable interfaceId={CONTEXT_MENU_CLASS_EDIT_IID}>
      <MenuItem onClick={() => {
        openEditClassModal(entityClass)
        onMenuItemClick()
      }}>Edit {classTypeToDisplayName[entityClass.classInterfaceCategory]}</MenuItem>
    </Unlockable>
    <Unlockable interfaceId={CONTEXT_MENU_CLASS_GRAPHICS_IID}>
      <MenuItem onClick={() => {
        openEditClassGraphics(entityClass)
        onMenuItemClick()
      }}>Edit Graphics</MenuItem>
    </Unlockable>
    <Unlockable interfaceId={CONTEXT_MENU_CLASS_PHYSICS_IID}>
      <MenuItem onClick={() => {
        openLiveEditor(PHYSICS_EDITOR, entityClassId)
        onMenuItemClick()
      }}>Edit Collisions</MenuItem>
    </Unlockable>
    {entityClass.classInterfaceCategory === PLAYER_CLASS &&
      <Unlockable interfaceId={CONTEXT_MENU_CLASS_CAMERA_IID}>
        <MenuItem onClick={() => {
          openLiveEditor(CAMERA_EDITOR, entityClassId)
          onMenuItemClick()
        }}>Edit Camera</MenuItem>
      </Unlockable>
    }
    <Unlockable interfaceId={CONTEXT_MENU_CLASS_PROJECTILE_IID}>
      <MenuItem onClick={() => {
        openLiveEditor(PROJECTILE_EDITOR, entityClassId)
        onMenuItemClick()
      }}>Edit Projectile</MenuItem>
    </Unlockable>
    {entityClass.classInterfaceCategory === PLAYER_CLASS && <Unlockable interfaceId={CONTEXT_MENU_CLASS_JUMP_IID}>
      <MenuItem onClick={() => {
        openLiveEditor(JUMP_EDITOR, entityClassId)
        onMenuItemClick()
      }}>Edit Jump</MenuItem>
    </Unlockable>}
    <Unlockable interfaceId={CONTEXT_MENU_CLASS_MOVEMENT_IID}>
      <MenuItem onClick={() => {
        openLiveEditor(MOVEMENT_EDITOR, entityClassId)
        onMenuItemClick()
      }}>Edit Movement</MenuItem>
    </Unlockable>
    {!insideEntityInstanceContextMenu && <Unlockable interfaceId={CONTEXT_MENU_CLASS_DUPLICATE_IID}>
      <MenuItem onClick={() => {  
        const newClassId = ENTITY_CLASS_ID_PREFIX+classTypeToPrefix[entityClass.classInterfaceCategory]+generateUniqueId()
        editGameModel({
          entityClasses: {
            [newClassId]: {
              ...entityClass,
              entityClassId: newClassId,
              name: entityClass.name + ' Duplicate',
              isNew: false
            }
          }
        })
        onMenuItemClick()
      }}>Duplicate {classTypeToDisplayName[entityClass.classInterfaceCategory]}</MenuItem>
      </Unlockable>}
      {!insideEntityInstanceContextMenu && 
        <Unlockable interfaceId={CONTEXT_MENU_CLASS_REMOVE_IID}>
          <MenuItem onClick={() => {
            editGameModel({
              entityClasses: {
                [entityClassId]: {
                  isRemoved: true
                }
              },
            })
            onMenuItemClick()
          }}>Remove</MenuItem>
        </Unlockable>}
        {<Unlockable interfaceId={CONTEXT_MENU_INSTANCE_JSON_IID}>
      <MenuItem onClick={() => {
        openJsonViewer(entityClass)
        onMenuItemClick()
      }}>View Json</MenuItem>
    </Unlockable>}
    {!isInLibrary && <Unlockable interfaceId={CONTEXT_MENU_CLASS_GRAPHICS_IID}>
      <MenuItem onClick={() => {
        addEntityClassToLibrary(entityClass)
        onMenuItemClick()
      }}>Add to Library</MenuItem>
    </Unlockable>}
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  entityClassLibrary: state.entityClassLibrary,
})

export default connect(mapStateToProps, { 
  openJsonViewer,
  editGameModel, 
  openEditClassGraphics, 
  openLiveEditor, 
  openEditClassModal,
  addEntityClassToLibrary
})(ClassContextMenu);
