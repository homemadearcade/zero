/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { inIframe } from '../../../utils/webPageUtils';
import Drawer from '../../../ui/Drawer/Drawer';
import Icon from '../../../ui/Icon/Icon';
import Link from '../../../ui/Link/Link';
import './GameRoomDrawer.scss'
import GameRoomOverview from '../GameRoomOverview/GameRoomOverview';
import Tabs from '../../../ui/Tabs/Tabs';
import LobbyOverview from '../../../experience/lobbyInstance/LobbyOverview/LobbyOverview';
import Chatroom from '../../../experience/Chatroom/Chatroom';
import { LOBBY_DRAWER_CHATLOG_TAB_IID, LOBBY_DRAWER_GAME_ROOM_TAB_IID, LOBBY_DRAWER_ROLES_TAB_IID } from '../../../constants/interfaceIds';
import IconButton from '../../../ui/IconButton/IconButton';
import { toggleMinimizeCobrowsingCard } from '../../../store/actions/game/cobrowsingActions';

const GameRoomDrawer = ({
  cobrowsing: {
    isCobrowsingCardMinimized
  },
  myTracks,
  userTracks,
  toggleMinimizeCobrowsingCard
}) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    return <>
      <div className="GameRoomDrawer">
        {isCobrowsingCardMinimized && <IconButton icon="faWindowRestore" onClick={() => {
          toggleMinimizeCobrowsingCard(false)
        }} color="primary">
        </IconButton>}
        {!inIframe() && <div className="GameRoomDrawer__toggle" onClick={() => {
          setIsDrawerOpen(true)
        }}>
          <Icon icon="faBars"/>
        </div>}
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
  cobrowsing: state.cobrowsing,
});

export default compose(
  connect(mapStateToProps, { toggleMinimizeCobrowsingCard }),
)(GameRoomDrawer);
