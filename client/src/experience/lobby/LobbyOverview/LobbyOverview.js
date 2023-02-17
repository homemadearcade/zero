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
  lobby: { lobby },
  myTracks, userTracks,
}) => {
  // const membersById = lobby.members.reduce((prev, next) => {
  //   prev[next.id] = next
  //   return prev
  // }, {})

  const otherMembers = lobby.members.filter((user) => {
    if(user.id ===lobby.guideId || user.id === lobby.participantId) return null
    return true
  })

  return (
    <div className="LobbyOverview">
      <Typography component="div" variant="subtitle1">{"Lobby: "}<br/></Typography>
      <Typography component="div" variant="subtitle2">{lobby.id}</Typography>
      <Divider></Divider>
      <LobbySelectRoles myTracks={myTracks} userTracks={userTracks}></LobbySelectRoles>
      <Divider></Divider>
      {otherMembers.length > 0 && <div className="LobbyOverview__others">
        <Typography component="div" variant="subtitle1">Others:</Typography>
        <div>{otherMembers.map((user) => {
          return <LobbyUsername myTracks={myTracks} userTracks={userTracks} userId={user.id}></LobbyUsername>
        })}</div>
      </div>}
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
});

export default compose(
  connect(mapStateToProps, {  }),
)(LobbyOverview);
