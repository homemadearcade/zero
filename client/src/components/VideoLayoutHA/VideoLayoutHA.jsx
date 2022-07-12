import React from "react";
import { connect } from 'react-redux';

import './VideoLayoutHA.scss'

import AgoraVideo from "../agora/AgoraVideo/AgoraVideo";

const VideoLayoutHA = ({ participantId, guideId, auth: { me }, myTracks, userTracks }) => {
  const userTracksById = [{ uid: me.id, videoTrack: myTracks[1], audioTrack: myTracks[0] }, ...userTracks].reduce((prev, next) => {
    prev[next.uid] = next
    return prev
  }, {})

  return <div className="VideoLayoutHA">
     {userTracksById[guideId] && <AgoraVideo
        tracks={userTracksById[guideId] }
        className="AgoraVideo__guide"
        label="Guide"
     />}
    {!userTracksById[guideId] && <div className="VideoLayoutHA__video-container AgoraVideo__guide"/>}
    {userTracksById[participantId] && <AgoraVideo 
        tracks={userTracksById[participantId]}
        className="AgoraVideo__participant"
        label="Participant"
    />}
    {!userTracksById[participantId] && <div className="VideoLayoutHA__video-container AgoraVideo__participant"/>}
  </div>
}

const mapStateToProps = (state) => ({
  participantId: state.lobby.lobby.participantId,
  guideId: state.lobby.lobby.guideId,
  auth: state.auth
});

export default connect(mapStateToProps, { })(VideoLayoutHA);