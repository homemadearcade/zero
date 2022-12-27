import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

import { editGameModel } from '../../../store/actions/gameActions';
import ClassContextMenu from '../ClassContextMenu/ClassContextMenu';
import { getCurrentGameScene } from '../../../utils/editorUtils';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { HERO_INSTANCE_ID } from '../../constants';

const ObjectInstanceContextMenu = ({ editGameModel, classId, onMenuItemClick, objectId, webPage: { gameInstance }, game: { gameModel } }) => {
  return <>
    <MenuItem><strong>{gameModel.classes[classId].name}</strong></MenuItem>
    <Unlockable interfaceId="drag">
      <MenuItem onClick={() => {
        getCurrentGameScene(gameInstance).onDragStartContextMenu(objectId)
        onMenuItemClick()
      }}>Drag</MenuItem>
    </Unlockable>
    <Unlockable interfaceId="contextMenu/instance/resize">
      <MenuItem onClick={() => {
        getCurrentGameScene(gameInstance).onResizeStart(objectId)
        onMenuItemClick()
      }}>Resize</MenuItem>
    </Unlockable>
    {objectId !== HERO_INSTANCE_ID && <Unlockable interfaceId="contextMenu/instance/delete">
      <MenuItem onClick={() => {
        editGameModel({ objects: { [objectId]: null } })
        onMenuItemClick()
      }}>Delete</MenuItem>
    </Unlockable>}
    <ClassContextMenu onMenuItemClick={onMenuItemClick} classId={classId} insideObjectInstanceContextMenu />
  </>
};

const mapStateToProps = (state) => ({
  webPage: state.webPage,
  game: state.game
})

export default connect(mapStateToProps, { editGameModel })(ObjectInstanceContextMenu);
