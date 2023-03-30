import React from 'react';
import { connect } from 'react-redux';

import { closeContextMenu } from '../../../store/actions/game/contextMenuActions';

import EntityInstanceContextMenu from '../EntityInstanceContextMenu/EntityInstanceContextMenu';
import ClassContextMenu from '../ClassContextMenu/ClassContextMenu';
import StageContextMenu from '../StageContextMenu/StageContextMenu';
import EntityInstanceListContextMenu from '../EntityInstanceListContextMenu/EntityInstanceListContextMenu';
import { PLAYER_INSTANCE_ID_PREFIX } from '../../constants';

const GameContextMenuBody = ({ selectableEntityInstances, entityInstanceIdSelectedContextMenu, entityClassIdSelectedContextMenu, closeContextMenu }) => { 
  if(selectableEntityInstances) {
    return <EntityInstanceListContextMenu selectableEntityInstances={selectableEntityInstances} onMenuItemClick={closeContextMenu}/>
  } else if(entityInstanceIdSelectedContextMenu) {
    return <EntityInstanceContextMenu onMenuItemClick={closeContextMenu} entityInstanceId={entityInstanceIdSelectedContextMenu} entityClassId={entityClassIdSelectedContextMenu} />
  } else if(entityClassIdSelectedContextMenu || entityInstanceIdSelectedContextMenu === PLAYER_INSTANCE_ID_PREFIX) {
    return <ClassContextMenu entityClassId={entityClassIdSelectedContextMenu} onMenuItemClick={closeContextMenu}/>
  }

  return <StageContextMenu onMenuItemClick={closeContextMenu}/>
}

const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, { closeContextMenu })(GameContextMenuBody);
