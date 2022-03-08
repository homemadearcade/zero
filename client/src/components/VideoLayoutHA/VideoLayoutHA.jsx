import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';

import {
  AgoraVideoPlayer,
} from "agora-rtc-react";

import './VideoLayoutHA.scss'
import VideoStatus from "../VideoStatus/VideoStatus";
import { useChangeAgoraVideoAudio } from "../../store/actions/videoActions";

const VideoLayoutHA = ({ participantId, guideId, auth: { me }, myTracks, userTracks, isAudioMuted, isVideoMuted, muteVideo, muteAudio }) => {
  let [showInfo, setShowInfo] = useState(false)
 
  const [videoDevices, audioDevices, setVideoDevice, setAudioDevice] = useChangeAgoraVideoAudio()
  
  const userTracksById = [{ uid: me.id, videoTrack: myTracks[1] }, ...userTracks].reduce((prev, next) => {
    prev[next.uid] = next
    return prev
  }, {})

  return <div className="VideoLayoutHA">
    {userTracksById[participantId] && <Video 
      className="VideoLayoutHA__participant" 
      label="Participant" 
      videoTrack={userTracksById[participantId].videoTrack} 
      key={userTracksById[participantId].uid} 
      userId={userTracksById[participantId].uid} 
      muteAudio={muteAudio} 
      muteVideo={muteVideo} 
      isVideoMuted={isVideoMuted} 
      isAudioMuted={isAudioMuted} 
      setShowInfo={setShowInfo} 
      showInfo={showInfo} 
      me={me}
      videoDevices={videoDevices}
      audioDevices={audioDevices} 
      setVideoDevice={setVideoDevice}
      setAudioDevice={setAudioDevice}
    />}
    {!userTracksById[participantId] && <div className="VideoLayoutHA__video-container VideoLayoutHA__participant"/>}

    {userTracksById[guideId] && <Video 
      className="VideoLayoutHA__guide" 
      label="Guide" 
      videoTrack={userTracksById[guideId].videoTrack} 
      key={userTracksById[guideId].uid}
      userId={userTracksById[guideId].uid} 
      muteAudio={muteAudio} 
      muteVideo={muteVideo} 
      isVideoMuted={isVideoMuted} 
      isAudioMuted={isAudioMuted} 
      setShowInfo={setShowInfo} 
      showInfo={showInfo} 
      me={me}
      videoDevices={videoDevices}
      audioDevices={audioDevices} 
      setVideoDevice={setVideoDevice}
      setAudioDevice={setAudioDevice}
     />}
    {!userTracksById[guideId] && <div className="VideoLayoutHA__video-container VideoLayoutHA__guide"/>}
  </div>
}

const mapStateToProps = (state) => ({
  participantId: state.lobby.lobby.participantId,
  guideId: state.lobby.lobby.guideId,
  auth: state.auth
});

export default connect(mapStateToProps, { })(VideoLayoutHA);

function Video({setShowInfo, showInfo, className, label, me, videoTrack, userId, muteAudio, muteVideo, isAudioMuted, isVideoMuted, videoDevices, audioDevices, setVideoDevice, setAudioDevice}) {
  const isMe = me.id === userId
  return <div className={"VideoLayoutHA__video-container " + className} onMouseEnter={() => {
    setShowInfo(userId)
  }} onMouseLeave={() => {
    setShowInfo(null)
  }}>
    {showInfo === userId && <div className="VideoLayoutHA__info">
      {me.role === 'ADMIN' && <>
        {label ? label : null}
        {isMe && ' - me'}
        <VideoStatus userId={userId} me={me}/>
      </>}
      {isMe && <Controls 
        muteAudio={muteAudio}
        muteVideo={muteVideo}
        isVideoMuted={isVideoMuted}
        isAudioMuted={isAudioMuted}
        videoDevices={videoDevices}
        audioDevices={audioDevices} 
        setVideoDevice={setVideoDevice}
        setAudioDevice={setAudioDevice}
      />}
    </div>}
    <AgoraVideoPlayer className="VideoLayoutHA__video" videoTrack={videoTrack}/>
  </div>
}

function Controls({muteAudio, isAudioMuted, isVideoMuted, muteVideo, videoDevices, audioDevices, setVideoDevice, setAudioDevice}) {
  return <div className="VideoLayoutHA__controls">
    {isAudioMuted ? <div className="VideoLayoutHA__controls-mic" onClick={muteAudio}>
      <i className="fas fa-microphone-slash"/>
    </div> : 
    <div className="VideoLayoutHA__controls-mic" onClick={muteAudio}>
      <i className="fas fa-microphone"/>
    </div>
    }
    {isVideoMuted ? <div className="VideoLayoutHA__controls-cam" onClick={muteVideo}>
      <i className="fas fa-video-slash"/>
    </div> : 
    <div className="VideoLayoutHA__controls-mic" onClick={muteVideo}>
      <i className="fas fa-video"/>
    </div>
    }
  </div>
}
