import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './GamePreview.scss';
import classNames from 'classnames';

const GamePreview = ({lobby: { lobby }}) => {

  const [isFocused, setIsFocused] = useState()



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
    <div className={classNames("GamePreview", {'GamePreview--not-focused': !isFocused })}>
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
