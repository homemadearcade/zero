/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { editLobby } from '../../../store/actions/experience/lobbyInstanceActions';

import './LobbySelectRoles.scss';
import SelectUsers from '../../../ui/connected/SelectUsers/SelectUsers';
import Typography from '../../../ui/Typography/Typography';
import LobbyUsername from '../LobbyMember/LobbyMember';
import Divider from '../../../ui/Divider/Divider';

const LobbySelectRoles = ({
  editLobby,
  lobbyInstance: { lobbyInstance },
  myTracks, userTracks,
}) => {  
  return <>
      <Typography component="span" variant="subtitle1">Participant:</Typography>
      <LobbyUsername myTracks={myTracks} userTracks={userTracks} userMongoId={lobbyInstance.participantId}></LobbyUsername>
      {lobbyInstance.participantId && <SelectUsers userMongoIds={lobbyInstance.members.map((member) => member.userMongoId)} label="Select Participant" onSelect={(users) => {
        if(users[0]) {
          editLobby(lobbyInstance.id, {
            participantId: users[users.length - 1]
          })
        }
      }}/>}
    <Divider></Divider>
      <Typography component="span" variant="subtitle1">Guide:</Typography>
      <LobbyUsername myTracks={myTracks} userTracks={userTracks} userMongoId={lobbyInstance.guideId}></LobbyUsername>
      {lobbyInstance.guideId && <SelectUsers userMongoIds={lobbyInstance.members.map((member) => member.userMongoId)} label="Select Guide" onSelect={(users) => {
        if(users[0]) {
          editLobby(lobbyInstance.id, {
            guideId: users[users.length - 1]
          })
        }
      }}/>}
  </>
};

const mapStateToProps = (state) => ({
  lobbyInstance: state.lobbyInstance,
});

export default compose(
  connect(mapStateToProps, { editLobby }),
)(LobbySelectRoles);
