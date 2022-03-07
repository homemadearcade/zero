import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';

import {
  AgoraVideoPlayer,
} from "agora-rtc-react";

import './VideoLayoutHA.scss'

const VideoLayoutHA = ({ lobby: {lobby}, auth: {me}, myTracks, userTracks, isAudioMuted, isVideoMuted, muteVideo, muteAudio }) => {
  let [showInfo, setShowInfo] = useState(false)
  
  function Video({className, label, videoTrack, userId, controls}) {

    let cameraStatus = ['Disconnected', 'Disconnected'];

    function getCameraStatus({uplinkNetworkQuality, downlinkNetworkQuality}) {
      let uplink
      if(uplinkNetworkQuality === 0 || !uplinkNetworkQuality) {
        uplink = 'Disconnected'
      }
      if(uplinkNetworkQuality === 1 || uplinkNetworkQuality === 2) {
        uplink = 'Good'
      }
      if(uplinkNetworkQuality === 3 || uplinkNetworkQuality === 4) {
        uplink = 'Poor'
      } 
      if(uplinkNetworkQuality === 5 || uplinkNetworkQuality === 6) {
        uplink = 'Terrible'
      } 
  
      let downlink
      if(downlinkNetworkQuality === 0 || !downlinkNetworkQuality) {
        downlink = 'Disconnected'
      }
      if(downlinkNetworkQuality === 1 || downlinkNetworkQuality === 2) {
        downlink = 'Good'
      }
      if(downlinkNetworkQuality === 3 || downlinkNetworkQuality === 4) {
        downlink = 'Poor'
      } 
      if(downlinkNetworkQuality === 5 || downlinkNetworkQuality === 6) {
        downlink = 'Terrible'
      } 
  
      return [uplink, downlink]
    }
  
    if(userId === me.id) {
      cameraStatus = getCameraStatus(window)
    } else if(window.remoteNetworkQuality && window.remoteNetworkQuality[userId]) {
      cameraStatus = getCameraStatus(window.remoteNetworkQuality[userId])
    }

    return <div className={"VideoLayoutHA__video-container " + className} onMouseEnter={() => {
      setShowInfo(true)
    }} onMouseLeave={() => {
      setShowInfo(false)
    }}>
      {showInfo && <div className="VideoLayoutHA__info">
        {me.role === 'ADMIN' && <>
          {label ? label : null}
          {me.id === userId && ' - me'}
          <div className="VideoLayoutHA__network-stats"><i className="fa-solid fa-arrow-up"/>{cameraStatus[0]}</div>
          <div className="VideoLayoutHA__network-stats"><i className="fa-solid fa-arrow-down"/>{cameraStatus[1]}</div>
        </>}
        {controls && <Controls/>}
      </div>}
      <AgoraVideoPlayer className="VideoLayoutHA__video" videoTrack={videoTrack}/>
    </div>
  }

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
