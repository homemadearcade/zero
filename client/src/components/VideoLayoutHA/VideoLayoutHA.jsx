import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';

import {
  AgoraVideoPlayer,
} from "agora-rtc-react";

import './VideoLayoutHA.scss'

const VideoLayoutHA = ({ lobby: {lobby}, auth: {me}, myTracks, userTracks, isAudioMuted, isVideoMuted, muteVideo, muteAudio }) => {

  function Video({className, label, videoTrack, userId}) {
    return <div className={"VideoLayoutHA__video-container " + className}>
      {label && me.role === 'ADMIN' && <div className="VideoLayoutHA__label">
        {label}
        {me.id === userId && ' - me'}
      </div>}
      <AgoraVideoPlayer className="VideoLayoutHA__video" videoTrack={videoTrack}/>
    </div>
  }

  const userTracksById = [{ uid: me.id, ...myTracks[1] }, ...userTracks].reduce((prev, next) => {
    prev[next.uid] = next
    return prev
  }, {})

  return <div className="VideoLayoutHA">
    {lobby.participantId === me.id && <Video className="VideoLayoutHA__participant" label="Participant" videoTrack={myTracks[1]} key={me.id} userId={me.id}/>}
    {lobby.guideId === me.id && <Video className="VideoLayoutHA__guide" label="Guide" videoTrack={myTracks[1]} key={me.id} userId={me.id}/>}
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
