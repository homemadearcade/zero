import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import './VideoStatus.scss';

const VideoStatus = ({ userId, me }) => {
  const [remoteNetworkQuality, setRemoteNetworkQuality] = useState({})
  const [myNetworkQuality, setMyNetworkQuality] = useState({})

  useEffect(() => {
    const clearEvent1 = window.events.on('ON_MY_VIDEO_QUALITY_STATUS_UPDATE', (networkQuality) => {
      setMyNetworkQuality(networkQuality)
    })

    const clearEvent2 = window.events.on('ON_REMOTE_VIDEO_QUALITY_STATUS_UPDATE', (remoteNetworkQuality) => {
      setRemoteNetworkQuality(remoteNetworkQuality)
    })

    return () => {
      clearEvent1()
      clearEvent2()
    }
  })

  let cameraStatus = ['Loading...', 'Loading...'];

  function getCameraStatus({uplinkNetworkQuality, downlinkNetworkQuality}) {
    let uplink
    if(!uplinkNetworkQuality) {
      uplink = 'Loading...'
    }

    if(uplinkNetworkQuality === 0) {
      uplink = 'Loading...'
    }
    if(uplinkNetworkQuality === 1 || uplinkNetworkQuality === 2) {
      uplink = 'Good'
    }
    if(uplinkNetworkQuality === 3 || uplinkNetworkQuality === 4) {
      uplink = 'Poor'
    } 
    if(uplinkNetworkQuality === 5 || uplinkNetworkQuality === 6) {
      uplink = 'Terrible'
    } 

    let downlink
    if(!downlinkNetworkQuality) {
      downlink = 'Loading...'
    }
    if(downlinkNetworkQuality === 0) {
      downlink = 'Loading...'
    }
    if(downlinkNetworkQuality === 1 || downlinkNetworkQuality === 2) {
      downlink = 'Good'
    }
    if(downlinkNetworkQuality === 3 || downlinkNetworkQuality === 4) {
      downlink = 'Poor'
    } 
    if(downlinkNetworkQuality === 5 || downlinkNetworkQuality === 6) {
      downlink = 'Terrible'
    } 

    return [uplink, downlink]
  }

  if(userId === me.id) {
    cameraStatus = getCameraStatus(myNetworkQuality)
  } else if(remoteNetworkQuality && remoteNetworkQuality[userId]) {
    cameraStatus = getCameraStatus(remoteNetworkQuality[userId])
  }

  return <div className="VideoStatus">
    <div className="VideoStatus__stat"><i className="fa-solid fa-arrow-up"/>{cameraStatus[0]}</div>
    <div className="VideoStatus__stat"><i className="fa-solid fa-arrow-down"/>{cameraStatus[1]}</div>
  </div>
};

export default VideoStatus
