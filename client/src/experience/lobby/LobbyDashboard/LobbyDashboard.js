/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './LobbyDashboard.scss';
import ActivityInstructions from '../../activity/ActivityInstructions/ActivityInstructions';
import ActivitySwitcher from '../../activity/ActivitySwitcher/ActivitySwitcher';
import Chatroom from '../../Chatroom/Chatroom';
import Tabs from '../../../ui/Tabs/Tabs';
import AgoraUserVideo from '../../agora/AgoraUserVideo/AgoraUserVideo';
import LobbyOverview from '../LobbyOverview/LobbyOverview';
import ActivityView from '../../activity/ActivityView/ActivityView';
import classNames from 'classnames';

const LobbyDashboard = ({
  lobby: { lobby, isLobbyDashboardOpen },
  myTracks,
  userTracks,
}) => {
  return (
    <div className={classNames("LobbyDashboard", { 'LobbyDashboard--preview': isLobbyDashboardOpen, 'LobbyDashboard--view': !isLobbyDashboardOpen})}>
      <div className="LobbyDashboard__content">
        <div className="LobbyDashboard__preview">
          <div className="LobbyDashboard__video-container">
            <AgoraUserVideo className="LobbyDashboard__participant-video" myTracks={myTracks} userTracks={userTracks} label="Participant" userId={lobby.participantId}/>
          </div>
          <ActivityView myTracks={myTracks} userTracks={userTracks}/>
          <ActivitySwitcher myTracks={myTracks} userTracks={userTracks} userId={lobby.participantId}/>
        </div>
        <Tabs tabs={[
          {
            label: 'Instructions',
            body: <ActivityInstructions myTracks={myTracks} userTracks={userTracks}/>
          },
          {
            label: 'Chatlog',
            body: <div className="LobbyDashboard__chatroom">
              <Chatroom myTracks={myTracks} userTracks={userTracks} />
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
