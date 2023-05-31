import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

import { editGameModel } from '../../../store/actions/game/gameModelActions';
import EntityContextMenu from '../EntityContextMenu/EntityContextMenu';
import { getCurrentGameScene } from '../../../utils/editorUtils';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { initialCameraZoneEntityId, PLAYER_INSTANCE_DID } from '../../constants';
import ContextMenuTitle from '../../../ui/ContextMenuTitle/ContextMenuTitle';
import { selectEntity, openJsonViewer } from '../../../store/actions/game/gameSelectorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { ENTITY_INSTANCE_DELETE_IID, ENTITY_INSTANCE_JSON_IID, ENTITY_INSTANCE_MOVE_IID, ENTITY_INSTANCE_RESIZE_ENTITY_IID, ENTITY_INSTANCE_SELECT_ENTITY_IID } from '../../../constants/interfaceIds';
import { openEditEntityDialog } from '../../../store/actions/game/gameFormEditorActions';
import { setResizingEntityInstance } from '../../../store/actions/game/gameViewEditorActions';
import Icon from '../../../ui/Icon/Icon';
import { ListItemIcon } from '@mui/material';

const EntityInstanceContextMenu = ({ 
  editGameModel, 
  entityModelId, 
  entityEffectSpawned,
  onMenuItemClick,
  entityInstanceId, webPage: { gameInstance }, 
  gameModel: { gameModel, currentStageId }, 
  openEditEntityDialog, 
  selectEntity, 
  openJsonViewer,
  setResizingEntityInstance
}) => {
  const entityInstanceData = gameModel.stages[currentStageId].entityInstances[entityInstanceId]

  const hasInstanceBeenResized = !!(entityInstanceData?.width || entityInstanceData?.height)

  if(entityEffectSpawned) {
    return <>
      <ContextMenuTitle onClick={() => {
      openEditEntityDialog(gameModel.entityModels[entityModelId])
      onMenuItemClick()
    }}>{gameModel.entityModels[entityModelId].name} (Spawned)</ContextMenuTitle>
      <MenuItem onClick={() => {
        onMenuItemClick()
      }}>
        Spawned objects cannot be edited
      </MenuItem>
    </>
  }


  return <>
    <ContextMenuTitle onClick={() => {
      openEditEntityDialog(gameModel.entityModels[entityModelId])
      onMenuItemClick()
    }}>{gameModel.entityModels[entityModelId].name}</ContextMenuTitle>
    <Unlockable interfaceId={ENTITY_INSTANCE_MOVE_IID}>
      <MenuItem onClick={() => {
        getCurrentGameScene(gameInstance).onDragStartContextMenu(entityInstanceId)
        onMenuItemClick()
      }}>
        <ListItemIcon><Icon icon="faUpDownLeftRight"/></ListItemIcon>
        Move
      </MenuItem>
    </Unlockable>
    {entityInstanceId !== PLAYER_INSTANCE_DID && <Unlockable interfaceId={ENTITY_INSTANCE_SELECT_ENTITY_IID}>
      <MenuItem onClick={() => {
        selectEntity(entityModelId, entityInstanceId)
        onMenuItemClick()
      }}>
        <ListItemIcon><Icon icon="faCopy"/></ListItemIcon>
        Copy
      </MenuItem>
    </Unlockable>}
    <Unlockable interfaceId={ENTITY_INSTANCE_RESIZE_ENTITY_IID}>
      <MenuItem onClick={() => {
        setResizingEntityInstance(entityInstanceId)
        onMenuItemClick()
      }}><ListItemIcon><Icon icon="faUpRightAndDownLeftFromCenter"/></ListItemIcon>Resize</MenuItem>
    </Unlockable>
    <Unlockable interfaceId={ENTITY_INSTANCE_RESIZE_ENTITY_IID}>
      <MenuItem disabled={hasInstanceBeenResized} onClick={() => {
        setResizingEntityInstance(entityInstanceId, entityModelId)
        onMenuItemClick()
      }}><ListItemIcon><Icon icon="faUpRightAndDownLeftFromCenter"/></ListItemIcon>Resize All</MenuItem>
    </Unlockable>
    {entityInstanceId !== PLAYER_INSTANCE_DID && <Unlockable interfaceId={ENTITY_INSTANCE_DELETE_IID}>
      <MenuItem onClick={() => {
        editGameModel({ 
          stages: {
            [currentStageId] : {
              entityInstances: { [entityInstanceId]: null } 
            }
          }
        })
        onMenuItemClick()
      }}><ListItemIcon><Icon icon="faTrash"/></ListItemIcon>Delete</MenuItem>
    </Unlockable>}
    {false && <Unlockable interfaceId={ENTITY_INSTANCE_JSON_IID}>
      <MenuItem onClick={() => {
        const entityInstance = getCurrentGameScene(gameInstance).getEntityInstance(entityInstanceId)
        const json = {
          x: entityInstance.phaserInstance.x,
          y: entityInstance.phaserInstance.y, 
          transformEntityModelId: entityInstance.transformEntityModelId,
          transformCancelEntityModelId: entityInstance.transformCancelEntityModelId,
          destroyAfterUpdate: entityInstance.destroyAfterUpdate,
          entityInstanceId: entityInstance.entityInstanceId,
          entityModelId: entityInstance.entityModelId,
        }

        openJsonViewer(json)
        onMenuItemClick()
      }}>View Json</MenuItem>
    </Unlockable>}
    <EntityContextMenu onMenuItemClick={onMenuItemClick} entityModelId={entityModelId} insideEntityInstanceContextMenu />
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  webPage: state.webPage,
  gameModel: state.gameModel,
})

export default connect(mapStateToProps, { editGameModel, openEditEntityDialog, selectEntity, openJsonViewer, setResizingEntityInstance })(EntityInstanceContextMenu);
