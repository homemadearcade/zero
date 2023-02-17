/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './LobbyDashboard.scss';
import ActivityInstructions from '../../activity/ActivityInstructions/ActivityInstructions';
import ActivitySwitcher from '../../activity/ActivitySwitcher/ActivitySwitcher';
import ChatRoom from '../../ChatRoom/ChatRoom';
import Tabs from '../../../ui/Tabs/Tabs';
import AgoraUserVideo from '../../agora/AgoraUserVideo/AgoraUserVideo';
import { MONOLOGUE_ACTIVITY } from '../../../constants';
import LobbyOverview from '../LobbyOverview/LobbyOverview';

const LobbyDashboard = ({
  lobby: { lobby },
  myTracks,
  userTracks,
}) => {
  
  return (
    <div className="LobbyDashboard">
      <div className="LobbyDashboard__content">
        <div className="LobbyDashboard__preview">
          <div className="LobbyDashboard__video-container">
            {lobby.currentActivity === MONOLOGUE_ACTIVITY && <div className='LobbyDashboard__monologue-text'>
              {lobby.monologueText}
            </div>}
            <AgoraUserVideo className="LobbyDashboard__participant-video" myTracks={myTracks} userTracks={userTracks} label="Participant" userId={lobby.participantId}/>
          </div>
          <ActivitySwitcher userId={lobby.participantId}/>
        </div>
        <Tabs tabs={[
          {
            label: 'Instructions',
            body: <ActivityInstructions myTracks={myTracks} userTracks={userTracks}/>
          },
          {
            label: 'Chatlog',
            body: <div className="LobbyDashboard__chatroom">
              <ChatRoom myTracks={myTracks} userTracks={userTracks} />
            </div>
          },
          {
            label: 'Users',
            body: <LobbyOverview myTracks={myTracks} userTracks={userTracks} ></LobbyOverview>
          },
        ]}></Tabs>
      </div>

    </div>
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
});

export default compose(
  connect(mapStateToProps, { }),
)(LobbyDashboard);
