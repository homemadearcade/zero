import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';

import {
  AgoraVideoPlayer,
} from "agora-rtc-react";

import './VideoLayoutHA.scss'
import VideoStatus from "../VideoStatus/VideoStatus";

const VideoLayoutHA = ({ participantId, guideId, auth: { me }, myTracks, userTracks, isAudioMuted, isVideoMuted, muteVideo, muteAudio }) => {
  let [showInfo, setShowInfo] = useState(false)
  
  function Video({className, label, videoTrack, userId, controls}) {
    return <div className={"VideoLayoutHA__video-container " + className} onMouseEnter={() => {
      setShowInfo(userId)
    }} onMouseLeave={() => {
      setShowInfo(userId)
    }}>
      {showInfo === userId && <div className="VideoLayoutHA__info">
        {me.role === 'ADMIN' && <>
          {label ? label : null}
          {me.id === userId && ' - me'}
          <VideoStatus userId={userId} me={me}/>
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
    {participantId === me.id && <Video className="VideoLayoutHA__participant" controls label="Participant" videoTrack={myTracks[1]} key={me.id} userId={me.id}/>}
    {guideId === me.id && <Video className="VideoLayoutHA__guide" controls label="Guide" videoTrack={myTracks[1]} key={me.id} userId={me.id}/>}
    {userTracks.map((userTrack) => {
      if(guideId === userTrack.uid) {
        return <Video className="VideoLayoutHA__guide" label="Guide" videoTrack={userTrack.videoTrack} key={userTrack.uid} userId={userTrack.uid}/>
      }
      if(participantId === userTrack.uid) {
        return <Video className="VideoLayoutHA__participant" label="Participant" videoTrack={userTrack.videoTrack} key={userTrack.uid} userId={userTrack.uid}/>
      }
      return null
    })}
    {!userTracksById[guideId] && <div className="VideoLayoutHA__video-container VideoLayoutHA__guide"/>}
    {!userTracksById[participantId] && <div className="VideoLayoutHA__video-container VideoLayoutHA__participant"/>}
  </div>
}

const mapStateToProps = (state) => ({
  participantId: state.lobby.lobby.participantId,
  guideId: state.lobby.lobby.guideId,
  auth: state.auth
});

export default connect(mapStateToProps, { })(VideoLayoutHA);
