/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './LobbyDashboard.scss';
import LobbySetupFlow from '../LobbySetupFlow/LobbySetupFlow';
import ExperiencePreview from '../ExperiencePreview/ExperiencePreview';
import LobbyChatroom from '../LobbyChatroom/LobbyChatroom';
import AgoraToolbar from '../agora/AgoraToolbar/AgoraToolbar';
import Tabs from '../../ui/Tabs/Tabs';

const LobbyDashboard = ({
  lobby: { lobby },
  myTracks,
  video: { isInsideVideoCall },
}) => {
  return (
    <div className="LobbyDashboard">
      <div className="LobbyDashboard__content">
        <div className="LobbyDashboard__preview">
          <ExperiencePreview userId={lobby.participantId}/>
        </div>
        <Tabs tabs={[
          {
            label: 'Instructions',
            body: <LobbySetupFlow/>
          },
          {
            label: 'Chatlog',
            body: <div className="LobbyDashboard__chatroom">
              <LobbyChatroom/>
              {isInsideVideoCall && myTracks && <AgoraToolbar tracks={myTracks}></AgoraToolbar>}
            </div>
          },
          {
            label: 'Command Center',
            body: <div className="LobbyDashboard__command-center">
  
            </div>
          },
        ]}></Tabs>
      </div>

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
