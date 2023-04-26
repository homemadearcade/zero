/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './LobbyDashboard.scss';
import ActivitySwitcher from '../../activity/ActivitySwitcher/ActivitySwitcher';
import Chatroom from '../../Chatroom/Chatroom';
import Tabs from '../../../ui/Tabs/Tabs';
import AgoraUserVideo from '../../agora/AgoraUserVideo/AgoraUserVideo';
import LobbyOverview from '../LobbyOverview/LobbyOverview';
import ActivityView from '../../activity/ActivityView/ActivityView';
import classNames from 'classnames';
import { CURRENT_COBROWSING_VIDEO_IID } from '../../../constants/interfaceIds';
import LobbyInstructions from '../LobbyInstructions/LobbyInstructions';
import ActivityInstructions from '../../activity/ActivityInstructions/ActivityInstructions';

const LobbyDashboard = ({
  lobbyInstance: { lobbyInstance, isLobbyDashboardOpen },
  myTracks,
  userTracks,
}) => {
  const cobrowsingUserMongoId = lobbyInstance.cobrowsingUserMongoId

  return (
    <div className={classNames("LobbyDashboard", { 'LobbyDashboard--preview': isLobbyDashboardOpen, 'LobbyDashboard--view': !isLobbyDashboardOpen})}>
      <div className="LobbyDashboard__content">
        <div className="LobbyDashboard__preview">
          <div className="LobbyDashboard__video-container">
            <AgoraUserVideo interfaceId={CURRENT_COBROWSING_VIDEO_IID} className="LobbyDashboard__cobrowsing-user-video" myTracks={myTracks} userTracks={userTracks} label="Participant" userMongoId={cobrowsingUserMongoId}/>
          </div>
          <ActivityView myTracks={myTracks} userTracks={userTracks}/>
          <ActivitySwitcher myTracks={myTracks} userTracks={userTracks} userMongoId={cobrowsingUserMongoId}/>
        </div>
        <LobbyInstructions myTracks={myTracks} userTracks={userTracks}/>
      </div>

    </div>
  );
};

const mapStateToProps = (state) => ({
  lobbyInstance: state.lobbyInstance,
});

export default compose(
  connect(mapStateToProps, { }),
)(LobbyDashboard);
