import React from "react";
import { connect } from 'react-redux';

import './AgoraVideoLayoutHA.scss'

import AgoraVideo from "../AgoraVideo/AgoraVideo";

const AgoraVideoLayoutHA = ({ participantId, guideId, auth: { me }, myTracks, userTracks, cobrowsingUser }) => {
  const userTracksById = [{ uid: me.id, videoTrack: myTracks[1], audioTrack: myTracks[0] }, ...userTracks].reduce((prev, next) => {
    prev[next.uid] = next
    return prev
  }, {})

  return <div className="AgoraVideoLayoutHA">
     {userTracksById[guideId] && <AgoraVideo
        tracks={userTracksById[guideId] }
        className="AgoraVideo__guide"
        label="Guide"
     />}
    {!userTracksById[guideId] && <div className="AgoraVideoLayoutHA__video-container AgoraVideo__guide"/>}
    {guideId === cobrowsingUser.id && <>
      {userTracksById[participantId] && <AgoraVideo 
        tracks={userTracksById[participantId]}
        className="AgoraVideo__participant"
        label="Participant"
      />}
      {!userTracksById[participantId] && <div className="AgoraVideoLayoutHA__video-container AgoraVideo__participant"/>}
    </>}
  </div>
}

const mapStateToProps = (state) => ({
  participantId: state.lobby.lobby.participantId,
  guideId: state.lobby.lobby.guideId,
  auth: state.auth,
  cobrowsingUser: state.cobrowsing.cobrowsingUser
});

export default connect(mapStateToProps, { })(AgoraVideoLayoutHA);