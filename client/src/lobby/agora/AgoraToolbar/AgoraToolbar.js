import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './AgoraToolbar.scss';
import Icon from '../../../ui/Icon/Icon';
import AgoraVolumeMeter from '../AgoraVolumeMeter/AgoraVolumeMeter';
import { setCutAudio, setCutVideo } from '../../../store/actions/videoActions';

const AgoraToolbar = ({ tracks, video: { cutVideo, cutAudio }, setCutVideo, setCutAudio }) => {
  const audioTrack = tracks[0]

  const muteVideo = async () => {
    try {
      setCutVideo(!cutVideo);
    } catch(e) {
      console.error(e)
    }
  };
  
  const muteAudio = async () => {
    try{
      setCutAudio(!cutAudio)
    } catch(e) {
      console.error(e)
    }
  };

  function Controls() {    
     return <>
        {!cutVideo ? <div className="AgoraToolbar__control" onClick={muteVideo}>
          <Icon size="sm" icon="faVideo"/>
        </div> : 
        <div className="AgoraToolbar__control" onClick={muteVideo}>
          <Icon size="sm" icon="faVideoSlash"/>
        </div>
      }
      {!cutAudio ? <div className="AgoraToolbar__control" onClick={muteAudio}>
          <Icon size="sm" icon="faMicrophone"/>
        </div> : 
        <div className="AgoraToolbar__control" onClick={muteAudio}>
           <Icon  size="sm" icon="faMicrophoneSlash"/>
        </div>
      }
    </>
  }

 return <div className="AgoraToolbar">
  <div className="AgoraToolbar__controls">
    <Controls></Controls>
  </div>
  <AgoraVolumeMeter audioTrack={audioTrack}/>
  </div>
};

const mapStateToProps = (state) => ({
  video: state.video,
});

export default compose(
  connect(mapStateToProps, { setCutAudio, setCutVideo }))(AgoraToolbar);
