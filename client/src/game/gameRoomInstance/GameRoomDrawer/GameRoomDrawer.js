/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { inIframe } from '../../../utils/webPageUtils';
import Drawer from '../../../ui/Drawer/Drawer';
import Icon from '../../../ui/Icon/Icon';
import Link from '../../../ui/Link/Link';
import { GAME_ROOM_ACTIVITY } from '../../../constants';
import CobrowsingIndicator from '../../../experience/cobrowsing/CobrowsingIndicator/CobrowsingIndicator';
import Typography from '../../../ui/Typography/Typography';
import Switch from '../../../ui/Switch/Switch';
import './GameRoomDrawer.scss'
import { editGameRoom } from '../../../store/actions/game/gameRoomInstanceActions';
import GameRoomOverview from '../GameRoomOverview/GameRoomOverview';
import Tabs from '../../../ui/Tabs/Tabs';
import LobbyOverview from '../../../experience/lobbyInstance/LobbyOverview/LobbyOverview';
import ActivityTransitionToggle from '../../../experience/activity/ActivityTransitionToggle/ActivityTransitionToggle';
import LobbyDashboardToggle from '../../../experience/lobbyInstance/LobbyDashboardToggle/LobbyDashboardToggle';
import Chatroom from '../../../experience/Chatroom/Chatroom';

const GameRoomDrawer = ({
  lobbyInstance: { lobbyInstance },
  gameRoomInstance: { gameRoomInstance, gameRoomInstance: { isPoweredOn, isAutosaveDisabled }},
  myTracks,
  userTracks,
  editGameRoom
}) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const currentActivityCategory = lobbyInstance.activitys[lobbyInstance.currentActivityId].activityCategory
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
        {currentActivityCategory === GAME_ROOM_ACTIVITY && isAutosaveDisabled && <div className="GameRoomDrawer__not-saving-stage">
          <Icon icon="faFloppyDisk"></Icon>
          <Typography variant="subtitle2">Autosave Disabled</Typography>
          <Switch
            size="small"
            onChange={() => {
              editGameRoom(gameRoomInstance.id, {
                isAutosaveDisabled: false
              })
            }}
            checked={isAutosaveDisabled}
          />
        </div>}
      </div>
      <Drawer anchor="right" isOpen={isDrawerOpen} onClose={() => 
        setIsDrawerOpen(false)
      }>
        <div className="GameRoomDrawer__drawer">
          <Tabs tabs={[
            {
              label: 'Game',
              body: <GameRoomOverview myTracks={myTracks} userTracks={userTracks}/>
            },
            {
            label: 'Chatlog',
              body: <div className="LobbyDashboard__chatroom">
                <Chatroom myTracks={myTracks} userTracks={userTracks} />
              </div>
            },
            {
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
  gameRoomInstance: state.gameRoomInstance,
  lobbyInstance: state.lobbyInstance,
});

export default compose(
  connect(mapStateToProps, { editGameRoom }),
)(GameRoomDrawer);
