/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './LobbyDashboard.scss';
import LobbySetupFlow from '../LobbySetupFlow/LobbySetupFlow';
import ExperiencePreview from '../ExperiencePreview/ExperiencePreview';
import LobbyChatroom from '../LobbyChatroom/LobbyChatroom';
import { Paper } from '@mui/material';
import LobbyToolbar from '../LobbyToolbar/LobbyToolbar';

const LobbyDashboard = ({
  lobby: { lobby },
  myTracks,
  video: { isInsideVideoCall }
}) => {
  return (
    <div className="LobbyDashboard">
      <div className="LobbyDashboard__content">
        <div className="LobbyDashboard__communication">
          <ExperiencePreview userId={lobby.participantId}/>
        </div>
        <LobbySetupFlow/>
      </div>
      <Paper className="LobbyDashboard__chatroom">
        <LobbyChatroom name="Lobby Log"/>
        {isInsideVideoCall && myTracks && <LobbyToolbar tracks={myTracks}></LobbyToolbar>}
      </Paper>
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
  video: state.video
});

export default compose(
  connect(mapStateToProps, { }),
)(LobbyDashboard);
