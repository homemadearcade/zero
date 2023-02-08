import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import { editGameModel } from '../../../store/actions/gameModelActions'
import { openClassNameModal, openLiveEditor } from '../../../store/actions/gameEditorActions';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { openCreateClassFlow, openRelationsMenu } from '../../../store/actions/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { CAMERA_EDITOR, PLAYER_CLASS, JUMP_EDITOR, MOVEMENT_EDITOR, OBJECT_CLASS_ID_PREFIX, PHYSICS_EDITOR, PROJECTILE_EDITOR, RELATION_ID_PREFIX } from '../../constants';
import { classTypeToDisplayName } from '../../defaultData/class';
import { generateUniqueId } from '../../../utils/webPageUtils';
import ContextMenuTitle from '../../../ui/ContextMenuTitle/ContextMenuTitle';

    // {false && <Unlockable interfaceId="contextMenu/class/spawn">
    //   <MenuItem onClick={() => {
    //     editGameModel({
    //       classes: {
    //         [classId]: {
    //           unspawned: !objectClass.unspawned
    //         }
    //       }
    //     })
    //     onMenuItemClick()
    //   }}>{objectClass.unspawned ? 'Set as Spawned' : 'Set as Unspawned'}</MenuItem>
    // </Unlockable>}

const ClassContextMenu = ({ 
  editGameModel, 
  openCreateClassFlow, 
  openLiveEditor, 
  onMenuItemClick, 
  openRelationsMenu,
  gameModel: { gameModel, currentStageId }, 
  openClassNameModal,
  classId, 
  insideObjectInstanceContextMenu
}) => {
  const objectClass = gameModel.classes[classId]

  return <>
    {!insideObjectInstanceContextMenu && <ContextMenuTitle onClick={() => {
      openClassNameModal(classId)
      onMenuItemClick()
    }}>{gameModel.classes[classId].name}</ContextMenuTitle>}
    {objectClass.type === PLAYER_CLASS && classId !== gameModel.stages[currentStageId].playerClassId && 
      <Unlockable interfaceId="contextMenu/class/setPlayerClass">
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
    <Unlockable interfaceId="contextMenu/class/name">
      <MenuItem onClick={() => {
        openClassNameModal(classId)
        onMenuItemClick()
      }}>Edit Name</MenuItem>
    </Unlockable>
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
    {objectClass.type === PLAYER_CLASS &&
      <Unlockable interfaceId="contextMenu/class/camera">
        <MenuItem onClick={() => {
          openLiveEditor(CAMERA_EDITOR, classId)
          onMenuItemClick()
        }}>Edit Camera</MenuItem>
      </Unlockable>
    }
    {objectClass.type === PLAYER_CLASS && <Unlockable interfaceId="contextMenu/class/projectile">
      <MenuItem onClick={() => {
        openLiveEditor(PROJECTILE_EDITOR, classId)
        onMenuItemClick()
      }}>Edit Projectile</MenuItem>
    </Unlockable>}
    {objectClass.type === PLAYER_CLASS && <Unlockable interfaceId="contextMenu/class/jump">
      <MenuItem onClick={() => {
        openLiveEditor(JUMP_EDITOR, classId)
        onMenuItemClick()
      }}>Edit Jump</MenuItem>
    </Unlockable>}
    <Unlockable interfaceId="contextMenu/class/movement">
      <MenuItem onClick={() => {
        openLiveEditor(MOVEMENT_EDITOR, classId)
        onMenuItemClick()
      }}>Edit Movement</MenuItem>
    </Unlockable>
    <Unlockable interfaceId="contextMenu/class/relations">
      <MenuItem onClick={() => {
        openRelationsMenu(classId)
        onMenuItemClick()
      }}>Edit Relationships</MenuItem>
    </Unlockable>
    {!insideObjectInstanceContextMenu && <Unlockable interfaceId="contextMenu/class/duplicate">
      <MenuItem onClick={() => {  
        const newClassId = OBJECT_CLASS_ID_PREFIX+generateUniqueId()

        const relations = Object.keys(gameModel.relations).map((relationId) => {
          const relation = gameModel.relations[relationId]
          if(relation.event.classIdA === classId) {
            return {
              ...relation,
              event: {
                ...relation.event,
                classIdA: newClassId
              },
              relationId: RELATION_ID_PREFIX + generateUniqueId()
            }
          }
        }).filter((relation) => {
          return !!relation
        }).reduce((prev, relation) => {
          const relationId = relation.relationId
          prev[relationId] = relation
          return prev
        }, {})

        editGameModel({
          classes: {
            [newClassId]: {
              ...objectClass,
              classId: newClassId,
              name: objectClass.name + ' Duplicate',
              isNew: false
            }
          },
          relations: {
            ...relations
          }
        })
        onMenuItemClick()
      }}>Duplicate {classTypeToDisplayName[objectClass.type]}</MenuItem>
      </Unlockable>}
      {!insideObjectInstanceContextMenu && 
        <Unlockable interfaceId="contextMenu/class/delete">
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
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
})

export default connect(mapStateToProps, { 
  editGameModel, 
  openCreateClassFlow, 
  openLiveEditor, 
  openRelationsMenu,
  openClassNameModal,
})(ClassContextMenu);
