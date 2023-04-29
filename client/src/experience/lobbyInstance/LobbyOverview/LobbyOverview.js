/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './LobbyOverview.scss';
import Typography from '../../../ui/Typography/Typography';
import LobbyMember from '../LobbyMember/LobbyMember';
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

  let usersWithoutRole = lobbyInstance.members.filter((member) => {
    const roleIdToUserMongoIds = lobbyInstance.roleIdToUserMongoIds
    for(let roleId in roleIdToUserMongoIds) {
      const userMongoIds = roleIdToUserMongoIds[roleId]
      if(userMongoIds.includes(member.userMongoId)) return false
    }
    return true
  })

  return (
    <div className="LobbyOverview">
      <Typography component="div" variant="subtitle1">{"Lobby: "}<br/></Typography>
      <Typography component="div" variant="subtitle2">{lobbyInstance.id}</Typography>
      <Divider></Divider>
      <LobbySelectRoles myTracks={myTracks} userTracks={userTracks}></LobbySelectRoles>
      <Divider></Divider>
      {usersWithoutRole.length > 0 && <div className="LobbyOverview__others">
        <Typography component="div" variant="subtitle1">Without Role:</Typography>
        <div>{usersWithoutRole.map((user) => {
          return <LobbyMember key={user.userMongoId} myTracks={myTracks} userTracks={userTracks} userMongoId={user.userMongoId}></LobbyMember>
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
