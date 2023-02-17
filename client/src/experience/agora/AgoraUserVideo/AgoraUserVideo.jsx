import React, { useState } from "react";
import { connect } from 'react-redux';

import './AgoraUserVideo.scss'

import AgoraVideo from "../AgoraVideo/AgoraVideo";
import { generateUniqueId, inIframe } from "../../../utils/webPageUtils";
import { useEffect } from "react";
import { setVideoTrackComponent } from "../../../store/actions/videoActions";

const AgoraUserVideo = ({ 
  video: { isInsideVideoCall, videoTrackComponentIds}, 
  hideOverlay, 
  className, 
  userId, 
  label, 
  auth: { me }, 
  myTracks, 
  userTracks, 
  width, 
  height, 
  setVideoTrackComponent
 }) => {
  const [componentId] = useState(generateUniqueId())
  
  useEffect(() => {
    if(!videoTrackComponentIds[userId]) {
      // if(!inIframe()) console.log('setting')
      setVideoTrackComponent({componentId, userId})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoTrackComponentIds[userId]])

  useEffect(() => {
    return () => {
      if(componentId === videoTrackComponentIds[userId]) {
              // if(!inIframe()) console.log('unsetting')
        setVideoTrackComponent({componentId: null, userId})
      }
    }
  }, [videoTrackComponentIds[userId]])

  if(!videoTrackComponentIds[userId] || videoTrackComponentIds[userId] !== componentId) return <div className={className}></div>

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
    console.log('no user tracks!', userId)
    return <div style={{width, height}} className={className}/>
  }

  return <div className={className} style={{width, height}}>
    <AgoraVideo
    hideOverlay={hideOverlay}
    tracks={userTracksById[userId]}
    label={label}
    width={width}
    height={height}
  /></div>
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  video: state.video,
});

export default connect(mapStateToProps, { setVideoTrackComponent })(AgoraUserVideo);