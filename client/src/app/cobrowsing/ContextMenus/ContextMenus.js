import React from 'react';
import { connect } from 'react-redux';
import GameContextMenuBody from '../../../game/ui/GameContextMenuBody/GameContextMenuBody';

import './ContextMenus.scss'
import ContextMenu from '../../ui/ContextMenu/ContextMenu';
import Unlockable from '../Unlockable/Unlockable';
const ContextMenus = ({ contextMenu, remoteContextMenu}) => {  

  function renderContextMenus() {
    if(contextMenu.isContextMenuOpen) {
      const { isContextMenuOpen, objectIdSelectedContextMenu, classIdSelectedContextMenu, contextMenuX, contextMenuY } = contextMenu
  
      return <ContextMenu contextMenuX={contextMenuX} contextMenuY={contextMenuY} isOpen={isContextMenuOpen}>
        <Unlockable interfaceId="contextMenu">
          <GameContextMenuBody objectIdSelectedContextMenu={objectIdSelectedContextMenu} classIdSelectedContextMenu={classIdSelectedContextMenu}/>
        </Unlockable>
      </ContextMenu>
    }
  
    // the only thing this does could be 1) shows you that you didnt open the menu 2) position it based on their screen...
    if(remoteContextMenu.isContextMenuOpen) {
      const { isContextMenuOpen, objectIdSelectedContextMenu, classIdSelectedContextMenu, contextMenuX, contextMenuY } = remoteContextMenu
  
      // need to calculate contextMenuX percent because... its not perfect
      return <ContextMenu contextMenuX={contextMenuX} contextMenuY={contextMenuY} isOpen={isContextMenuOpen}>
        <Unlockable interfaceId="contextMenu">
          <div className="ContextMenus__remote-menu">
            <GameContextMenuBody objectIdSelectedContextMenu={objectIdSelectedContextMenu} classIdSelectedContextMenu={classIdSelectedContextMenu}/>
          </div>
        </Unlockable>
      </ContextMenu>
    }
  }

  return renderContextMenus()
}

/// context menu state is passed to the subscriber, but it isnt mapped to cobrowsing state, it must be accessed directly
const mapStateToProps = (state) => ({
  contextMenu: state.contextMenu,
  remoteContextMenu: state.cobrowsing.remoteState.contextMenu,
})

export default connect(mapStateToProps, { })(ContextMenus);
