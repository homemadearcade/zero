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
import LobbyCommandCenter from '../LobbyCommandCenter/LobbyCommandCenter';
import AgoraUserVideo from '../agora/AgoraUserVideo/AgoraUserVideo';
import { MONOLOGUE_EXPERIENCE } from '../../constants';

const LobbyDashboard = ({
  lobby: { lobby },
  myTracks,
  userTracks,
  video: { isInsideVideoCall },
}) => {
  
  return (
    <div className="LobbyDashboard">
      <div className="LobbyDashboard__content">
        <div className="LobbyDashboard__preview">
          <div className="LobbyDashboard__video-container">
            {lobby.experienceState === MONOLOGUE_EXPERIENCE && <div className='LobbyDashboard__monologue-text'>
              {lobby.monologueText}
            </div>}
            <AgoraUserVideo className="LobbyDashboard__participant-video" myTracks={myTracks} userTracks={userTracks} label="Participant" userId={lobby.participantId}/>
          </div>
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
            body: <LobbyCommandCenter></LobbyCommandCenter>
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
