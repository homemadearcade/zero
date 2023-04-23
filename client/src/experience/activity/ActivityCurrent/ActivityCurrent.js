/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { clearErrorState } from '../../../store/actions/errorsActions';
import { CHATROOM_ACTIVITY, CREDITS_ACTIVITY, GAME_ROOM_ACTIVITY, VIDEO_ACTIVITY, WAITING_ACTIVITY } from '../../../constants';
import Chatroom from '../../Chatroom/Chatroom';
import './ActivityCurrent.scss'
import { Container } from '@mui/system';
import CreditsActivity from '../CreditsActivity/CreditsActivity';
import ActivityTransition from '../ActivityTransition/ActivityTransition';
import GameRoomActivity from '../GameRoomActivity/GameRoomActivity';
import MultiplayerGameRoomContext from '../../../hoc/MultiplayerGameRoomContext';
import VideoActivity from '../VideoActivity/VideoActivity';
import WaitingActivity from '../WaitingActivity/WaitingActivity';

const ActivityCurrent = ({
  lobbyInstance: { lobbyInstance, lobbyInstance: { currentActivityId  }},
  myTracks,
  userTracks,
  video: { isInsideVideoCall},
}) => {
  const activity = lobbyInstance.activitys[currentActivityId]
  const activityCategory = activity.activityCategory
  const currentViewCategory = activity.currentViewCategory

  function renderCurrentActivity() {
    if(activityCategory === WAITING_ACTIVITY) {
      return <WaitingActivity currentViewCategory={currentViewCategory} myTracks={myTracks} />
    }

    if(activityCategory === CHATROOM_ACTIVITY) {
      return <Container><Chatroom hideAutomated></Chatroom></Container>
    }

    if(activityCategory === CREDITS_ACTIVITY) {
      return <CreditsActivity myTracks={myTracks} userTracks={userTracks} currentViewCategory={currentViewCategory}/>
    }

    if(activityCategory === VIDEO_ACTIVITY) {
      return <VideoActivity currentViewCategory={currentViewCategory} myTracks={myTracks} userTracks={userTracks} />
    }

    if(activityCategory === GAME_ROOM_ACTIVITY) {
      console.log('activity.gameRoomInstanceMongoId', activity.gameRoomInstanceMongoId)
      return <MultiplayerGameRoomContext gameRoomInstanceMongoId={activity.gameRoomInstanceMongoId}>
        <GameRoomActivity currentViewCategory={currentViewCategory}  myTracks={myTracks} userTracks={userTracks}/>
      </MultiplayerGameRoomContext>
    }
  }

  return <div className="ActivityCurrent">
    <ActivityTransition/>
    {renderCurrentActivity()}
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
)(ActivityCurrent);
