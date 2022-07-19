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
import Button from "../../ui/Button/Button";
import Typography from "../../ui/Typography/Typography";

const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

const AgoraVideoCall = (props) => {
  if(props.video.isConnected || props.video.videoState.isStarting) {
    return <AgoraVideoCallContext {...props}/>
  } else {
    return <AgoraVideoCallPreview  {...props}/>
  }   
};

//      <img className="AgoraVideoCallPreview__demo" src="/assets/images/camera-permission.png" alt="cam"/>

const AgoraVideoCallPreview = ({startAgoraVideoCall, lobbyId, onClickJoin, auth: { me }}) => {
  const { tracks, ready } = useMicrophoneAndCameraTracks();

  const userTracks = { uid: me.id, videoTrack: tracks && tracks[1], audioTrack: tracks && tracks[0] }

  return <div className="AgoraVideoCallPreview">
    {!ready && <div className="AgoraVideoCallPreview__popup">
      <Typography component="h3" variant="h3">A window should popup in your browser asking permission to use your camera. Please click 'Allow'.</Typography>
    </div>}
    {ready && <div className="AgoraVideoCallPreview__body">
      <Typography component="h3" variant="h3">Select a camera and microphone</Typography>
      <AgoraInputSelect tracks={userTracks}/>
      <Typography component="h3" variant="h3">Please check that your preferred camera is visible below</Typography>
      <AgoraVideo 
        className="AgoraVideo__preview"
        label="Preview"
        hideOverlay
        tracks={userTracks} />
      <div className="AgoraVideoCallPreview__volume-checker">
        <Typography component="h3" variant="h3">Please check that your microphone is picking up sound with the meter below</Typography>
        <AgoraVolumeMeter audioTrack={userTracks.audioTrack}/>
      </div>
      <Button onClick={() => {
        onClickJoin()
        startAgoraVideoCall(tracks)
      }}>
        Join with Video
      </Button>
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

