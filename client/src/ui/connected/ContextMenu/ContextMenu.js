import React from 'react';
import { connect } from 'react-redux';

import { closeContextMenu } from '../../../store/actions/game/contextMenuActions';

import './ContextMenu.scss';

import Menu from '@mui/material/Menu';

const ContextMenu = ({ closeContextMenu, contextMenuX, contextMenuY, isOpen, children }) => {  
  return (
    <Menu
      open={isOpen}
      onClose={closeContextMenu}
      anchorReference="anchorPosition"
      anchorPosition={
        isOpen
          ? { top: contextMenuY, left: contextMenuX }
          : undefined
      }
    >
      <div className="ContextMenu">{children}</div>
    </Menu>
  )
}

const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, { closeContextMenu })(ContextMenu);
