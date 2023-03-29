/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { clearErrorState } from '../../../store/actions/errorsActions';
import { CHATROOM_ACTIVITY, CREDITS_ACTIVITY, GAME_ROOM_ACTIVITY, MONOLOGUE_ACTIVITY, WAITING_ACTIVITY } from '../../../constants';
import CobrowsingGame from '../../cobrowsing/CobrowsingGame/CobrowsingGame';
import Typography from '../../../ui/Typography/Typography';
import Chatroom from '../../Chatroom/Chatroom';
import AgoraUserVideo from '../../agora/AgoraUserVideo/AgoraUserVideo';
import './ActivityCurrent.scss'
import { Container } from '@mui/system';
import AgoraVideoPreview from '../../agora/AgoraVideoPreview/AgoraVideoPreview';
import ExperienceCredits from '../ExperienceCredits/ExperienceCredits';
import ActivityOverlay from '../ActivityOverlay/ActivityOverlay';
import { MONOLOGUE_ACTIVITY_VIDEO_IID } from '../../../constants/interfaceIds';

const ActivityCurrent = ({
  lobbyInstance: { lobbyInstance: { currentActivity, guideId }},
  gameRoomInstance: { gameRoomInstance },
  myTracks,
  userTracks,
  video: { isInsideVideoCall},
  rootFontSize,
}) => {

  function renderCurrentActivity() {
    if(currentActivity === WAITING_ACTIVITY) {
      return <Container><div className="LobbyWaiting">
        <Typography variant="h4">Your experience will start shortly. For the best experience please spend this time closing all other browser tabs, closing other applications, and putting your notifications on quiet.</Typography>
        {isInsideVideoCall && <AgoraVideoPreview tracks={myTracks}/>}
      </div></Container>
    }

    if(currentActivity === CHATROOM_ACTIVITY) {
      return <Container><Chatroom hideAutomated></Chatroom></Container>
    }

    if(currentActivity === CREDITS_ACTIVITY) {
      return <ExperienceCredits/>
    }

    if(currentActivity === MONOLOGUE_ACTIVITY) {
      return <div className="MonologueExperience">
        <AgoraUserVideo
          interfaceId={MONOLOGUE_ACTIVITY_VIDEO_IID} 
          hideOverlay
          className="MonologueExperience__speaker"
          myTracks={myTracks}
          userTracks={userTracks}
          userId={guideId}
        ></AgoraUserVideo>
      </div>
    }
  }

  return <div className="ActivityCurrent">
    <ActivityOverlay/>
    {currentActivity !== GAME_ROOM_ACTIVITY && <div className="ActivityCurrent__activity">{renderCurrentActivity()}</div>}
    <CobrowsingGame rootFontSize={rootFontSize} gameId={gameRoomInstance.gameId} myTracks={myTracks} userTracks={userTracks}/>
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
