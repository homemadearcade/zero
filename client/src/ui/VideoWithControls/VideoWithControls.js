import { Fade } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Icon from '../Icon/Icon';

import './VideoWithControls.scss';

const VideoWithControls = ({ videoSrc, className, thumbnailSrc, autoPlay, unmuteOnMouseEnter, loop }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [isMuted, setIsMuted] = useState(!unmuteOnMouseEnter)

  const [showControls, setShowControls] = useState(true)

  const videoRef = useRef(null)

  useEffect(() => {
    videoRef.current.load()

    if(autoPlay) {
      tryToPlay()
      const tryToPlayInterval = setInterval(tryToPlay, 100);
  
      function tryToPlay() {
        
        if(!videoRef.current) return
  
        videoRef.current.play()
        .then(() => {
          setIsPlaying(true)
          clearInterval(tryToPlayInterval);
        })
        .catch(error => {
          setIsPlaying(false)
          console.info('User has not interacted with document yet.');
        });
      }
    }
  }, [])

  return <div className={"VideoWithControls " + className}>
      {!isPlaying && <img className="VideoWithControls__thumbnail" src={thumbnailSrc}></img>}
      <video ref={videoRef} playInline muted loop={loop}
        onLoadedData={() => {
          setIsLoading(false)
        }}>
          <source src={videoSrc} type="video/mp4"/>
      </video>
      <div className="VideoWithControls__controls" 
        onMouseEnter={() => {
          setShowControls(true)
          if(unmuteOnMouseEnter) {
            videoRef.current.muted = false
          }
        }}
        onMouseLeave={() => {
          setShowControls(false)
          if(unmuteOnMouseEnter) {
            videoRef.current.muted = true
          }
        }}
      >
        {isLoading && <div className="VideoWithControls__loading">Loading...</div>}
        {!isLoading && !isPlaying && <Icon className="cursor-pointer"  icon="faPlay" onClick={() => {
          videoRef.current.play()
          setIsPlaying(true)
        }}/>}
        {showControls && isPlaying && <Fade in><div className="VideoWithControls__control-bar">
          {!isPaused && <Icon className="cursor-pointer"  icon="faPause" onClick={() => {
            videoRef.current.pause()
            setIsPaused(true)
          }}/>}
          {isPaused && <Icon className="cursor-pointer"  icon="faPlay" onClick={() => {
            videoRef.current.play()
            setIsPaused(false)
          }}/>}

          {!unmuteOnMouseEnter && isMuted && <Icon className="cursor-pointer"  icon="faVolumeXmark" onClick={() => {
            videoRef.current.muted = false
            setIsMuted(false)
          }}/>}
          {!unmuteOnMouseEnter && !isMuted && <Icon className="cursor-pointer" icon="faVolumeHigh" onClick={() => {
            videoRef.current.muted = true
            setIsMuted(true)
          }}/>}
        </div></Fade>}
      </div>
   </div>
};

export default VideoWithControls
