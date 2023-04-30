/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { inIframe } from '../../../utils/webPageUtils';
import Drawer from '../../../ui/Drawer/Drawer';
import Icon from '../../../ui/Icon/Icon';
import Link from '../../../ui/Link/Link';
import CobrowsingIndicator from '../../../experience/cobrowsing/CobrowsingIndicator/CobrowsingIndicator';
import './GameRoomDrawer.scss'
import GameRoomOverview from '../GameRoomOverview/GameRoomOverview';
import Tabs from '../../../ui/Tabs/Tabs';
import LobbyOverview from '../../../experience/lobbyInstance/LobbyOverview/LobbyOverview';
import ActivityTransitionToggle from '../../../experience/activity/ActivityTransitionToggle/ActivityTransitionToggle';
import LobbyDashboardToggle from '../../../experience/lobbyInstance/LobbyDashboardToggle/LobbyDashboardToggle';
import Chatroom from '../../../experience/Chatroom/Chatroom';
import { LOBBY_DRAWER_CHATLOG_TAB_IID, LOBBY_DRAWER_GAME_ROOM_TAB_IID, LOBBY_DRAWER_ROLES_TAB_IID } from '../../../constants/interfaceIds';

const GameRoomDrawer = ({
  lobbyInstance: { lobbyInstance },
  myTracks,
  userTracks,
}) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    return <>
      <div className="GameRoomDrawer">
        {!inIframe() && <div className="GameRoomDrawer__toggle" onClick={() => {
          setIsDrawerOpen(true)
        }}>
          <Icon icon="faBars"/>
        </div>}
        <LobbyDashboardToggle/>
        <CobrowsingIndicator/>
        <ActivityTransitionToggle/>
      </div>
      <Drawer anchor="right" isOpen={isDrawerOpen} onClose={() => 
        setIsDrawerOpen(false)
      }>
        <div className="GameRoomDrawer__drawer">
          <Tabs className="GameRoomDrawer__tabs" tabs={[
            {
              interfaceId: LOBBY_DRAWER_GAME_ROOM_TAB_IID,
              label: 'Game',
              body: <GameRoomOverview myTracks={myTracks} userTracks={userTracks}/>
            },
            {
              interfaceId: LOBBY_DRAWER_CHATLOG_TAB_IID,
              label: 'Chatlog',
              body: <div className="LobbyDashboard__chatroom">
                <Chatroom myTracks={myTracks} userTracks={userTracks} />
              </div>
            },
            {
              interfaceId: LOBBY_DRAWER_ROLES_TAB_IID,
              label: 'Roles',
              body: <>
                <LobbyOverview myTracks={myTracks} userTracks={userTracks}></LobbyOverview>
                <Link to="/lobbys">Exit Lobby</Link>
              </>
            },
          ]} />
        </div>
      </Drawer>
    </>
};

const mapStateToProps = (state) => ({
  lobbyInstance: state.lobbyInstance,
});

export default compose(
  connect(mapStateToProps, { }),
)(GameRoomDrawer);
