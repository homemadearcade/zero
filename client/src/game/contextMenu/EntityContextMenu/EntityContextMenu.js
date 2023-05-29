import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import { editGameModel } from '../../../store/actions/game/gameModelActions'
import { openEntityBehaviorLiveEditor, openJsonViewer } from '../../../store/actions/game/gameSelectorActions';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { openEditEntityGraphics, openEditEntityDialog, openCreateCanvasImageDialog } from '../../../store/actions/game/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { ENTITY_MODEL_DID, entityModelClassToPrefix, initialCameraZoneEntityId } from '../../constants';
import { entityModelClassToDisplayName } from '../../constants';
import { generateUniqueId } from '../../../utils/webPageUtils';
import ContextMenuTitle from '../../../ui/ContextMenuTitle/ContextMenuTitle';
import { 
  ENTITY_MODEL_DUPLICATE_IID, ENTITY_MODEL_OPEN_GRAPHICS_IID,
  ENTITY_MODEL_OPEN_EDIT_IID, 
  ENTITY_MODEL_REMOVE_IID, PLAYER_ENTITY_TRANSFORM_IID,
  EDIT_ENTITY_GRAPHICS_PRIMARY_DIALOG_IID, PLAYER_ENTITY_IID, DATA_SOURCE_GAME_MODEL_IID,
  DATA_SOURCE_ENTITY_MODEL_IID, ENTITY_MODEL_IMPORT_IID, ENTITY_MODEL_OPEN_BEHAVIOR_EDIT_IID
} from '../../../constants/interfaceIds';
import { ListItemIcon } from '@mui/material';
import Icon from '../../../ui/Icon/Icon';

const EntityContextMenu = ({ 
  editGameModel, 
  openEditEntityGraphics, 
  onMenuItemClick, 
  gameModel: { gameModel, currentStageId }, 
  playerInterface: { playerEntityModelId },
  openEditEntityDialog,
  entityModelId, 
  insideEntityInstanceContextMenu,
  openCreateCanvasImageDialog,
  openEntityBehaviorLiveEditor,
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
    {!insideEntityInstanceContextMenu && entityModel.entityIID === PLAYER_ENTITY_IID && <Unlockable interfaceId={PLAYER_ENTITY_TRANSFORM_IID}>
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
      }}><ListItemIcon><Icon icon="faStreetView"/></ListItemIcon>Set as Player</MenuItem>
    </Unlockable>}
    <Unlockable interfaceId={ENTITY_MODEL_OPEN_GRAPHICS_IID}>
      <MenuItem onClick={() => {
        openCreateCanvasImageDialog(entityModelId, entityModel.graphics.textureId, entityModel.graphics.textureTint)
        onMenuItemClick()
      }}><ListItemIcon><Icon icon="faPaintbrush"/></ListItemIcon>Draw</MenuItem>
    </Unlockable>
    <Unlockable interfaceId={ENTITY_MODEL_OPEN_GRAPHICS_IID}>
      <MenuItem onClick={() => {
        openEditEntityGraphics(EDIT_ENTITY_GRAPHICS_PRIMARY_DIALOG_IID, entityModel)
        onMenuItemClick()
      }}><ListItemIcon><Icon icon="faImage"/></ListItemIcon>Edit Sprite</MenuItem>
    </Unlockable>
    <Unlockable interfaceId={ENTITY_MODEL_OPEN_BEHAVIOR_EDIT_IID}>
      <MenuItem onClick={() => {
        openEntityBehaviorLiveEditor(null, entityModelId)
        onMenuItemClick()
      }}><ListItemIcon><Icon icon="faDna"/></ListItemIcon>Edit Behaviors</MenuItem>
    </Unlockable>
    <Unlockable interfaceId={ENTITY_MODEL_OPEN_EDIT_IID}>
      <MenuItem onClick={() => {
        openEditEntityDialog(entityModel)
        onMenuItemClick()
      }}><ListItemIcon><Icon icon="faChessPawn"/></ListItemIcon>Edit {entityModelClassToDisplayName[entityModel.entityIID]}</MenuItem>
    </Unlockable>

    {!insideEntityInstanceContextMenu && <Unlockable interfaceId={ENTITY_MODEL_DUPLICATE_IID}>
      <MenuItem onClick={() => {  
        const newEntityId = ENTITY_MODEL_DID+entityModelClassToPrefix[entityModel.entityIID]+generateUniqueId()

        const newRelationTags =  Object.keys(entityModel.relationTags).filter(relationTagId => {
          const relationTag = gameModel.relationTags[relationTagId]
          return relationTag.dataSourceIID !== DATA_SOURCE_ENTITY_MODEL_IID
        }).reduce((newRelationTags, relationTagId) => {
          newRelationTags[relationTagId] = entityModel.relationTags[relationTagId]
          return newRelationTags
        }, {})

        const newEntityModel = {
          ...entityModel,
          relationTags:newRelationTags
        }

        editGameModel({
          entityModels: {
            [newEntityId]: {
              ...newEntityModel,
              dataSourceIID: DATA_SOURCE_GAME_MODEL_IID,
              entityModelId: newEntityId,
              name: entityModel.name + ' Duplicate',
              isNew: false
            }
          }
        })
        onMenuItemClick()
      }}><ListItemIcon><Icon icon="faClone"/></ListItemIcon>Duplicate {entityModelClassToDisplayName[entityModel.entityIID]}</MenuItem>
    </Unlockable>}
    {!insideEntityInstanceContextMenu && 
      <Unlockable interfaceId={ENTITY_MODEL_REMOVE_IID}>
        <MenuItem onClick={() => {
          editGameModel({
            entityModels: {
              [entityModelId]: {
                isRemoved: !entityModel.isRemoved
              }
            },
          })
          onMenuItemClick()
        }}><ListItemIcon><Icon icon="faSquareMinus"/></ListItemIcon>{entityModel.isRemoved ? 'Restore' : 'Remove'}</MenuItem>
    </Unlockable>}
    {!insideEntityInstanceContextMenu && 
      <Unlockable interfaceId={ENTITY_MODEL_IMPORT_IID}>
        <MenuItem onClick={() => {
          editGameModel({
            entityModels: {
              [entityModelId]: {
                importedStageIds: {
                  [currentStageId] : !entityModel.importedStageIds[currentStageId]
                }
              }
            },
          })
          onMenuItemClick()
        }}>
          <ListItemIcon><Icon icon="faBoxArchive"/></ListItemIcon>
          {entityModel.importedStageIds[currentStageId] ? 'Unimport' : 'Import'}</MenuItem>
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
  openEditEntityDialog,
  openCreateCanvasImageDialog,
  openEntityBehaviorLiveEditor
})(EntityContextMenu);
