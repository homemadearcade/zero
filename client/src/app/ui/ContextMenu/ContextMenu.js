import React from 'react';
import { connect } from 'react-redux';

import { closeContextMenu } from '../../../store/actions/contextMenuActions';

import './ContextMenu.scss';

import Menu from '@mui/material/Menu';
import ObjectInstanceContextMenu from '../../../game/ObjectInstanceContextMenu/ObjectInstanceContextMenu';
import ClassContextMenu from '../../../game/ClassContextMenu/ClassContextMenu';
import WorldContextMenu from '../../../game/WorldContextMenu/WorldContextMenu';
import { HERO_INSTANCE_ID } from '../../../constants';

const ContextMenu = ({ closeContextMenu, contextMenu: { contextMenuX, contextMenuY, isContextMenuOpen, objectIdSelectedContextMenu, classIdSelectedContextMenu } }) => {  
  function handleClose() {
    closeContextMenu()
  }

  function _renderBody() {
    if(classIdSelectedContextMenu || objectIdSelectedContextMenu === HERO_INSTANCE_ID) {
      return <ClassContextMenu classId={classIdSelectedContextMenu} onMenuItemClick={handleClose}/>
    } else if(objectIdSelectedContextMenu) {
        return <ObjectInstanceContextMenu onMenuItemClick={handleClose} objectId={objectIdSelectedContextMenu} />
  } else {
      return <WorldContextMenu onMenuItemClick={handleClose}/>
    }
  }

  return (
     <>
      <Menu
        open={isContextMenuOpen}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          isContextMenuOpen
            ? { top: contextMenuY, left: contextMenuX }
            : undefined
        }
      >
        {_renderBody()}
      </Menu>
    </>
  )
}

const mapStateToProps = (state) => ({
  contextMenu: state.contextMenu
})

export default connect(mapStateToProps, { closeContextMenu })(ContextMenu);
