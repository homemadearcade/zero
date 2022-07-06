import React from "react";
import { compose } from 'redux';
import { connect } from 'react-redux';

import './AgoraVideoCall.scss'
import { useAgoraVideoCall } from "../../../store/actions/videoActions";
import AgoraInputSelect from "../AgoraInputSelect/AgoraInputSelect";
import { onStartAgoraVideoCallFail, onStartAgoraVideoCallSuccess, startAgoraVideoCall } from '../../../store/actions/videoActions';
import {
  createMicrophoneAndCameraTracks,
} from "agora-rtc-react";
import AgoraVideo from "../AgoraVideo/AgoraVideo";
import AgoraVolumeMeter from "../AgoraVolumeMeter/AgoraVolumeMeter";

const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

const AgoraVideoCall = (props) => {
  if(props.video.isConnected || props.video.videoState.isStarting) {
    return <AgoraVideoCallContext {...props}/>
  } else {
    return <AgoraVideoCallPreview  {...props}/>
  }   
};

const AgoraVideoCallPreview = ({startAgoraVideoCall, lobbyId, onClickJoin, auth: { me }}) => {
  const { tracks, ready } = useMicrophoneAndCameraTracks();

  const userTracks = { uid: me.id, videoTrack: tracks && tracks[1], audioTrack: tracks && tracks[0] }

  return <div className="AgoraVideoCallPreview">
    {!ready && <div className="AgoraVideoCallPreview__popup">
      <h3>A window should popup in your browser that looks similar to the image below. Please click 'Allow'.</h3>
      <img className="AgoraVideoCallPreview__demo" src="/assets/images/camera-permission.png" alt="cam"/>
    </div>}
    {ready && <div className="AgoraVideoCallPreview__body">
      <h3>Select a camera and microphone</h3>
      <AgoraInputSelect tracks={userTracks}/>
      <h3>Please check that your preferred camera is visible below</h3>
      <AgoraVideo 
        className="AgoraVideo__preview"
        label="Preview"
        hideOverlay
        tracks={userTracks} />
      <div className="AgoraVideoCallPreview__volume-checker">
        <h3>Please check that your microphone is picking up sound with the meter below</h3>
        <AgoraVolumeMeter audioTrack={userTracks.audioTrack}/>
      </div>
      <button onClick={() => {
        onClickJoin()
        startAgoraVideoCall(tracks)
      }}>
        Join with Video
      </button>
    </div>
  }
  </div>
}

const AgoraVideoCallContext = ({onStartAgoraVideoCallFail, onStartAgoraVideoCallSuccess, lobbyId, auth: { me }, video: { videoTrackId, audioTrackId }, render}) => {
  let [tracks, users] = useAgoraVideoCall({userId: me.id, lobbyId, onStartAgoraVideoCallFail, onStartAgoraVideoCallSuccess, videoTrackId, audioTrackId })

  return (
    <div className="AgoraVideoCall">
      {tracks ? render({ myTracks: tracks, userTracks: users }) : render({})}
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  lobbyId: state.lobby.lobby.id,
  video: state.video
});

export default compose(
  connect(mapStateToProps, { startAgoraVideoCall, onStartAgoraVideoCallFail, onStartAgoraVideoCallSuccess }),
)(AgoraVideoCall);

