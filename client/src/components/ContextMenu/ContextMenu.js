import React from 'react';
import { connect } from 'react-redux';

import { closeContextMenu } from '../../store/actions/interfaceActions';

import './ContextMenu.scss';

import Menu from '@mui/material/Menu';
import CoreObjectContextMenu from '../../game/CoreObjectContextMenu/CoreObjectContextMenu';

const ContextMenu = ({ closeContextMenu, interface: { contextMenuX, contextMenuY, interfaceState: { isContextMenuOpen } }}) => {  
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
  interface: state.interface
});

export default connect(mapStateToProps, { closeContextMenu })(ContextMenu);
