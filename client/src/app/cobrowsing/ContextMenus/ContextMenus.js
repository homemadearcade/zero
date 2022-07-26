import React from 'react';
import { connect } from 'react-redux';
import GameContextMenuBody from '../../../game/ui/GameContextMenuBody/GameContextMenuBody';

import './ContextMenus.scss'
import ContextMenu from '../../ui/ContextMenu/ContextMenu';

const ContextMenus = ({ contextMenu, remoteContextMenu}) => {  
  if(contextMenu.isContextMenuOpen) {
    const { isContextMenuOpen, objectIdSelectedContextMenu, classIdSelectedContextMenu, contextMenuX, contextMenuY } = contextMenu

    return <ContextMenu contextMenuX={contextMenuX} contextMenuY={contextMenuY} isOpen={isContextMenuOpen}>
      <GameContextMenuBody objectIdSelectedContextMenu={objectIdSelectedContextMenu} classIdSelectedContextMenu={classIdSelectedContextMenu}/>
    </ContextMenu>
  }

  if(remoteContextMenu.isContextMenuOpen) {
    const { isContextMenuOpen, objectIdSelectedContextMenu, classIdSelectedContextMenu, contextMenuX, contextMenuY } = remoteContextMenu

    // need to calculate contextMenuX percent because... its not perfect
    return <ContextMenu contextMenuX={contextMenuX} contextMenuY={contextMenuY} isOpen={isContextMenuOpen}>
      <div className="ContextMenus__remote-menu">
        <GameContextMenuBody objectIdSelectedContextMenu={objectIdSelectedContextMenu} classIdSelectedContextMenu={classIdSelectedContextMenu}/>
      </div>
    </ContextMenu>
  }
}

const mapStateToProps = (state) => ({
  contextMenu: state.contextMenu,
  remoteContextMenu: state.cobrowsing.remoteState.contextMenu
})

export default connect(mapStateToProps, { })(ContextMenus);
