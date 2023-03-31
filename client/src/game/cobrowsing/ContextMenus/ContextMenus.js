import React from 'react';
import { connect } from 'react-redux';
import GameContextMenuBody from '../../../game/contextMenu/GameContextMenuBody/GameContextMenuBody';

import './ContextMenus.scss'
import ContextMenu from '../../../ui/connected/ContextMenu/ContextMenu';
import Unlockable from '../Unlockable/Unlockable';
import { CONTEXT_MENU_CONTAINER_IID } from '../../../constants/interfaceIds';

const ContextMenus = ({ contextMenu, remoteContextMenu, cobrowsing : { isActivelyCobrowsing }}) => {  

  function renderContextMenus() {
    const contextMenus = []

    if(contextMenu.isContextMenuOpen) {
      const { isContextMenuOpen, entityInstanceIdSelectedContextMenu, entityModelIdSelectedContextMenu, selectableEntityInstances, contextMenuX, contextMenuY } = contextMenu
  
      contextMenus.push(<ContextMenu  key="contextmenu"  contextMenuX={contextMenuX} contextMenuY={contextMenuY} isOpen={isContextMenuOpen}>
        <GameContextMenuBody entityInstanceIdSelectedContextMenu={entityInstanceIdSelectedContextMenu} entityModelIdSelectedContextMenu={entityModelIdSelectedContextMenu} selectableEntityInstances={selectableEntityInstances}/>
      </ContextMenu>)
    }
  
    // the only thing this does could be 1) shows you that you didnt open the menu 2) position it based on their screen...
    // if(isActivelyCobrowsing && remoteContextMenu.isContextMenuOpen) {
    //   const { isContextMenuOpen, entityInstanceIdSelectedContextMenu, entityModelIdSelectedContextMenu, selectableEntityInstances, contextMenuX, contextMenuY} = remoteContextMenu
  
    //   // need to calculate contextMenuX percent because... its not perfect
    //   contextMenus.push(<ContextMenu key="contextmenu" contextMenuX={contextMenuX} contextMenuY={contextMenuY} isOpen={isContextMenuOpen}>
    //     <div className="ContextMenus__remote-menu">
    //       <GameContextMenuBody entityInstanceIdSelectedContextMenu={entityInstanceIdSelectedContextMenu} entityModelIdSelectedContextMenu={entityModelIdSelectedContextMenu} selectableEntityInstances={selectableEntityInstances}/>
    //     </div>
    //   </ContextMenu>)
    // }

    return <>
      {contextMenus}
    </>
  }
  
  return <Unlockable interfaceId={CONTEXT_MENU_CONTAINER_IID}>
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
