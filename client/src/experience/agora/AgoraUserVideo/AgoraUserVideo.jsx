import React, { useState } from "react";
import { connect } from 'react-redux';

import './AgoraUserVideo.scss'

import AgoraVideo from "../AgoraVideo/AgoraVideo";
import { generateUniqueId, inIframe } from "../../../utils/webPageUtils";
import { useEffect } from "react";
import { setVideoTrackComponent } from "../../../store/actions/videoActions";
import axios from "axios";
import { attachTokenToHeaders } from "../../../store/actions/authActions";
import store from "../../../store";
import { stringToColour } from "../../../utils/colorUtils";

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
  const [user, setUser] = useState()
  
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

  useEffect(() => {
    async function goGetUser() {
      const options = attachTokenToHeaders(store.getState);
      const user = await axios.get(`/api/users/byId/${userId}`, options);
      setUser(user.data.user)
    }
    if(userId) {
      goGetUser()
    }
  }, [userId])

  function renderPlaceholder() {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)'}} className={className}>
      {user && <div style={{position: 'relative', backgroundColor: stringToColour(user.id), padding: '1rem'}}>
       <div style={{opacity: 0}}>{user.username}</div>
        <div style={{position: 'absolute', top: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', display: 'flex', alignItems: 'center', width: '100%', height: '100%'}}>
          {user.username}
        </div>
      </div>}
    </div>
  }

  if(!videoTrackComponentIds[userId] || videoTrackComponentIds[userId] !== componentId) {
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

  if(!userTracksById[userId]) {
    console.log('no user tracks!', userId)
    return renderPlaceholder()
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