import React, { useState } from "react";
import { connect } from 'react-redux';

import './AgoraUserVideo.scss'

import AgoraVideo from "../AgoraVideo/AgoraVideo";
import { generateUniqueId, inIframe } from "../../../utils/webPageUtils";
import { useEffect } from "react";
import { setVideoTrackInterfaceIdClosed, setVideoTrackInterfaceIdOpen } from "../../../store/actions/experience/videoActions";
import axios from "axios";
import { attachTokenToHeaders } from "../../../store/actions/auth/authActions";
import store from "../../../store";
import { stringToColour } from "../../../utils/colorUtils";

const AgoraUserVideo = ({ 
  video: { isInsideVideoCall, currentVideoTrackInterfaceId }, 
  hideOverlay, 
  className, 
  userMongoId, 
  label, 
  auth: { me }, 
  myTracks, 
  userTracks, 
  width, 
  height, 
  setVideoTrackInterfaceIdOpen,
  setVideoTrackInterfaceIdClosed,
  interfaceId
 }) => {
  const [user, setUser] = useState()

  useEffect(() => {
    setTimeout(() => {
      setVideoTrackInterfaceIdOpen({interfaceId, userMongoId})
    },100)
    return () => {
      setVideoTrackInterfaceIdClosed({interfaceId, userMongoId})
    }
  }, [])

  useEffect(() => {
    async function goGetUser() {
      const options = attachTokenToHeaders(store.getState);
      const user = await axios.get(`/api/users/byId/${userMongoId}`, options);
      setUser(user.data.user)
    }
    if(userMongoId) {
      goGetUser()
    }
  }, [userMongoId])

  function renderPlaceholder() {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)'}} className={className}>
      {user && <div style={{position: 'relative', backgroundColor: stringToColour(user.id), padding: '1em'}}>
       <div style={{opacity: 0}}>{user.username}</div>
        <div style={{position: 'absolute', top: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', display: 'flex', alignItems: 'center', width: '100%', height: '100%'}}>
          {user.username}
        </div>
      </div>}
    </div>
  }

  if(!currentVideoTrackInterfaceId[userMongoId] || currentVideoTrackInterfaceId[userMongoId] !== interfaceId) {
    return renderPlaceholder()
  }

  if(!isInsideVideoCall) {
    return renderPlaceholder()
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

  if(!userTracksById[userMongoId]) {
    return renderPlaceholder()
  }

  return <div className={className} style={{width, height}}>
    <AgoraVideo
    hideOverlay={hideOverlay}
    tracks={userTracksById[userMongoId]}
    label={label}
    width={width}
    height={height}
  /></div>
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  video: state.video,
});

export default connect(mapStateToProps, { setVideoTrackInterfaceIdOpen, setVideoTrackInterfaceIdClosed })(AgoraUserVideo);