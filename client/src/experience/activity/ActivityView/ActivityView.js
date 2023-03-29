/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { clearErrorState } from '../../../store/actions/errorsActions';
import './ActivityView.scss'
import ActivityCurrent from '../ActivityCurrent/ActivityCurrent';
import classNames from 'classnames';

const ActivityView = ({
  myTracks,
  userTracks,
  lobbyInstance: { isLobbyDashboardOpen }
}) => {
  return <div id="ActivityView" className={classNames("ActivityView", {'ActivityView--preview': isLobbyDashboardOpen})}>
    <ActivityCurrent rootFontSize={isLobbyDashboardOpen ? '1vh' : "2vh"}  myTracks={myTracks} userTracks={userTracks}/>
  </div>
};

const mapStateToProps = (state) => ({
  lobbyInstance: state.lobbyInstance
});

export default compose(
  connect(mapStateToProps, { clearErrorState }),
)(ActivityView);
