import React, { useEffect, useRef, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './GamePreview.scss';
import classNames from 'classnames';
import IconButton from '../../../ui/IconButton/IconButton';
import { closeFullscreen, requestFullscreen } from '../../../utils/webPageUtils';

const GamePreview = ({lobby: { lobby }}) => {
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement)
  const [isFocused, setIsFocused] = useState()
  const previewRef = useRef()

  useEffect(() => {
    function checkFocus() {
      if(document.activeElement === document.getElementsByTagName("iframe")[0]) {
        setIsFocused(true)
      } else {
        setIsFocused(false)
      }
    }

    const iframeInterval = window.setInterval(checkFocus, 500) 

    return () => {
      clearInterval(iframeInterval)
    }
  })

  return (
    <div ref={previewRef} className={classNames("GamePreview", {'GamePreview--not-focused': !isFocused})}>
      <div className="GamePreview__fullscreen"><IconButton icon={isFullscreen ? "faCompress" : "faExpand"} onClick={() => {
        if(document.fullscreenElement) {
          closeFullscreen()
          setIsFullscreen(false)
        } else {
          requestFullscreen(previewRef.current)
          setIsFullscreen(true)
        }
      }}></IconButton></div>
      <iframe 
        title="gamepreview" 
        height="100%"
        width="100%"
        src={window.location.origin + '/lobby/' + lobby.id + '/join/' + lobby.participantId}>
      </iframe>
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
});

export default compose(
  connect(mapStateToProps, { })
)(GamePreview);
