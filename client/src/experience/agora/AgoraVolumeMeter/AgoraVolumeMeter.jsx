import React, { useEffect, useRef, useState } from "react";
import { getThemePrimaryColor } from "../../../utils/webPageUtils";

import './AgoraVolumeMeter.scss'

const AgoraVolumeMeter = ({ audioTrack, username }) => {

  const [volume, setVolume] = useState()
  const volumeBar = useRef(null)

  useEffect(() => {
    setInterval(() => {
      if(!audioTrack && username) return console.log('no audio track', username)
      const volumePercent = audioTrack.getVolumeLevel()
      if(volumePercent < .1) {
        setVolume(audioTrack.getVolumeLevel() * 100) 
      } else {
        setVolume((audioTrack.getVolumeLevel() * 100) * 1.1) 
      }
    }, 300)
  })

  useEffect(() => {
    var bars = volumeBar.current?.children

    const style = 'background-color: ' + getThemePrimaryColor().hexString + ';';

    for (var i = 0; i < bars.length; i++) {
      if(volume / (100 / bars.length) > i) {
        bars[i].style = style
      } else {
        bars[i].style = null
      }
    }
  }, [volume]);

  return <div className="AgoraVolumeMeter" ref={volumeBar}>
    <div className="AgoraVolumeMeter__bar"></div>
    <div className="AgoraVolumeMeter__bar"></div>
    <div className="AgoraVolumeMeter__bar"></div>
    <div className="AgoraVolumeMeter__bar"></div>
    <div className="AgoraVolumeMeter__bar"></div>
    <div className="AgoraVolumeMeter__bar"></div>
    <div className="AgoraVolumeMeter__bar"></div>
    <div className="AgoraVolumeMeter__bar"></div>
    <div className="AgoraVolumeMeter__bar"></div>
    <div className="AgoraVolumeMeter__bar"></div>
  </div>
}

export default AgoraVolumeMeter