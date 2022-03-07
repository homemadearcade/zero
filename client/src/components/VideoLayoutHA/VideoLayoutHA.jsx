import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';

import {
  AgoraVideoPlayer,
} from "agora-rtc-react";

import './VideoLayoutHA.scss'

const VideoLayoutHA = ({ lobby: {lobby}, auth: {me}, myTracks, userTracks, isAudioMuted, isVideoMuted, muteVideo, muteAudio }) => {
  let [showControls, setShowControls] = useState(false)

  function Video({className, label, videoTrack, userId, controls}) {
    return <div className={"VideoLayoutHA__video-container " + className} onMouseEnter={() => {
      setShowControls(true)
    }} onMouseLeave={() => {
      setShowControls(false)
    }}>
      {label && me.role === 'ADMIN' && <div className="VideoLayoutHA__label">
        {label}
        {me.id === userId && ' - me'}
      </div>}
      {controls && showControls && <Controls/>}
      <AgoraVideoPlayer className="VideoLayoutHA__video" videoTrack={videoTrack}/>
    </div>
  }

  console.log(isAudioMuted)

  function Controls() {
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

  const userTracksById = [{ uid: me.id, ...myTracks[1] }, ...userTracks].reduce((prev, next) => {
    prev[next.uid] = next
    return prev
  }, {})

  return <div className="VideoLayoutHA">
    {lobby.participantId === me.id && <Video className="VideoLayoutHA__participant" controls label="Participant" videoTrack={myTracks[1]} key={me.id} userId={me.id}/>}
    {lobby.guideId === me.id && <Video className="VideoLayoutHA__guide" controls label="Guide" videoTrack={myTracks[1]} key={me.id} userId={me.id}/>}
    {userTracks.map((userTrack) => {
      if(lobby.guideId === userTrack.uid) {
        return <Video className="VideoLayoutHA__guide" label="Guide" videoTrack={userTrack.videoTrack} key={userTrack.uid} userId={userTrack.uid}/>
      }
      if(lobby.participantId === userTrack.uid) {
        return <Video className="VideoLayoutHA__participant" label="Participant" videoTrack={userTrack.videoTrack} key={userTrack.uid} userId={userTrack.uid}/>
      }
      return null
    })}
    {!userTracksById[lobby.guideId] && <div className="VideoLayoutHA__video-container VideoLayoutHA__guide"/>}
    {!userTracksById[lobby.participantId] && <div className="VideoLayoutHA__video-container VideoLayoutHA__participant"/>}
  </div>
}

const mapStateToProps = (state) => ({
  lobby: state.lobby,
  auth: state.auth,
});

export default connect(mapStateToProps, { })(VideoLayoutHA);
