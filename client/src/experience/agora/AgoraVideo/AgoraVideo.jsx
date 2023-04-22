import React, { useState } from "react";
import { connect } from 'react-redux';

import {
  AgoraVideoPlayer,
} from "agora-rtc-react";

import './AgoraVideo.scss'
import AgoraVideoStatus from "../AgoraVideoStatus/AgoraVideoStatus";
import AgoraInputSelect from "../AgoraInputSelect/AgoraInputSelect";
import Icon from "../../../ui/Icon/Icon";
import { ADMIN_ROLE } from "../../../constants";

function Video({setShowInfo, setShowChangeInput, showChangeInput, showInfo, hideOverlay, className, label, me, tracks, userMongoId, controls}) {
  const isMe = me.id === userMongoId
  return <div className={"AgoraVideo " + className} 
    onMouseEnter={() => {
      setShowInfo(userMongoId)
    }} 
    onMouseLeave={() => {
      setShowInfo(null)
      setShowChangeInput(false)
    }}>
    {!hideOverlay && showInfo === userMongoId && <div className="AgoraVideo__info">
      {!showChangeInput && me.role === ADMIN_ROLE && <div className="AgoraVideo__details">
        <div>
          {label ? label : null}
          {isMe && ' - me'}
        </div>
        <div>
          Connection Speed:
          <AgoraVideoStatus userMongoId={userMongoId} me={me}/>
        </div>
      </div>}
      {isMe && controls}
    </div>}
    <AgoraVideoPlayer className="AgoraVideo__video" style={{height: '100%', width: '100%', position: 'static'}} videoTrack={tracks.videoTrack}/>
  </div>
}

const AgoraVideo = ({ tracks, auth: { me }, label, className, hideOverlay, width, height}) => {
  let [showInfo, setShowInfo] = useState(false)
  let [showChangeInput, setShowChangeInput] = useState(false)

  function Controls() {    
    if(showChangeInput) {
      return <>
        <AgoraInputSelect/>
      </>
    }

     return <div className="AgoraVideo__controls">
      <div className="AgoraVideo__control" onClick={() => {
        setShowChangeInput(true)
      }}>
        <Icon icon="faGear" />
      </div>
    </div>
  }

  return <>
    {tracks && <Video 
      className={className} 
      label={label}
      tracks={tracks} 
      key={tracks.uid}
      userMongoId={tracks.uid} 
      hideOverlay={hideOverlay}
      setShowInfo={setShowInfo} 
      setShowChangeInput={setShowChangeInput}
      showChangeInput={showChangeInput}
      showInfo={showInfo} 
      me={me}
      controls={<Controls/>}
      width={width}
      height={height}
     />}
    {!tracks && <div className="AgoraVideo"/>}
  </>
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { })(AgoraVideo);