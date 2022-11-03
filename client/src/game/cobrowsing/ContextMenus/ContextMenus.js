import React from 'react';
import { connect } from 'react-redux';
import GameContextMenuBody from '../../../game/contextMenu/GameContextMenuBody/GameContextMenuBody';

import './ContextMenus.scss'
import ContextMenu from '../../../ui/connected/ContextMenu/ContextMenu';
import Unlockable from '../Unlockable/Unlockable';

const ContextMenus = ({ contextMenu, remoteContextMenu, cobrowsing : { isCurrentlyCobrowsing }}) => {  

  function renderContextMenus() {
    const contextMenus = []

    if(contextMenu.isContextMenuOpen) {
      const { isContextMenuOpen, objectIdSelectedContextMenu, classIdSelectedContextMenu, selectableObjectInstances, contextMenuX, contextMenuY } = contextMenu
  
      contextMenus.push(<ContextMenu  key="contextmenu"  contextMenuX={contextMenuX} contextMenuY={contextMenuY} isOpen={isContextMenuOpen}>
        <GameContextMenuBody objectIdSelectedContextMenu={objectIdSelectedContextMenu} classIdSelectedContextMenu={classIdSelectedContextMenu} selectableObjectInstances={selectableObjectInstances}/>
      </ContextMenu>)
    }
  
    // the only thing this does could be 1) shows you that you didnt open the menu 2) position it based on their screen...
    if(isCurrentlyCobrowsing && remoteContextMenu.isContextMenuOpen) {
      const { isContextMenuOpen, objectIdSelectedContextMenu, classIdSelectedContextMenu, selectableObjectInstances, contextMenuX, contextMenuY} = remoteContextMenu
  
      // need to calculate contextMenuX percent because... its not perfect
      contextMenus.push(<ContextMenu key="contextmenu" contextMenuX={contextMenuX} contextMenuY={contextMenuY} isOpen={isContextMenuOpen}>
        <div className="ContextMenus__remote-menu">
          <GameContextMenuBody objectIdSelectedContextMenu={objectIdSelectedContextMenu} classIdSelectedContextMenu={classIdSelectedContextMenu} selectableObjectInstances={selectableObjectInstances}/>
        </div>
      </ContextMenu>)
    }

    return <>
      {contextMenus}
    </>
  }
  
  return <Unlockable interfaceId="contextMenu/*" hideIfObscured hideLockToggle>
    {renderContextMenus()}
  </Unlockable>
}

/// context menu state is passed to the subscriber, but it isnt mapped to cobrowsing state, it must be accessed directly
const mapStateToProps = (state) => ({
  contextMenu: state.contextMenu,
  remoteContextMenu: state.cobrowsing.remoteState.contextMenu,
  cobrowsing: state.cobrowsing
})

export default connect(mapStateToProps, { })(ContextMenus);
