import React from "react";
import { compose } from 'redux';
import { connect } from 'react-redux';

import { useChangeAgoraVideoAudio } from '../../store/actions/videoActions';
import { setVideoTrackId, setAudioTrackId } from "../../store/actions/videoActions";

const AgoraInputSelect = ({ tracks = null, setVideoTrackId, setAudioTrackId, video: { videoTrackId, audioTrackId } }) => {
  const [videoDevices, audioDevices, setVideoDevice, setAudioDevice] = useChangeAgoraVideoAudio(tracks)

  return <div>
    <div>
      Camera:
      <select 
        value={videoTrackId}
        onChange={(e) => {
        setVideoDevice(e.target.value)
        setVideoTrackId(e.target.value)
        }}
      >
        {videoDevices && videoDevices.map(({label, deviceId}) => {
          return <option value={deviceId} key={deviceId}>
            {label}
          </option>
        })}
      </select>
    </div>
    <div>
      Microphone:
      <select 
        value={audioTrackId}
        onChange={(e) => {
          setAudioDevice(e.target.value)
          setAudioTrackId(e.target.value)
        }}
      >
        {audioDevices && audioDevices.map(({label, deviceId}) => {
          return <option value={deviceId} key={deviceId}>
            {label}
          </option>
        })}
      </select>
    </div>
  </div>
}

const mapStateToProps = (state) => ({
  video: state.video
});

export default compose(
  connect(mapStateToProps, { setAudioTrackId, setVideoTrackId }),
)(AgoraInputSelect);