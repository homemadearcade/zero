import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import { editGameModel } from '../../../store/actions/gameModelActions'
import { openJsonViewer, openLiveEditor } from '../../../store/actions/gameSelectorActions';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { openCreateClassFlow, openClassNameModal } from '../../../store/actions/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { CAMERA_EDITOR, PLAYER_CLASS, JUMP_EDITOR, MOVEMENT_EDITOR, OBJECT_CLASS_ID_PREFIX, PHYSICS_EDITOR, PROJECTILE_EDITOR, RELATION_ID_PREFIX, classTypeToPrefix } from '../../constants';
import { classTypeToDisplayName } from '../../constants';
import { generateUniqueId } from '../../../utils/webPageUtils';
import ContextMenuTitle from '../../../ui/ContextMenuTitle/ContextMenuTitle';
import { CONTEXT_MENU_CLASS_CAMERA_IID, CONTEXT_MENU_CLASS_DUPLICATE_IID, CONTEXT_MENU_CLASS_GRAPHICS_IID, CONTEXT_MENU_CLASS_JUMP_IID, CONTEXT_MENU_CLASS_MOVEMENT_IID, CONTEXT_MENU_CLASS_NAME_IID, CONTEXT_MENU_CLASS_PHYSICS_IID, CONTEXT_MENU_CLASS_PROJECTILE_IID, CONTEXT_MENU_CLASS_RELATIONS_IID, CONTEXT_MENU_CLASS_REMOVE_IID, CONTEXT_MENU_CLASS_SELECT_PLAYER_IID, CONTEXT_MENU_INSTANCE_JSON_IID } from '../../../constants/interfaceIds';

    // <Unlockable interfaceId={CONTEXT_MENU_CLASS_RELATIONS_IID}>
    //   <MenuItem onClick={() => {
    //     openRelationsMenu(classId)
    //     onMenuItemClick()
    //   }}>Edit Relationships</MenuItem>
    // </Unlockable>

const ClassContextMenu = ({ 
  editGameModel, 
  openCreateClassFlow, 
  openLiveEditor, 
  onMenuItemClick, 
  gameModel: { gameModel, currentStageId }, 
  openClassNameModal,
  classId, 
  insideObjectInstanceContextMenu,
  openJsonViewer
}) => {
  const objectClass = gameModel.classes[classId]

  return <>
    {!insideObjectInstanceContextMenu && <ContextMenuTitle onClick={() => {
      openClassNameModal(objectClass)
      onMenuItemClick()
    }}>{objectClass.name}</ContextMenuTitle>}
    {objectClass.type === PLAYER_CLASS && classId !== gameModel.stages[currentStageId].playerClassId && 
      <Unlockable interfaceId={CONTEXT_MENU_CLASS_SELECT_PLAYER_IID}>
          <MenuItem onClick={() => {
            editGameModel({
              stages: {
                [currentStageId] : {
                  playerClassId: classId
                }
              }
            })
            onMenuItemClick()
          }}>Set as Player</MenuItem>
      </Unlockable>
    }
    <Unlockable interfaceId={CONTEXT_MENU_CLASS_NAME_IID}>
      <MenuItem onClick={() => {
        openClassNameModal(objectClass)
        onMenuItemClick()
      }}>Edit Name</MenuItem>
    </Unlockable>
    <Unlockable interfaceId={CONTEXT_MENU_CLASS_GRAPHICS_IID}>
      <MenuItem onClick={() => {
        openCreateClassFlow(objectClass)
        onMenuItemClick()
      }}>Edit Graphics</MenuItem>
    </Unlockable>
    <Unlockable interfaceId={CONTEXT_MENU_CLASS_PHYSICS_IID}>
      <MenuItem onClick={() => {
        openLiveEditor(PHYSICS_EDITOR, classId)
        onMenuItemClick()
      }}>Edit Collisions</MenuItem>
    </Unlockable>
    {objectClass.type === PLAYER_CLASS &&
      <Unlockable interfaceId={CONTEXT_MENU_CLASS_CAMERA_IID}>
        <MenuItem onClick={() => {
          openLiveEditor(CAMERA_EDITOR, classId)
          onMenuItemClick()
        }}>Edit Camera</MenuItem>
      </Unlockable>
    }
    <Unlockable interfaceId={CONTEXT_MENU_CLASS_PROJECTILE_IID}>
      <MenuItem onClick={() => {
        openLiveEditor(PROJECTILE_EDITOR, classId)
        onMenuItemClick()
      }}>Edit Projectile</MenuItem>
    </Unlockable>
    {objectClass.type === PLAYER_CLASS && <Unlockable interfaceId={CONTEXT_MENU_CLASS_JUMP_IID}>
      <MenuItem onClick={() => {
        openLiveEditor(JUMP_EDITOR, classId)
        onMenuItemClick()
      }}>Edit Jump</MenuItem>
    </Unlockable>}
    <Unlockable interfaceId={CONTEXT_MENU_CLASS_MOVEMENT_IID}>
      <MenuItem onClick={() => {
        openLiveEditor(MOVEMENT_EDITOR, classId)
        onMenuItemClick()
      }}>Edit Movement</MenuItem>
    </Unlockable>
    {!insideObjectInstanceContextMenu && <Unlockable interfaceId={CONTEXT_MENU_CLASS_DUPLICATE_IID}>
      <MenuItem onClick={() => {  
        const newClassId = OBJECT_CLASS_ID_PREFIX+classTypeToPrefix[objectClass.type]+generateUniqueId()

        editGameModel({
          classes: {
            [newClassId]: {
              ...objectClass,
              classId: newClassId,
              name: objectClass.name + ' Duplicate',
              isNew: false
            }
          }
        })
        onMenuItemClick()
      }}>Duplicate {classTypeToDisplayName[objectClass.type]}</MenuItem>
      </Unlockable>}
      {!insideObjectInstanceContextMenu && 
        <Unlockable interfaceId={CONTEXT_MENU_CLASS_REMOVE_IID}>
          <MenuItem onClick={() => {
            editGameModel({
              classes: {
                [classId]: {
                  isRemoved: true
                }
              },
            })
            onMenuItemClick()
          }}>Remove</MenuItem>
        </Unlockable>}
        {<Unlockable interfaceId={CONTEXT_MENU_INSTANCE_JSON_IID}>
      <MenuItem onClick={() => {
        openJsonViewer(objectClass)
        onMenuItemClick()
      }}>View Json</MenuItem>
    </Unlockable>}
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
})

export default connect(mapStateToProps, { 
  openJsonViewer,
  editGameModel, 
  openCreateClassFlow, 
  openLiveEditor, 
  openClassNameModal,
})(ClassContextMenu);
