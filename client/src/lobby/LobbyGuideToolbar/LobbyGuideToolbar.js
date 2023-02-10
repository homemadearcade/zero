/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { inIframe } from '../../utils/webPageUtils';
import Drawer from '../../ui/Drawer/Drawer';
import Icon from '../../ui/Icon/Icon';
import LobbyDetail from '../LobbyDetail/LobbyDetail';
import Link from '../../ui/Link/Link';
import { GAME_EDITOR_EXPERIENCE } from '../../constants';
import CobrowsingIndicator from '../../game/cobrowsing/CobrowsingIndicator/CobrowsingIndicator';
import LobbyPowerIndicator from '../LobbyPowerIndicator/LobbyPowerIndicator';
import ConstellationToggle from '../../game/ConstellationToggle/ConstellationToggle';
import Typography from '../../ui/Typography/Typography';
import Switch from '../../ui/Switch/Switch';
import { editLobby } from '../../store/actions/lobbyActions';
import './LobbyGuideToolbar.scss'

const LobbyGuideToolbar = ({
  lobby: { lobby, lobby: { experienceState, isGamePoweredOn, skipStageSave } },
  myTracks,
  userTracks,
  editLobby
}) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

        //     <div className="LobbyGuideToolbar__close" 
        //   onClick={() => {
        //     setIsDrawerOpen(false)
        //   }}>
        //   <Icon
        //     icon="faClose"
        //   />
        // </div>
    return <>
      <div className="LobbyGuideToolbar">
        {!inIframe() && <div className="LobbyGuideToolbar__toggle" onClick={() => {
          setIsDrawerOpen(true)
        }}>
          <Icon icon="faBars"/>
        </div>}
        {experienceState === GAME_EDITOR_EXPERIENCE && <CobrowsingIndicator/>}
        {experienceState === GAME_EDITOR_EXPERIENCE && <LobbyPowerIndicator/>}
        {experienceState === GAME_EDITOR_EXPERIENCE && isGamePoweredOn && <ConstellationToggle/>}
        {experienceState === GAME_EDITOR_EXPERIENCE && skipStageSave && <div className="LobbyGuideToolbar__not-saving-stage">
          <Icon icon="faFloppyDisk"></Icon>
          <Typography variant="subtitle2">Not Saving<br/>Map Objects</Typography>
          <Switch
            size="small"
            onChange={() => {
              editLobby(lobby.id, {
                skipStageSave: false,
              })
            }}
            checked={skipStageSave}
          />
        </div>}
      </div>
      <Drawer anchor="right" isOpen={isDrawerOpen} onClose={() => 
        setIsDrawerOpen(false)
      }>
        <br/>
        <br/>
        <br/>
        <LobbyDetail myTracks={myTracks} userTracks={userTracks} 
        />
        <Link onClick={() => {
          setIsDrawerOpen(false)
        }} to={`/lobby/${lobby.id}`}>Go to Lobby</Link>
        <Link to="/lobbys">Exit Lobby</Link>
      </Drawer>
    </>
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
});

export default compose(
  connect(mapStateToProps, { editLobby }),
)(LobbyGuideToolbar);
