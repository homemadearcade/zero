import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';

import {
  AgoraVideoPlayer,
} from "agora-rtc-react";

import './VideoLayoutHA.scss'


const VideoLayoutHA = ({ lobby: {lobby}, auth: {me}, myTracks, userTracks, isAudioMuted, isVideoMuted, muteVideo, muteAudio }) => {
  return <div className="VideoLayoutHA">
    {lobby.participantId === me.id && <AgoraVideoPlayer className="VideoLayoutHA__video VideoLayoutHA__participant" videoTrack={myTracks[1]} key={me.id}/>}
    {lobby.guideId === me.id && <AgoraVideoPlayer className="VideoLayoutHA__video VideoLayoutHA__guide" videoTrack={myTracks[1]} key={me.id}/>}
    {userTracks.map((userTrack) => {
      if(lobby.guideId === userTrack.uid) {
        return <AgoraVideoPlayer className="VideoLayoutHA__video VideoLayoutHA__guide" videoTrack={userTrack.videoTrack} key={userTrack.uid}/>
      }
      if(lobby.participantId === userTrack.uid) {
        return <AgoraVideoPlayer className="VideoLayoutHA__video VideoLayoutHA__participant" videoTrack={userTrack.videoTrack} key={userTrack.uid}/>
      }

      return null
    })}
  </div>
}

const mapStateToProps = (state) => ({
  lobby: state.lobby,
  auth: state.auth,
});

export default connect(mapStateToProps, { })(VideoLayoutHA);
