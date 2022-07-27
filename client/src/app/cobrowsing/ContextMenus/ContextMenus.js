import React from 'react';
import { connect } from 'react-redux';
import GameContextMenuBody from '../../../game/ui/GameContextMenuBody/GameContextMenuBody';

import './ContextMenus.scss'
import ContextMenu from '../../ui/ContextMenu/ContextMenu';
import { isInterfaceIdUnlocked, mapCobrowsingState } from '../../../utils/cobrowsing';
// import { MenuItem } from '@mui/material';
// import { unlockInterfaceId } from '../../../store/actions/unlockableInterfaceActions';

const ContextMenus = ({ contextMenu, remoteContextMenu, unlockableInterfaceIds, cobrowsing: { isSubscribedCobrowsing }, lobby: { lobby } , auth: { me }}) => {  

  if(me?.role !== 'ADMIN' && lobby.id && !isInterfaceIdUnlocked('contextMenu', unlockableInterfaceIds)) {
    if(!isSubscribedCobrowsing) return
  }

  //   const { isContextMenuOpen, objectIdSelectedContextMenu, classIdSelectedContextMenu, contextMenuX, contextMenuY } = contextMenu

  //   return <ContextMenu  contextMenuX={contextMenuX} contextMenuY={contextMenuY} isOpen={isContextMenuOpen}>
  //     <GameContextMenuBody objectIdSelectedContextMenu={objectIdSelectedContextMenu} classIdSelectedContextMenu={classIdSelectedContextMenu}/>
  //   </ContextMenu>
  // }

  if(contextMenu.isContextMenuOpen) {
    const { isContextMenuOpen, objectIdSelectedContextMenu, classIdSelectedContextMenu, contextMenuX, contextMenuY } = contextMenu

    return <ContextMenu contextMenuX={contextMenuX} contextMenuY={contextMenuY} isOpen={isContextMenuOpen}>
      <GameContextMenuBody objectIdSelectedContextMenu={objectIdSelectedContextMenu} classIdSelectedContextMenu={classIdSelectedContextMenu}/>
    </ContextMenu>
  }

  // the only thing this does could be 1) shows you that you didnt open the menu 2) position it based on their screen...
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

const mapStateToProps = (state) => mapCobrowsingState(state, {
  contextMenu: state.contextMenu,
  remoteContextMenu: state.cobrowsing.remoteState.contextMenu,
  unlockableInterfaceIds: state.unlockableInterfaceIds,
  cobrowsing: state.cobrowsing,
  lobby: state.lobby,
  auth: state.auth
})

export default connect(mapStateToProps, { })(ContextMenus);
