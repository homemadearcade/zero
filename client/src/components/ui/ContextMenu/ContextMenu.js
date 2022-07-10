import React from 'react';
import { connect } from 'react-redux';

import { closeContextMenu } from '../../../store/actions/editorActions';

import './ContextMenu.scss';

import Menu from '@mui/material/Menu';
import CoreObjectContextMenu from '../../../game/CoreObjectContextMenu/CoreObjectContextMenu';
import ClassContextMenu from '../../../game/ClassContextMenu/ClassContextMenu';
import WorldContextMenu from '../../../game/WorldContextMenu/WorldContextMenu';

const ContextMenu = ({ closeContextMenu, editor: { contextMenuX, contextMenuY, editorState: { isContextMenuOpen, objectSelectedIdContextMenu, classSelectedIdContextMenu } }}) => {  
  function handleClose() {
    closeContextMenu()
  }

  function _renderBody() {
    if(objectSelectedIdContextMenu) {
      return <CoreObjectContextMenu onMenuItemClick={handleClose}/>
    } else if(classSelectedIdContextMenu) {
      return <ClassContextMenu onMenuItemClick={handleClose}/>
    } else {
      return <WorldContextMenu onMenuItemClick={handleClose}/>
    }

  }

  return (
    <Menu
      open={isContextMenuOpen !== false}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={
        isContextMenuOpen !== false
          ? { top: contextMenuY, left: contextMenuX }
          : undefined
      }
    >
      {_renderBody()}
    </Menu>
  );
}

const mapStateToProps = (state) => ({
  editor: state.editor
});

export default connect(mapStateToProps, { closeContextMenu })(ContextMenu);
