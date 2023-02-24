import React, { useEffect } from "react";
import { compose } from 'redux';
import { connect } from 'react-redux';

import './AgoraVideoPreview.scss'
import { bypassAgoraVideoCall, setAudioTrackId, setVideoTrackId } from "../../../store/actions/videoActions";
import AgoraInputSelect from "../AgoraInputSelect/AgoraInputSelect";
import { onStartAgoraVideoCallFail, onStartAgoraVideoCallSuccess, startAgoraVideoCall } from "../../../store/actions/videoActions";
import AgoraVideo from "../AgoraVideo/AgoraVideo";
import AgoraVolumeMeter from "../AgoraVolumeMeter/AgoraVolumeMeter";
import Typography from "../../../ui/Typography/Typography";

const AgoraVideoPreview = ({tracks, auth: { me }}) => {
  const userTracks = { uid: me.id, videoTrack: tracks && tracks[1], audioTrack: tracks && tracks[0] }

  return <div className="AgoraVideoPreview">
    <Typography component="h5" variant="h5">Select a camera and microphone</Typography>
    <AgoraInputSelect tracks={userTracks}/>
    <Typography component="h5" variant="h5">Please check that your preferred camera is visible below</Typography>
    <AgoraVideo 
      className="AgoraVideo__preview"
      label="Preview"
      hideOverlay
      tracks={userTracks} />
    <div className="AgoraVideoPreview__volume-checker">
      <Typography component="h5" variant="h5">Please check that your microphone is picking up sound with the meter below</Typography>
      <AgoraVolumeMeter audioTrack={userTracks.audioTrack} username={me.username} />
    </div>
  </div>
}


const mapStateToProps = (state) => ({
  auth: state.auth,
  video: state.video
});

export default compose(
  connect(mapStateToProps, { setAudioTrackId, setVideoTrackId, startAgoraVideoCall, onStartAgoraVideoCallFail, onStartAgoraVideoCallSuccess, bypassAgoraVideoCall }),
)(AgoraVideoPreview);

