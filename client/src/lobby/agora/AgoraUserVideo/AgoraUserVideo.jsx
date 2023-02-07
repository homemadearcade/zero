import React from "react";
import { connect } from 'react-redux';

import './AgoraUserVideo.scss'

import AgoraVideo from "../AgoraVideo/AgoraVideo";

const AgoraUserVideo = ({ video: { isInsideVideoCall}, hideOverlay, className, userId, label, auth: { me }, myTracks, userTracks, width, height }) => {
  if(!isInsideVideoCall) {
    return <div className={className}></div>
  }

  if(!myTracks || !userTracks) {
    return <div style={{width, height}} className={className}/>
  }

  const tracks = [...userTracks]
  if(myTracks) tracks.unshift({ uid: me.id, videoTrack: myTracks[1], audioTrack: myTracks[0] })

  const userTracksById = tracks.reduce((prev, next) => {
    prev[next.uid] = next
    return prev
  }, {})

  if(!userTracksById[userId]) {
    return <div style={{width, height}} className={className}/>
  }

  return <div className={className} style={{width, height}}>
    <AgoraVideo
    hideOverlay={hideOverlay}
    tracks={userTracksById[userId]}
    label={label}
  /></div>
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  video: state.video,
});

export default connect(mapStateToProps, { })(AgoraUserVideo);