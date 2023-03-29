import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

import { editGameModel } from '../../../store/actions/gameModelActions';
import ClassContextMenu from '../ClassContextMenu/ClassContextMenu';
import { getCurrentGameScene } from '../../../utils/editorUtils';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { initialCameraZoneClassId, PLAYER_INSTANCE_ID_PREFIX } from '../../constants';
import ContextMenuTitle from '../../../ui/ContextMenuTitle/ContextMenuTitle';
import { selectClass, openJsonViewer } from '../../../store/actions/gameSelectorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { CONTEXT_MENU_INSTANCE_DELETE_IID, CONTEXT_MENU_INSTANCE_JSON_IID, CONTEXT_MENU_INSTANCE_MOVE_IID, CONTEXT_MENU_INSTANCE_RESIZE_CLASS_IID, CONTEXT_MENU_INSTANCE_SELECT_CLASS_IID } from '../../../constants/interfaceIds';
import { openEditClassModal } from '../../../store/actions/gameFormEditorActions';

const EntityInstanceContextMenu = ({ editGameModel, entityClassId, onMenuItemClick, entityInstanceId, webPage: { gameInstance }, gameModel: { gameModel, currentStageId }, openEditClassModal, selectClass, openJsonViewer }) => {

  if(entityClassId === initialCameraZoneClassId) {
    return <Unlockable interfaceId={CONTEXT_MENU_INSTANCE_RESIZE_CLASS_IID}>
      <MenuItem onClick={() => {
        getCurrentGameScene(gameInstance).onResizeStart(entityInstanceId)
        onMenuItemClick()
      }}>Resize</MenuItem>
    </Unlockable>
  }

  return <>
    <ContextMenuTitle onClick={() => {
      openEditClassModal(gameModel.entityClasses[entityClassId])
      onMenuItemClick()
    }}>{gameModel.entityClasses[entityClassId].name}</ContextMenuTitle>
    <Unlockable interfaceId={CONTEXT_MENU_INSTANCE_MOVE_IID}>
      <MenuItem onClick={() => {
        getCurrentGameScene(gameInstance).onDragStartContextMenu(entityInstanceId)
        onMenuItemClick()
      }}>Move</MenuItem>
    </Unlockable>
    {entityInstanceId !== PLAYER_INSTANCE_ID_PREFIX && <Unlockable interfaceId={CONTEXT_MENU_INSTANCE_SELECT_CLASS_IID}>
      <MenuItem onClick={() => {
        selectClass(entityClassId)
        onMenuItemClick()
      }}>Copy</MenuItem>
    </Unlockable>}
    <Unlockable interfaceId={CONTEXT_MENU_INSTANCE_RESIZE_CLASS_IID}>
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
          transformEntityClassId: entityInstance.transformEntityClassId,
          destroyAfterUpdate: entityInstance.destroyAfterUpdate,
          entityInstanceId: entityInstance.entityInstanceId,
          entityClassId: entityInstance.entityClassId,
        }

        openJsonViewer(json)
        onMenuItemClick()
      }}>View Json</MenuItem>
    </Unlockable>}
    <ClassContextMenu onMenuItemClick={onMenuItemClick} entityClassId={entityClassId} insideEntityInstanceContextMenu />
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  webPage: state.webPage,
  gameModel: state.gameModel,
})

export default connect(mapStateToProps, { editGameModel, openEditClassModal, selectClass, openJsonViewer })(EntityInstanceContextMenu);
