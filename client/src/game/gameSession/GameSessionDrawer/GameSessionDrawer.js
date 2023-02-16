/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { inIframe } from '../../../utils/webPageUtils';
import Drawer from '../../../ui/Drawer/Drawer';
import Icon from '../../../ui/Icon/Icon';
import Link from '../../../ui/Link/Link';
import { GAME_EDITOR_EXPERIENCE } from '../../../constants';
import CobrowsingIndicator from '../../cobrowsing/CobrowsingIndicator/CobrowsingIndicator';
import GameSessionPowerIndicator from '../GameSessionPowerIndicator/GameSessionPowerIndicator';
import ConstellationToggle from '../../ConstellationToggle/ConstellationToggle';
import Typography from '../../../ui/Typography/Typography';
import Switch from '../../../ui/Switch/Switch';
import './GameSessionDrawer.scss'
import { editGameSession } from '../../../store/actions/gameSessionActions';
import GameSessionOverview from '../GameSessionOverview/GameSessionOverview';
import Tabs from '../../../ui/Tabs/Tabs';
import LobbyOverview from '../../../experience/LobbyOverview/LobbyOverview';

const GameSessionDrawer = ({
  lobby: { lobby, lobby: { experienceState } },
  gameSession: { gameSession, gameSession: { isPoweredOn, isSaveDisabled }},
  myTracks,
  userTracks,
  editGameSession
}) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    return <>
      <div className="GameSessionDrawer">
        {!inIframe() && <div className="GameSessionDrawer__toggle" onClick={() => {
          setIsDrawerOpen(true)
        }}>
          <Icon icon="faBars"/>
        </div>}
        {experienceState === GAME_EDITOR_EXPERIENCE && <CobrowsingIndicator/>}
        {experienceState === GAME_EDITOR_EXPERIENCE && isPoweredOn && <ConstellationToggle/>}
        {experienceState === GAME_EDITOR_EXPERIENCE && <GameSessionPowerIndicator/>}
        {experienceState === GAME_EDITOR_EXPERIENCE && isSaveDisabled && <div className="GameSessionDrawer__not-saving-stage">
          <Icon icon="faFloppyDisk"></Icon>
          <Typography variant="subtitle2">Save Disabled</Typography>
          <Switch
            size="small"
            onChange={() => {
              editGameSession(gameSession.id, {
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
        <div className="GameSessionDrawer__drawer">
          <Tabs tabs={[
            {
              label: 'Game',
              body: <GameSessionOverview myTracks={myTracks} userTracks={userTracks}/>
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
  gameSession: state.gameSession,
  lobby: state.lobby,
});

export default compose(
  connect(mapStateToProps, { editGameSession }),
)(GameSessionDrawer);
