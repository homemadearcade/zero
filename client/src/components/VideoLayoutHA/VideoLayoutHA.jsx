import React, { useState } from "react";
import { connect } from 'react-redux';

import {
  AgoraVideoPlayer,
} from "agora-rtc-react";

import './VideoLayoutHA.scss'
import VideoStatus from "../VideoStatus/VideoStatus";
import AgoraInputSelect from "../AgoraInputSelect/AgoraInputSelect";

const VideoLayoutHA = ({ participantId, guideId, auth: { me }, myTracks, userTracks, isAudioMuted, isVideoMuted, muteVideo, muteAudio }) => {
  let [showInfo, setShowInfo] = useState(false)
  let [showChangeInput, setShowChangeInput] = useState(false)

  const userTracksById = [{ uid: me.id, videoTrack: myTracks[1] }, ...userTracks].reduce((prev, next) => {
    prev[next.uid] = next
    return prev
  }, {})

  function Controls() {    
    if(showChangeInput) {
      return <AgoraInputSelect/>
    }

     return <div className="VideoLayoutHA__controls">
      {isAudioMuted ? <div className="VideoLayoutHA__control" onClick={muteAudio}>
          <i className="fas fa-microphone-slash"/>
        </div> : 
        <div className="VideoLayoutHA__control" onClick={muteAudio}>
          <i className="fas fa-microphone"/>
        </div>
      }
      {isVideoMuted ? <div className="VideoLayoutHA__control" onClick={muteVideo}>
          <i className="fas fa-video-slash"/>
        </div> : 
        <div className="VideoLayoutHA__control" onClick={muteVideo}>
          <i className="fas fa-video"/>
        </div>
      }
      <div className="VideoLayoutHA__control" onClick={() => {
        setShowChangeInput(true)
      }}>
        <i className="fas fa-gear" />
      </div>
    </div>
  }  

  return <div className="VideoLayoutHA">
    {userTracksById[participantId] && <Video 
      className="VideoLayoutHA__participant" 
      label="Participant" 
      videoTrack={userTracksById[participantId].videoTrack} 
      key={userTracksById[participantId].uid} 
      userId={userTracksById[participantId].uid} 
      setShowInfo={setShowInfo} 
      setShowChangeInput={setShowChangeInput}
      showInfo={showInfo} 
      me={me}
      controls={<Controls/>}
    />}
    {!userTracksById[participantId] && <div className="VideoLayoutHA__video-container VideoLayoutHA__participant"/>}
    {userTracksById[guideId] && <Video 
      className="VideoLayoutHA__guide" 
      label="Guide" 
      videoTrack={userTracksById[guideId].videoTrack} 
      key={userTracksById[guideId].uid}
      userId={userTracksById[guideId].uid} 
      setShowInfo={setShowInfo} 
      setShowChangeInput={setShowChangeInput}
      showInfo={showInfo} 
      me={me}
      controls={<Controls/>}
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

function Video({setShowInfo, setShowChangeInput, showInfo, className, label, me, videoTrack, userId, controls}) {
  const isMe = me.id === userId
  return <div className={"VideoLayoutHA__video-container " + className} onMouseEnter={() => {
    setShowInfo(userId)
  }} onMouseLeave={() => {
    setShowInfo(null)
    setShowChangeInput(false)
  }}>
    {showInfo === userId && <div className="VideoLayoutHA__info">
      {me.role === 'ADMIN' && <>
        {label ? label : null}
        {isMe && ' - me'}
        <VideoStatus userId={userId} me={me}/>
      </>}
      {isMe && controls}
    </div>}
    <AgoraVideoPlayer className="VideoLayoutHA__video" videoTrack={videoTrack}/>
  </div>
}