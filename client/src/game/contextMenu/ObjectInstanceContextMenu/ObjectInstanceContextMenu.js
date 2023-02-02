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

const ObjectInstanceContextMenu = ({ editGameModel, classId, onMenuItemClick, objectId, webPage: { gameInstance }, gameModel: { gameModel, currentStageId }, openClassNameModal, selectClass, openJsonViewer }) => {
  return <>
    <ContextMenuTitle onClick={() => {
      openClassNameModal(classId)
      onMenuItemClick()
    }}>{gameModel.classes[classId].name}</ContextMenuTitle>
    <Unlockable interfaceId="contextMenu/instance/move">
      <MenuItem onClick={() => {
        getCurrentGameScene(gameInstance).onDragStartContextMenu(objectId)
        onMenuItemClick()
      }}>Move</MenuItem>
    </Unlockable>
    {objectId !== PLAYER_INSTANCE_ID_PREFIX && <Unlockable interfaceId="contextMenu/instance/move">
      <MenuItem onClick={() => {
        selectClass(classId)
        onMenuItemClick()
      }}>Copy</MenuItem>
    </Unlockable>}
    <Unlockable interfaceId="contextMenu/instance/resize">
      <MenuItem onClick={() => {
        getCurrentGameScene(gameInstance).onResizeStart(objectId)
        onMenuItemClick()
      }}>Resize{objectId === PLAYER_INSTANCE_ID_PREFIX ? '' : ' All'}</MenuItem>
    </Unlockable>
    {objectId !== PLAYER_INSTANCE_ID_PREFIX && <Unlockable interfaceId="contextMenu/instance/delete">
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
    {<Unlockable adminOnly interfaceId="contextMenu/instance/viewInstanceJson">
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
