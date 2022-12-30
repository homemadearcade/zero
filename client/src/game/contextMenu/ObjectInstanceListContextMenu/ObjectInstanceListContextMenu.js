import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

import { editGameModel } from '../../../store/actions/gameModelActions';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { openContextMenuFromObjectInstanceId } from '../../../store/actions/contextMenuActions';

const ObjectInstanceListContextMenu = ({ openContextMenuFromObjectInstanceId, onMenuItemClick, selectableObjectInstances, gameModel: { gameModel }}) => {
  return <>
    {selectableObjectInstances.map(({objectId, classId}) => {
      const name = gameModel.classes[classId].name
      return <MenuItem key={objectId} onClick={(event) => {
        onMenuItemClick()
        openContextMenuFromObjectInstanceId(objectId, classId, event)
      }}>
        {name}
      </MenuItem>
    })}
  </>
};

const mapStateToProps = (state) => ({
  gameModel: state.gameModel,
})

export default connect(mapStateToProps, { editGameModel, openContextMenuFromObjectInstanceId })(ObjectInstanceListContextMenu);
