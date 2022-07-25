import React, { useState } from "react";
import { connect } from 'react-redux';

import {
  AgoraVideoPlayer,
} from "agora-rtc-react";

import './AgoraVideo.scss'
import AgoraVideoStatus from "../AgoraVideoStatus/AgoraVideoStatus";
import AgoraInputSelect from "../AgoraInputSelect/AgoraInputSelect";
import AgoraVolumeMeter from "../AgoraVolumeMeter/AgoraVolumeMeter";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone, faMicrophoneSlash, faGear, faVideo, faVideoSlash } from '@fortawesome/free-solid-svg-icons'

function Video({setShowInfo, setShowChangeInput, showChangeInput, showInfo, hideOverlay, className, label, me, tracks, userId, controls}) {
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
      {!showChangeInput && me.role === 'ADMIN' && <div className="AgoraVideo__details">
        <div>
          {label ? label : null}
          {isMe && ' - me'}
        </div>
        <div>
          Connection Speed:
          <AgoraVideoStatus userId={userId} me={me}/>
        </div>
      </div>}
      {isMe && controls}
    </div>}
    <AgoraVideoPlayer className="AgoraVideo__video" videoTrack={tracks.videoTrack}/>
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
      return <>
        <AgoraInputSelect/>
        <div>
          Microphone Volume:
          <AgoraVolumeMeter audioTrack={tracks.audioTrack}/>
        </div>
      </>
    }

     return <div className="AgoraVideo__controls">
      {trackState.audio ? <div className="AgoraVideo__control" onClick={muteAudio}>
          <FontAwesomeIcon icon={faMicrophone}/>
        </div> : 
        <div className="AgoraVideo__control" onClick={muteAudio}>
           <FontAwesomeIcon icon={faMicrophoneSlash}/>
        </div>
      }
      {trackState.video ? <div className="AgoraVideo__control" onClick={muteVideo}>
          <FontAwesomeIcon icon={faVideo}/>
        </div> : 
        <div className="AgoraVideo__control" onClick={muteVideo}>
          <FontAwesomeIcon icon={faVideoSlash}/>
        </div>
      }
      <div className="AgoraVideo__control" onClick={() => {
        setShowChangeInput(true)
      }}>
        <FontAwesomeIcon icon={faGear} />
      </div>
    </div>
  }

  return <div className="AgoraVideo">
    {tracks && <Video 
      className={className} 
      label={label}
      tracks={tracks} 
      key={tracks.uid}
      userId={tracks.uid} 
      hideOverlay={hideOverlay}
      setShowInfo={setShowInfo} 
      setShowChangeInput={setShowChangeInput}
      showChangeInput={showChangeInput}
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