/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { COBROWSING_CONNECTION_LOST, GAME_CONNECTION_LOST } from '../constants';
import { clearErrorState } from '../../store/actions/errorsActions';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { CHATROOM_UI, GAME_EDITOR_UI, MONOLOGUE_UI, WAITING_UI } from '../../constants';
import CobrowsingGame from '../../game/CobrowsingGame/CobrowsingGame';
import Typography from '../../ui/Typography/Typography';
import ObscuredGameView from '../../game/ObscuredGameView/ObscuredGameView';
import LobbyChatroom from '../LobbyChatroom/LobbyChatroom';
import AgoraUserVideo from '../agora/AgoraUserVideo/AgoraUserVideo';
import './ExperienceView.scss'

const LobbyErrorStates = ({
  lobby: { lobby: { experienceState, guideId, currentGameId } },
  myTracks,
  userTracks
}) => {

  if(experienceState === WAITING_UI) {
    return <div className="LobbyWaiting">
      <Typography variant="h4">Your experience will start shortly...</Typography>
    </div>
  }

  if(experienceState === GAME_EDITOR_UI) {
    return <CobrowsingGame gameId={currentGameId} myTracks={myTracks} userTracks={userTracks}>
      <ObscuredGameView/>
    </CobrowsingGame>
  }

  if(experienceState === CHATROOM_UI) {
    return <LobbyChatroom hideAutomated></LobbyChatroom>
  }

  if(experienceState === MONOLOGUE_UI) {
    return <div className="MonologueView">
      <AgoraUserVideo
        hideOverlay
        className="MonologueView__speaker"
        myTracks={myTracks}
        userTracks={userTracks}
        userId={guideId}
      ></AgoraUserVideo>
    </div>
  }
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
});

export default compose(
  connect(mapStateToProps, { clearErrorState }),
)(LobbyErrorStates);
