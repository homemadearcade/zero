import React, { useEffect, useRef } from 'react';
import './AudioPlayerMicro.scss';
import Icon from '../Icon/Icon';
import classNames from 'classnames';

const AudioPlayerMicro = ({ isPlaying, src, type, onClick }) => {
  const audioRef = useRef(null)

  useEffect(() => {
    if(isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  return <div className="AudioPlayerMicro" onClick={onClick}>
    <Icon className={classNames("AudioPlayerMicro__music", { 'AudioPlayerMicro__music--playing': isPlaying})} icon="faMusic">

    </Icon>
    <audio ref={audioRef} loop>
      <source src={src} type={type}/>
    </audio>
  </div>
};


export default AudioPlayerMicro
