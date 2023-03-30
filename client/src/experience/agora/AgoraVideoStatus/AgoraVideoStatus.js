import React, { useEffect, useState } from 'react';

import { useAgoraVideoCallClient } from '../../../store/actions/experience/videoActions';
import Icon from '../../../ui/Icon/Icon';
import { ON_MY_VIDEO_QUALITY_STATUS_UPDATE } from '../../../constants';
import './AgoraVideoStatus.scss';

const AgoraVideoStatus = ({ userMongoId, me }) => {
  const client = useAgoraVideoCallClient()

  const [remoteNetworkQuality, setRemoteNetworkQuality] = useState({})
  const [myNetworkQuality, setMyNetworkQuality] = useState({})

  useEffect(() => {
    const clearMyVideoQualityEvent = window.events.on(ON_MY_VIDEO_QUALITY_STATUS_UPDATE, (networkQuality) => {
      setMyNetworkQuality(networkQuality)
    })

    let updateQualityInterval = setInterval(() => {
      setRemoteNetworkQuality(client.getRemoteNetworkQuality())
    }, 1000)

    return () => {
      clearMyVideoQualityEvent()
      clearInterval(updateQualityInterval)
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

  if(userMongoId === me.id) {
    cameraStatus = getCameraStatus(myNetworkQuality)
  } else if(remoteNetworkQuality && remoteNetworkQuality[userMongoId]) {
    cameraStatus = getCameraStatus(remoteNetworkQuality[userMongoId])
  }

  return <div className="AgoraVideoStatus">
    <div className="AgoraVideoStatus__stat"><Icon icon="faArrowUp"/>{cameraStatus[0]}</div>
    <div className="AgoraVideoStatus__stat"><Icon icon="faArrowDown"/>{cameraStatus[1]}</div>
  </div>
};

export default AgoraVideoStatus
