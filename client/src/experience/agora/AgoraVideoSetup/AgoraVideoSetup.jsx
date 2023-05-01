import React, { useEffect } from "react";
import { compose } from 'redux';
import { connect } from 'react-redux';

import './AgoraVideoSetup.scss'
import { bypassAgoraVideoCall, useChangeAgoraVideoAudio, useMicrophoneAndCameraTracks } from "../../../store/actions/experience/videoActions";
import { startAgoraVideoCall } from "../../../store/actions/experience/videoActions";
import Button from "../../../ui/Button/Button";
import Typography from "../../../ui/Typography/Typography";
import AgoraVideoPreview from "../AgoraVideoPreview/AgoraVideoPreview";
import {  APP_ADMIN_ROLE } from "../../../constants";

const AgoraVideoSetup = ({ auth: { me }, startAgoraVideoCall, bypassAgoraVideoCall, video: { videoTrackId, audioTrackId }}) => {
  const { tracks, ready } = useMicrophoneAndCameraTracks();
  const userTracks = { videoTrack: tracks && tracks[1], audioTrack: tracks && tracks[0] }
  const [videoDevices, audioDevices, setVideoDevice, setAudioDevice] = useChangeAgoraVideoAudio(userTracks)

  useEffect(() => {
    if(!ready) return 
    if(videoTrackId) {
      setVideoDevice(videoTrackId)
    }
    if(audioTrackId) {
      setAudioDevice(audioTrackId)
    }
  }, [videoTrackId, audioTrackId, ready])

  return <div className="AgoraVideoSetup">
    {!ready && <div className="AgoraVideoSetup__popup">
      <Typography component="h5" variant="h5">A window should popup in your browser asking permission to use your camera. Please click 'Allow'.</Typography>
    </div>}
    {ready && <div className="AgoraVideoSetup__preview">
      <AgoraVideoPreview tracks={tracks}/>
      <Button variant="contained" onClick={() => {
        startAgoraVideoCall(tracks)
      }}>
        Enter Lobby with Video
      </Button>
      {me?.roles[APP_ADMIN_ROLE] && <Button onClick={() => {
        bypassAgoraVideoCall()
      }}>
        Bypass Video Call
      </Button>}
    </div>
  }
  </div>
}


const mapStateToProps = (state) => ({
  video: state.video,
  auth: state.auth
});

export default compose(
  connect(mapStateToProps, { startAgoraVideoCall, bypassAgoraVideoCall }),
)(AgoraVideoSetup);

