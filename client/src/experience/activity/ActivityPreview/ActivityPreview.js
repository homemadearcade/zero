import React, { useEffect, useRef, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ActivityPreview.scss';
import classNames from 'classnames';
import IconButton from '../../../ui/IconButton/IconButton';
import { closeFullscreen, requestFullscreen } from '../../../utils/webPageUtils';
import CobrowsingGame from '../../cobrowsing/CobrowsingGame/CobrowsingGame';

const ActivityPreview = ({gameRoom: { gameRoom }, myTracks, userTracks}) => {
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

      //   <iframe 
      //   title="gamepreview" 
      //   height="100%"
      //   width="100%"
      //   src={window.location.origin + '/lobby/' + lobby.id + '/join/' + lobby.participantId}>
      // </iframe>

  return (
     <>
      <div className="ActivityPreview__fullscreen"><IconButton icon={isFullscreen ? "faCompress" : "faExpand"} onClick={() => {
          if(document.fullscreenElement) {
            closeFullscreen()
            setIsFullscreen(false)
          } else {
            requestFullscreen(previewRef.current)
            setIsFullscreen(true)
          }
        }}></IconButton></div>
      <div ref={previewRef} className={classNames("ActivityPreview", {'ActivityPreview--not-focused': !isFocused})}>
        <CobrowsingGame rootFontSize="1vh" gameId={gameRoom.gameId} myTracks={myTracks} userTracks={userTracks}/>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  gameRoom: state.gameRoom
});

export default compose(
  connect(mapStateToProps, { })
)(ActivityPreview);
