import React, { useEffect, useState } from "react";

import './AgoraVolumeMeter.scss'

const AgoraVolumeMeter = ({ audioTrack }) => {

  const [volume, setVolume] = useState()

  useEffect(() => {
    setInterval(() => {
      setVolume((audioTrack.getVolumeLevel() * 100) * 1.1) 
    }, 300)
  })

  useEffect(() => {
    var bars = document.getElementsByClassName("AgoraVolumeMeter__bar");
    for (var i = 0; i < bars.length; i++) {
      if(volume / (100 / bars.length) > i) {
        bars[i].classList.add("on");
      } else {
        bars[i].classList.remove("on");
      }
    }
  }, [volume]);

  return <div className="AgoraVolumeMeter">
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