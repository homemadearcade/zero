/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { clearErrorState } from '../../../store/actions/errorsActions';
import { activityViewToInterfaceData, ACTIVITY_VIEW_FACILITATORS, ACTIVITY_VIEW_GAME_HIDDEN, ACTIVITY_VIEW_PLAY_GAME, ACTIVITY_VIEW_WATCH_GAME, CHATROOM_ACTIVITY, CREDITS_ACTIVITY, GAME_ROOM_ACTIVITY, VIDEO_ACTIVITY, WAITING_ACTIVITY } from '../../../constants';
import CobrowsingGame from '../../cobrowsing/CobrowsingGame/CobrowsingGame';
import './GameRoomActivity.scss'
import VideoActivity from '../VideoActivity/VideoActivity';
import GameViewEmpty from '../../../game/view/GameViewEmpty/GameViewEmpty';

const GameRoomActivity = ({
  lobbyInstance: { isLobbyDashboardOpen },
  gameRoomInstance: { gameRoomInstance },
  currentViewCategory,
  myTracks,
  userTracks,
}) => {
  
  // const activity = lobbyInstance.activitys[currentActivityId]

  function renderViewOverlay() {
    if(currentViewCategory === ACTIVITY_VIEW_PLAY_GAME || currentViewCategory === ACTIVITY_VIEW_WATCH_GAME) return

    if(currentViewCategory === ACTIVITY_VIEW_FACILITATORS) {
      return <div className="GameRoomActivity__view-overlay">
        <VideoActivity currentViewCategory={ACTIVITY_VIEW_FACILITATORS} myTracks={myTracks} userTracks={userTracks} />
      </div>
    }

    if(currentViewCategory === ACTIVITY_VIEW_GAME_HIDDEN) {
      return <GameViewEmpty/>
    }
  }

  return <div className="GameRoomActivity">
    {renderViewOverlay()}
    <CobrowsingGame rootFontSize={isLobbyDashboardOpen ? '1vh' : "2vh"} myTracks={myTracks} userTracks={userTracks}/>
  </div>
};

const mapStateToProps = (state) => ({
  lobbyInstance: state.lobbyInstance,
  gameRoomInstance: state.gameRoomInstance,
  video: state.video,
  cobrowsing: state.cobrowsing,
  auth: state.auth,
});

export default compose(
  connect(mapStateToProps, { clearErrorState }),
)(GameRoomActivity);
