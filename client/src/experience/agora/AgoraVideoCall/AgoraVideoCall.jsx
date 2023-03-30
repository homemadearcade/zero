import React, { useEffect } from "react";
import { compose } from 'redux';
import { connect } from 'react-redux';

import './AgoraVideoCall.scss'
import { bypassAgoraVideoCall, setAudioTrackId, setVideoTrackId, useAgoraVideoCall, useChangeAgoraVideoAudio } from "../../../store/actions/experience/videoActions";
import { onStartAgoraVideoCallFail, onStartAgoraVideoCallSuccess, startAgoraVideoCall } from "../../../store/actions/experience/videoActions";
import AgoraCommandReciever from "../AgoraCommandReciever/AgoraCommandReciever";
import AgoraVideoSetup from "../AgoraVideoSetup/AgoraVideoSetup";

const AgoraVideoCall = (props) => {
  const { video : {bypass, isConnectingToVideoCall, isInsideVideoCall, videoCallId }, render } = props

  useEffect(() => {
    const agoraPreferences = window.LocalStorageSession.getItem("agoraPreferences");
    if(agoraPreferences?.videoTrackId) {
      props.setVideoTrackId(agoraPreferences.videoTrackId)
    }
    if(agoraPreferences?.audioTrackId) {
      props.setAudioTrackId(agoraPreferences.audioTrackId)
    }
  }, [])

  if(bypass) {
    return <div className="AgoraVideoCall">
      {render({})}
    </div>
  } else if(isInsideVideoCall || isConnectingToVideoCall) {
    return <AgoraVideoCallContext videoCallId={videoCallId} {...props}/>
  } else {
    return <AgoraVideoSetup {...props}/>
  }
};

const AgoraVideoCallContext = ({onStartAgoraVideoCallFail, onStartAgoraVideoCallSuccess, videoCallId, auth: { me }, video: { videoTrackId, audioTrackId }, render}) => {
  let [tracks, users] = useAgoraVideoCall({userMongoId: me.id, videoCallId, onStartAgoraVideoCallFail, onStartAgoraVideoCallSuccess, videoTrackId, audioTrackId })

  return (
    <div className="AgoraVideoCall">
      {tracks ? render({ myTracks: tracks, userTracks: users }) : render({})}
      <AgoraCommandReciever tracks={tracks}/>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  video: state.video
});

export default compose(
  connect(mapStateToProps, { setAudioTrackId, setVideoTrackId, startAgoraVideoCall, onStartAgoraVideoCallFail, onStartAgoraVideoCallSuccess, bypassAgoraVideoCall }),
)(AgoraVideoCall);

