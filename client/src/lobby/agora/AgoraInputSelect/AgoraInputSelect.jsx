import React from "react";
import { compose } from 'redux';
import { connect } from 'react-redux';

import { useChangeAgoraVideoAudio } from "../../../store/actions/videoActions";
import { setVideoTrackId, setAudioTrackId } from "../../../store/actions/videoActions";
import Select from "../../../components/ui/Select/Select";

const AgoraInputSelect = ({ tracks = null, setVideoTrackId, setAudioTrackId, video: { videoTrackId, audioTrackId } }) => {
  const [videoDevices, audioDevices, setVideoDevice, setAudioDevice] = useChangeAgoraVideoAudio(tracks)

  return <>
      <Select
        value={videoTrackId || ""}
        onChange={(e) => {
          setVideoDevice(e.target.value)
          setVideoTrackId(e.target.value)
        }}
        inputLabel="Camera"
        options={videoDevices.map(({label, deviceId}) => {
          return {
            value: deviceId,
            label
          }
        })}
      />
    <Select
        value={audioTrackId || ""}
        onChange={(e) => {
          setAudioDevice(e.target.value)
          setAudioTrackId(e.target.value)
        }}
        inputLabel="Microphone"
        options={audioDevices.map(({label, deviceId}) => {
          return {
            value: deviceId,
            label
          }
        })}
      />
  </>
}

const mapStateToProps = (state) => ({
  video: state.video
});

export default compose(
  connect(mapStateToProps, { setAudioTrackId, setVideoTrackId }),
)(AgoraInputSelect);