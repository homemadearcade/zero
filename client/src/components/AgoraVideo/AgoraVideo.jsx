import React, { useState } from "react";
import { connect } from 'react-redux';

import {
  AgoraVideoPlayer,
} from "agora-rtc-react";

import './AgoraVideo.scss'
import AgoraVideoStatus from "../AgoraVideoStatus/AgoraVideoStatus";
import AgoraInputSelect from "../AgoraInputSelect/AgoraInputSelect";

function Video({setShowInfo, setShowChangeInput, showInfo, hideOverlay, className, label, me, videoTrack, userId, controls}) {
  const isMe = me.id === userId
  return <div className={"AgoraVideo__video-container " + className} 
    onMouseEnter={() => {
      setShowInfo(userId)
    }} 
    onMouseLeave={() => {
      setShowInfo(null)
      setShowChangeInput(false)
    }}>
    {!hideOverlay && showInfo === userId && <div className="AgoraVideo__info">
      {me.role === 'ADMIN' && <>
        {label ? label : null}
        {isMe && ' - me'}
        <AgoraVideoStatus userId={userId} me={me}/>
      </>}
      {isMe && controls}
    </div>}
    <AgoraVideoPlayer className="AgoraVideo__video" videoTrack={videoTrack}/>
  </div>
}

const AgoraVideo = ({ tracks, auth: { me }, label, className, hideOverlay}) => {
  let [showInfo, setShowInfo] = useState(false)
  let [showChangeInput, setShowChangeInput] = useState(false)
  
  const [trackState, setTrackState] = useState({ video: true, audio: true });
  const muteVideo = async () => {
    try {
      await tracks.videoTrack.setEnabled(!trackState.video);
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    } catch(e) {
      console.error(e)
    }
  };
  const muteAudio = async () => {
    try{
      await tracks.audioTrack.setEnabled(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } catch(e) {
      console.error(e)
    }
  };

  function Controls() {    
    if(showChangeInput) {
      return <AgoraInputSelect/>
    }

     return <div className="AgoraVideo__controls">
      {trackState.audio ? <div className="AgoraVideo__control" onClick={muteAudio}>
          <i className="fas fa-microphone"/>
        </div> : 
        <div className="AgoraVideo__control" onClick={muteAudio}>
           <i className="fas fa-microphone-slash"/>
        </div>
      }
      {trackState.video ? <div className="AgoraVideo__control" onClick={muteVideo}>
          <i className="fas fa-video"/>
        </div> : 
        <div className="AgoraVideo__control" onClick={muteVideo}>
          <i className="fas fa-video-slash"/>
        </div>
      }
      <div className="AgoraVideo__control" onClick={() => {
        setShowChangeInput(true)
      }}>
        <i className="fas fa-gear" />
      </div>
    </div>
  }

  return <div className="AgoraVideo">
    {tracks && <Video 
      className={className} 
      label={label}
      videoTrack={tracks.videoTrack} 
      key={tracks.uid}
      userId={tracks.uid} 
      hideOverlay={hideOverlay}
      setShowInfo={setShowInfo} 
      setShowChangeInput={setShowChangeInput}
      showInfo={showInfo} 
      me={me}
      controls={<Controls/>}
     />}
    {!tracks && <div className="AgoraVideo__video-container AgoraVideo__guide"/>}
  </div>
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { })(AgoraVideo);