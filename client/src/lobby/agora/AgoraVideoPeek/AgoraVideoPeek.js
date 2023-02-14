/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './AgoraVideoPeek.scss';
import AgoraUserVideo from '../AgoraUserVideo/AgoraUserVideo';
import AgoraVolumeMeter from '../AgoraVolumeMeter/AgoraVolumeMeter';

const AgoraVideoPeek = ({
  myTracks,
  userTracks,
  auth: { me },
  video: { isInsideVideoCall },
}) => {
  const [isHovering, setIsHovering] = useState()

  return (
    <div className="AgoraVideoPeek" onMouseLeave={() => {
      setIsHovering(false)
    }}>
      {isHovering && <AgoraUserVideo className="AgoraVideoPeek__video" myTracks={myTracks} userTracks={userTracks} userId={me.id}></AgoraUserVideo>}
      <div onMouseEnter={() => {
        setIsHovering(true)
      }} 
       className="AgoraVideoPeek__audio">
        {isInsideVideoCall && myTracks && <AgoraVolumeMeter audioTrack={myTracks[0]}/>}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  video: state.video,
  auth: state.auth
});

export default compose(
  connect(mapStateToProps, { }),
)(AgoraVideoPeek);
