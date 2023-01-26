import React, { useEffect, useRef, useState } from "react";

import './AgoraVolumeMeter.scss'

const AgoraVolumeMeter = ({ audioTrack, username }) => {

  const [volume, setVolume] = useState()
  const volumeBar = useRef(null)

  useEffect(() => {
    setInterval(() => {
      if(!audioTrack) return console.log('no audio track', username)
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

    for (var i = 0; i < bars.length; i++) {
      if(volume / (100 / bars.length) > i) {
        bars[i].classList.add("on");
      } else {
        bars[i].classList.remove("on");
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