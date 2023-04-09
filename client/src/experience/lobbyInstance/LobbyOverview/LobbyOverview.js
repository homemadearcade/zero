/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './LobbyOverview.scss';
import Typography from '../../../ui/Typography/Typography';
import LobbyUsername from '../LobbyMember/LobbyMember';
import LobbySelectRoles from '../LobbySelectRoles/LobbySelectRoles';
import Divider from '../../../ui/Divider/Divider';

const LobbyOverview = ({
  lobbyInstance: { lobbyInstance },
  myTracks, userTracks,
}) => {
  // const membersById = lobbyInstance.members.reduce((prev, next) => {
  //   prev[next.id] = next
  //   return prev
  // }, {})

  const otherMembers = lobbyInstance.members.filter((user) => {
    if(user.userMongoId ===lobbyInstance.guideId || user.userMongoId === lobbyInstance.participantId) return null
    return true
  })

  return (
    <div className="LobbyOverview">
      <Typography component="div" variant="subtitle1">{"Lobby: "}<br/></Typography>
      <Typography component="div" variant="subtitle2">{lobbyInstance.id}</Typography>
      <Divider></Divider>
      <LobbySelectRoles myTracks={myTracks} userTracks={userTracks}></LobbySelectRoles>
      <Divider></Divider>
      {otherMembers.length > 0 && <div className="LobbyOverview__others">
        <Typography component="div" variant="subtitle1">Audience:</Typography>
        <div>{otherMembers.map((user) => {
          return <LobbyUsername myTracks={myTracks} userTracks={userTracks} userMongoId={user.userMongoId}></LobbyUsername>
        })}</div>
      </div>}
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobbyInstance: state.lobbyInstance,
});

export default compose(
  connect(mapStateToProps, {  }),
)(LobbyOverview);
