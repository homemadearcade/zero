import React from "react";
import { connect } from 'react-redux';

import './AgoraVideoLayoutHA.scss'

import AgoraUserVideo from "../AgoraUserVideo/AgoraUserVideo";

const AgoraVideoLayoutHA = ({ participantId, cobrowsing: { isActivelyCobrowsing}, guideId, auth: { me }, myTracks, userTracks }) => {
  return <div className="AgoraVideoLayoutHA">
     <AgoraUserVideo
        userId={guideId}
        className="AgoraVideo__guide"
        label="Guide"
        myTracks={myTracks}
        userTracks={userTracks}
     />
  </div>
}

const mapStateToProps = (state) => ({
  participantId: state.lobby.lobby.participantId,
  guideId: state.lobby.lobby.guideId,
  auth: state.auth,
  cobrowsing: state.cobrowsing
});

export default connect(mapStateToProps, { })(AgoraVideoLayoutHA);