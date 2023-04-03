import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

import { editGameModel } from '../../../store/actions/game/gameModelActions';
import EntityContextMenu from '../EntityContextMenu/EntityContextMenu';
import { getCurrentGameScene } from '../../../utils/editorUtils';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { initialCameraZoneEntityId, PLAYER_INSTANCE_ID_PREFIX } from '../../constants';
import ContextMenuTitle from '../../../ui/ContextMenuTitle/ContextMenuTitle';
import { selectEntity, openJsonViewer } from '../../../store/actions/game/gameSelectorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { CONTEXT_MENU_INSTANCE_DELETE_IID, CONTEXT_MENU_INSTANCE_JSON_IID, CONTEXT_MENU_INSTANCE_MOVE_IID, CONTEXT_MENU_INSTANCE_RESIZE_ENTITY_IID, CONTEXT_MENU_INSTANCE_SELECT_ENTITY_IID } from '../../../constants/interfaceIds';
import { openEditEntityDialog } from '../../../store/actions/game/gameFormEditorActions';

const EntityInstanceContextMenu = ({ editGameModel, entityModelId, onMenuItemClick, entityInstanceId, webPage: { gameInstance }, gameModel: { gameModel, currentStageId }, openEditEntityDialog, selectEntity, openJsonViewer }) => {
  if(entityModelId === initialCameraZoneEntityId) {
    return <Unlockable interfaceId={CONTEXT_MENU_INSTANCE_RESIZE_ENTITY_IID}>
      <MenuItem onClick={() => {
        getCurrentGameScene(gameInstance).onResizeStart(entityInstanceId)
        onMenuItemClick()
      }}>Resize</MenuItem>
    </Unlockable>
  }

  return <>
    <ContextMenuTitle onClick={() => {
      openEditEntityDialog(gameModel.entityModels[entityModelId])
      onMenuItemClick()
    }}>{gameModel.entityModels[entityModelId].name}</ContextMenuTitle>
    <Unlockable interfaceId={CONTEXT_MENU_INSTANCE_MOVE_IID}>
      <MenuItem onClick={() => {
        getCurrentGameScene(gameInstance).onDragStartContextMenu(entityInstanceId)
        onMenuItemClick()
      }}>Move</MenuItem>
    </Unlockable>
    {entityInstanceId !== PLAYER_INSTANCE_ID_PREFIX && <Unlockable interfaceId={CONTEXT_MENU_INSTANCE_SELECT_ENTITY_IID}>
      <MenuItem onClick={() => {
        selectEntity(entityModelId)
        onMenuItemClick()
      }}>Copy</MenuItem>
    </Unlockable>}
    <Unlockable interfaceId={CONTEXT_MENU_INSTANCE_RESIZE_ENTITY_IID}>
      <MenuItem onClick={() => {
        getCurrentGameScene(gameInstance).onResizeStart(entityInstanceId)
        onMenuItemClick()
      }}>Resize{entityInstanceId === PLAYER_INSTANCE_ID_PREFIX ? '' : ' All'}</MenuItem>
    </Unlockable>
    {entityInstanceId !== PLAYER_INSTANCE_ID_PREFIX && <Unlockable interfaceId={CONTEXT_MENU_INSTANCE_DELETE_IID}>
      <MenuItem onClick={() => {
        editGameModel({ 
          stages: {
            [currentStageId] : {
              entityInstances: { [entityInstanceId]: null } 
            }
          }
        })
        onMenuItemClick()
      }}>Delete</MenuItem>
    </Unlockable>}
    {<Unlockable interfaceId={CONTEXT_MENU_INSTANCE_JSON_IID}>
      <MenuItem onClick={() => {
        const entityInstance = getCurrentGameScene(gameInstance).getEntityInstance(entityInstanceId)
        const json = {
          x: entityInstance.phaserInstance.x,
          y: entityInstance.phaserInstance.y, 
          transformEntityModelId: entityInstance.transformEntityModelId,
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

export default connect(mapStateToProps, { editGameModel, openEditEntityDialog, selectEntity, openJsonViewer })(EntityInstanceContextMenu);
