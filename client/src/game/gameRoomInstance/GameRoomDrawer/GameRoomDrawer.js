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
import GameRoomPowerIndicator from '../GameRoomPowerIndicator/GameRoomPowerIndicator';
import Typography from '../../../ui/Typography/Typography';
import Switch from '../../../ui/Switch/Switch';
import './GameRoomDrawer.scss'
import { editGameRoom } from '../../../store/actions/game/gameRoomInstanceActions';
import GameRoomOverview from '../GameRoomOverview/GameRoomOverview';
import Tabs from '../../../ui/Tabs/Tabs';
import LobbyOverview from '../../../experience/lobbyInstance/LobbyOverview/LobbyOverview';
import ActivityOverlayToggle from '../../../experience/activity/ActivityOverlayToggle/ActivityOverlayToggle';
import LobbyDashboardToggle from '../../../experience/lobbyInstance/LobbyDashboardToggle/LobbyDashboardToggle';

const GameRoomDrawer = ({
  lobbyInstance: { lobbyInstance, lobbyInstance: { currentActivity } },
  gameRoomInstance: { gameRoomInstance, gameRoomInstance: { isPoweredOn, isAutosaveDisabled }},
  myTracks,
  userTracks,
  editGameRoom
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
        <GameRoomPowerIndicator/>
        <ActivityOverlayToggle/>
        {currentActivity === GAME_ROOM_ACTIVITY && isAutosaveDisabled && <div className="GameRoomDrawer__not-saving-stage">
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
              label: 'Lobby',
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
