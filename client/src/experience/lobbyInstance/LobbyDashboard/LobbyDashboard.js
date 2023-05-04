/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './LobbyDashboard.scss';
import ActivitySwitcher from '../../activity/ActivitySwitcher/ActivitySwitcher';
import ActivityView from '../../activity/ActivityView/ActivityView';
import classNames from 'classnames';
import LobbyInstructions from '../LobbyInstructions/LobbyInstructions';
import CobrowsingCard from '../../cobrowsing/CobrowsingCard/CobrowsingCard';

const LobbyDashboard = ({
  lobbyInstance: { lobbyInstance, isLobbyDashboardOpen },
  myTracks,
  userTracks,
}) => {
  const cobrowsingUserMongoId = lobbyInstance.cobrowsingUserMongoId

  return (
    <div className={classNames("LobbyDashboard", { 'LobbyDashboard--dashboard': isLobbyDashboardOpen, 'LobbyDashboard--view': !isLobbyDashboardOpen})}>
      <div className="LobbyDashboard__content">
        <div className="LobbyDashboard__controls">
          <CobrowsingCard myTracks={myTracks} userTracks={userTracks} />
          <ActivityView myTracks={myTracks} userTracks={userTracks}/>
          <ActivitySwitcher myTracks={myTracks} userTracks={userTracks} userMongoId={cobrowsingUserMongoId}/>
        </div>
        {isLobbyDashboardOpen && <LobbyInstructions myTracks={myTracks} userTracks={userTracks}/>}
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
