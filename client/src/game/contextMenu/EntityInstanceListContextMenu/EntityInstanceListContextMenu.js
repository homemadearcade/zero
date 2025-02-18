import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

import { editGameModel } from '../../../store/actions/game/gameModelActions';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { openContextMenuFromEntityInstanceId } from '../../../store/actions/game/contextMenuActions';
import { ListItemIcon } from '@mui/material';
import Icon from '../../../ui/Icon/Icon';

const EntityInstanceListContextMenu = ({ openContextMenuFromEntityInstanceId, onMenuItemClick, selectableEntityInstances, gameModel: { gameModel }}) => {
  return <>
    {selectableEntityInstances.map(({entityInstanceId, entityModelId, effectSpawned }) => {
      const name = gameModel.entityModels[entityModelId].name
      return <MenuItem key={entityInstanceId} onClick={(event) => {
        onMenuItemClick()
        openContextMenuFromEntityInstanceId({entityInstanceId, entityModelId, effectSpawned }, event)
      }}>
        <ListItemIcon><Icon icon="faArrowPointer"/></ListItemIcon> 
        {name}
      </MenuItem>
    })}
  </>
};

const mapStateToProps = (state) => ({
  gameModel: state.gameModel,
})

export default connect(mapStateToProps, { editGameModel, openContextMenuFromEntityInstanceId })(EntityInstanceListContextMenu);
