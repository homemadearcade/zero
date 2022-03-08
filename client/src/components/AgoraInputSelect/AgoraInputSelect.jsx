import React from "react";
import { useChangeAgoraVideoAudio} from '../../store/actions/videoActions';

const AgoraInputSelect = () => {
  const [videoDevices, audioDevices, setVideoDevice, setAudioDevice] = useChangeAgoraVideoAudio()

  return <div>
    <div>
      Video:
      <select onChange={(e) => {
        setVideoDevice(e.target.value)
      }}>
        {videoDevices && videoDevices.map(({label, deviceId}) => {
          return <option value={deviceId} key={deviceId}>
            {label}
          </option>
        })}
      </select>
    </div>
    <div>
      Audio:
      <select onChange={(e) => {
        setAudioDevice(e.target.value)
      }}>
        {audioDevices && audioDevices.map(({label, deviceId}) => {
          return <option value={deviceId} key={deviceId}>
            {label}
          </option>
        })}
      </select>
    </div>
  </div>
}

export default AgoraInputSelect