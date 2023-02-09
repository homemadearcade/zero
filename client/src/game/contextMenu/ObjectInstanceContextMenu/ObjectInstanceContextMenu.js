import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

import { editGameModel } from '../../../store/actions/gameModelActions';
import ClassContextMenu from '../ClassContextMenu/ClassContextMenu';
import { getCurrentGameScene } from '../../../utils/editorUtils';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { PLAYER_INSTANCE_ID_PREFIX } from '../../constants';
import ContextMenuTitle from '../../../ui/ContextMenuTitle/ContextMenuTitle';
import { openClassNameModal, selectClass, openJsonViewer } from '../../../store/actions/gameEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { CONTEXT_MENU_INSTANCE_DELETE_IID, CONTEXT_MENU_INSTANCE_JSON_IID, CONTEXT_MENU_INSTANCE_MOVE_IID, CONTEXT_MENU_INSTANCE_RESIZE_CLASS_IID, CONTEXT_MENU_INSTANCE_SELECT_CLASS_IID } from '../../../constants/interfaceIds';

const ObjectInstanceContextMenu = ({ editGameModel, classId, onMenuItemClick, objectId, webPage: { gameInstance }, gameModel: { gameModel, currentStageId }, openClassNameModal, selectClass, openJsonViewer }) => {
  return <>
    <ContextMenuTitle onClick={() => {
      openClassNameModal(classId)
      onMenuItemClick()
    }}>{gameModel.classes[classId].name}</ContextMenuTitle>
    <Unlockable interfaceId={CONTEXT_MENU_INSTANCE_MOVE_IID}>
      <MenuItem onClick={() => {
        getCurrentGameScene(gameInstance).onDragStartContextMenu(objectId)
        onMenuItemClick()
      }}>Move</MenuItem>
    </Unlockable>
    {objectId !== PLAYER_INSTANCE_ID_PREFIX && <Unlockable interfaceId={CONTEXT_MENU_INSTANCE_SELECT_CLASS_IID}>
      <MenuItem onClick={() => {
        selectClass(classId)
        onMenuItemClick()
      }}>Copy</MenuItem>
    </Unlockable>}
    <Unlockable interfaceId={CONTEXT_MENU_INSTANCE_RESIZE_CLASS_IID}>
      <MenuItem onClick={() => {
        getCurrentGameScene(gameInstance).onResizeStart(objectId)
        onMenuItemClick()
      }}>Resize{objectId === PLAYER_INSTANCE_ID_PREFIX ? '' : ' All'}</MenuItem>
    </Unlockable>
    {objectId !== PLAYER_INSTANCE_ID_PREFIX && <Unlockable interfaceId={CONTEXT_MENU_INSTANCE_DELETE_IID}>
      <MenuItem onClick={() => {
        editGameModel({ 
          stages: {
            [currentStageId] : {
              objects: { [objectId]: null } 
            }
          }
        })
        onMenuItemClick()
      }}>Delete</MenuItem>
    </Unlockable>}
    {<Unlockable adminOnly interfaceId={CONTEXT_MENU_INSTANCE_JSON_IID}>
      <MenuItem onClick={() => {
        openJsonViewer(getCurrentGameScene(gameInstance).getObjectInstance(objectId))
      }}>View Json</MenuItem>
    </Unlockable>}
    <ClassContextMenu onMenuItemClick={onMenuItemClick} classId={classId} insideObjectInstanceContextMenu />
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  webPage: state.webPage,
  gameModel: state.gameModel,
})

export default connect(mapStateToProps, { editGameModel, openClassNameModal, selectClass, openJsonViewer })(ObjectInstanceContextMenu);
