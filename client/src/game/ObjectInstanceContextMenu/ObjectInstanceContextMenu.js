import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

import { editGameModel } from '../../store/actions/gameActions';
import ClassContextMenu from '../ClassContextMenu/ClassContextMenu';
import { getCurrentGameScene } from '../../utils/editorUtils';
import Unlockable from '../../app/cobrowsing/Unlockable/Unlockable';

const ObjectInstanceContextMenu = ({ editGameModel, classId, onMenuItemClick, objectId, webPage: { gameInstance }, game: { gameModel } }) => {
  return <>
    <MenuItem><strong>{gameModel.classes[classId].name}</strong></MenuItem>
    <Unlockable interfaceId="contextMenu/instance/resize">
      <MenuItem onClick={() => {
        getCurrentGameScene(gameInstance).onResizeStart(objectId)
        onMenuItemClick()
      }}>Resize</MenuItem>
    </Unlockable>
    <Unlockable interfaceId="contextMenu/instance/delete">
      <MenuItem onClick={() => {
        editGameModel({ objects: { [objectId]: null } })
        onMenuItemClick()
      }}>Delete</MenuItem>
    </Unlockable>
    <ClassContextMenu onMenuItemClick={onMenuItemClick} classId={classId} insideObjectInstanceContextMenu />
  </>
};

const mapStateToProps = (state) => ({
  webPage: state.webPage,
  game: state.game
})

export default connect(mapStateToProps, { editGameModel })(ObjectInstanceContextMenu);
