/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { inIframe } from '../../../utils/webPageUtils';
import Drawer from '../../../ui/Drawer/Drawer';
import Icon from '../../../ui/Icon/Icon';
import Link from '../../../ui/Link/Link';
import { GAME_EDITOR_ACTIVITY } from '../../../constants';
import CobrowsingIndicator from '../../../experience/cobrowsing/CobrowsingIndicator/CobrowsingIndicator';
import GameRoomPowerIndicator from '../GameRoomPowerIndicator/GameRoomPowerIndicator';
import ConstellationToggle from '../../ConstellationToggle/ConstellationToggle';
import Typography from '../../../ui/Typography/Typography';
import Switch from '../../../ui/Switch/Switch';
import './GameRoomDrawer.scss'
import { editGameRoom } from '../../../store/actions/gameRoomActions';
import GameRoomOverview from '../GameRoomOverview/GameRoomOverview';
import Tabs from '../../../ui/Tabs/Tabs';
import LobbyOverview from '../../../experience/lobby/LobbyOverview/LobbyOverview';

const GameRoomDrawer = ({
  lobby: { lobby, lobby: { experienceActivity } },
  gameRoom: { gameRoom, gameRoom: { isPoweredOn, isSaveDisabled }},
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
        {experienceActivity === GAME_EDITOR_ACTIVITY && <CobrowsingIndicator/>}
        {experienceActivity === GAME_EDITOR_ACTIVITY && isPoweredOn && <ConstellationToggle/>}
        {experienceActivity === GAME_EDITOR_ACTIVITY && <GameRoomPowerIndicator/>}
        {experienceActivity === GAME_EDITOR_ACTIVITY && isSaveDisabled && <div className="GameRoomDrawer__not-saving-stage">
          <Icon icon="faFloppyDisk"></Icon>
          <Typography variant="subtitle2">Save Disabled</Typography>
          <Switch
            size="small"
            onChange={() => {
              editGameRoom(gameRoom.id, {
                isSaveDisabled: false
              })
            }}
            checked={isSaveDisabled}
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
                <Link onClick={() => {
                  setIsDrawerOpen(false)
                }} to={`/lobby/${lobby.id}`}>Go to Lobby</Link>
                <br/><br/>
                <Link to="/lobbys">Exit Lobby</Link>
              </>
            },
          ]} />
        </div>
      </Drawer>
    </>
};

const mapStateToProps = (state) => ({
  gameRoom: state.gameRoom,
  lobby: state.lobby,
});

export default compose(
  connect(mapStateToProps, { editGameRoom }),
)(GameRoomDrawer);
