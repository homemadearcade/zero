import React from 'react';
import { connect } from 'react-redux';

import { closeContextMenu } from '../../../store/actions/contextMenuActions';

import ObjectInstanceContextMenu from '../ObjectInstanceContextMenu/ObjectInstanceContextMenu';
import ClassContextMenu from '../ClassContextMenu/ClassContextMenu';
import StageContextMenu from '../StageContextMenu/StageContextMenu';
import ObjectInstanceListContextMenu from '../ObjectInstanceListContextMenu/ObjectInstanceListContextMenu';
import { PLAYER_INSTANCE_ID_PREFIX } from '../../constants';

const GameContextMenuBody = ({ selectableObjectInstances, instanceIdSelectedContextMenu, classIdSelectedContextMenu, closeContextMenu }) => { 
  if(selectableObjectInstances) {
    return <ObjectInstanceListContextMenu selectableObjectInstances={selectableObjectInstances} onMenuItemClick={closeContextMenu}/>
  } else if(instanceIdSelectedContextMenu) {
    return <ObjectInstanceContextMenu onMenuItemClick={closeContextMenu} objectId={instanceIdSelectedContextMenu} classId={classIdSelectedContextMenu} />
  } else if(classIdSelectedContextMenu || instanceIdSelectedContextMenu === PLAYER_INSTANCE_ID_PREFIX) {
    return <ClassContextMenu classId={classIdSelectedContextMenu} onMenuItemClick={closeContextMenu}/>
  }

  return <StageContextMenu onMenuItemClick={closeContextMenu}/>
}

const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, { closeContextMenu })(GameContextMenuBody);
