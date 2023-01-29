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
      {!cutAudio ? <div className="AgoraToolbar__control" onClick={muteAudio}>
          <Icon size="lg" icon="faMicrophone"/>
        </div> : 
        <div className="AgoraToolbar__control" onClick={muteAudio}>
           <Icon  size="lg" icon="faMicrophoneSlash"/>
        </div>
      }
      {!cutVideo ? <div className="AgoraToolbar__control" onClick={muteVideo}>
          <Icon size="lg" icon="faVideo"/>
        </div> : 
        <div className="AgoraToolbar__control" onClick={muteVideo}>
          <Icon size="lg" icon="faVideoSlash"/>
        </div>
      }
    </>
  }

 return <>
  <div className="AgoraToolbar">
    <Controls></Controls>
  </div>
  <AgoraVolumeMeter audioTrack={audioTrack}/>
  </>
};

const mapStateToProps = (state) => ({
  video: state.video,
});

export default compose(
  connect(mapStateToProps, { setCutAudio, setCutVideo }))(AgoraToolbar);
