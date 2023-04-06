import React from 'react';
import { connect } from 'react-redux';

import { closeContextMenu } from '../../../store/actions/game/contextMenuActions';

import EntityInstanceContextMenu from '../EntityInstanceContextMenu/EntityInstanceContextMenu';
import EntityContextMenu from '../EntityContextMenu/EntityContextMenu';
import StageContextMenu from '../StageContextMenu/StageContextMenu';
import EntityInstanceListContextMenu from '../EntityInstanceListContextMenu/EntityInstanceListContextMenu';
import { PLAYER_INSTANCE_DID } from '../../constants';

const GameContextMenuBody = ({ selectableEntityInstances, entityInstanceIdSelectedContextMenu, entityModelIdSelectedContextMenu, closeContextMenu }) => { 
  if(selectableEntityInstances) {
    return <EntityInstanceListContextMenu selectableEntityInstances={selectableEntityInstances} onMenuItemClick={closeContextMenu}/>
  } else if(entityInstanceIdSelectedContextMenu) {
    return <EntityInstanceContextMenu onMenuItemClick={closeContextMenu} entityInstanceId={entityInstanceIdSelectedContextMenu} entityModelId={entityModelIdSelectedContextMenu} />
  } else if(entityModelIdSelectedContextMenu || entityInstanceIdSelectedContextMenu === PLAYER_INSTANCE_DID) {
    return <EntityContextMenu entityModelId={entityModelIdSelectedContextMenu} onMenuItemClick={closeContextMenu}/>
  }

  return <StageContextMenu onMenuItemClick={closeContextMenu}/>
}

const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, { closeContextMenu })(GameContextMenuBody);
