import React from 'react';
import { connect } from 'react-redux';

import { closeContextMenu } from '../../../store/actions/contextMenuActions';

import ObjectInstanceContextMenu from '../ObjectInstanceContextMenu/ObjectInstanceContextMenu';
import ClassContextMenu from '../ClassContextMenu/ClassContextMenu';
import StageContextMenu from '../StageContextMenu/StageContextMenu';
import ObjectInstanceListContextMenu from '../ObjectInstanceListContextMenu/ObjectInstanceListContextMenu';
import { PLAYER_INSTANCE_ID_PREFIX } from '../../constants';

const GameContextMenuBody = ({ selectableObjectInstances, objectIdSelectedContextMenu, classIdSelectedContextMenu, closeContextMenu }) => { 
  if(selectableObjectInstances) {
    return <ObjectInstanceListContextMenu selectableObjectInstances={selectableObjectInstances} onMenuItemClick={closeContextMenu}/>
  } else if(objectIdSelectedContextMenu) {
    return <ObjectInstanceContextMenu onMenuItemClick={closeContextMenu} objectId={objectIdSelectedContextMenu} classId={classIdSelectedContextMenu} />
  } else if(classIdSelectedContextMenu || objectIdSelectedContextMenu === PLAYER_INSTANCE_ID_PREFIX) {
    return <ClassContextMenu classId={classIdSelectedContextMenu} onMenuItemClick={closeContextMenu}/>
  }

  return <StageContextMenu onMenuItemClick={closeContextMenu}/>
}

const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, { closeContextMenu })(GameContextMenuBody);
