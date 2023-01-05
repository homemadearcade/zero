import React from "react";
import { connect } from 'react-redux';

import './AgoraVideoLayoutHA.scss'

import AgoraUserVideo from "../AgoraUserVideo/AgoraUserVideo";
import { ADMIN_ROLE } from "../../constants";

const AgoraVideoLayoutHA = ({ participantId, cobrowsing: { isCurrentlyCobrowsing}, guideId, auth: { me }, myTracks, userTracks }) => {
  return <div className="AgoraVideoLayoutHA">
     <AgoraUserVideo
        userId={guideId}
        className="AgoraVideo__guide"
        label="Guide"
        myTracks={myTracks}
        userTracks={userTracks}
     />
    {me.role === ADMIN_ROLE && !isCurrentlyCobrowsing && <>
      <AgoraUserVideo
        userId={participantId}
        className="AgoraVideo__participant"
        label="Participant"
        myTracks={myTracks}
        userTracks={userTracks}
      />
    </>}
  </div>
}

const mapStateToProps = (state) => ({
  participantId: state.lobby.lobby.participantId,
  guideId: state.lobby.lobby.guideId,
  auth: state.auth,
  cobrowsing: state.cobrowsing
});

export default connect(mapStateToProps, { })(AgoraVideoLayoutHA);