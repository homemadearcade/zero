import React from 'react';
import { connect } from 'react-redux';

import { closeContextMenu } from '../../../store/actions/editorActions';

import './ContextMenu.scss';

import Menu from '@mui/material/Menu';
import CoreObjectContextMenu from '../../../game/CoreObjectContextMenu/CoreObjectContextMenu';

const ContextMenu = ({ closeContextMenu, editor: { contextMenuX, contextMenuY, editorState: { isContextMenuOpen } }}) => {  
  function handleClose() {
    closeContextMenu()
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
      <CoreObjectContextMenu onMenuItemClick={handleClose}/>
    </Menu>
  );
}

const mapStateToProps = (state) => ({
  editor: state.editor
});

export default connect(mapStateToProps, { closeContextMenu })(ContextMenu);
