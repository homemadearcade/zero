/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { editLobby } from '../../store/actions/lobbyActions';

import './LobbySelectRoles.scss';
import SelectUsers from '../../ui/connected/SelectUsers/SelectUsers';
import Typography from '../../ui/Typography/Typography';
import LobbyUsername from '../LobbyUsername/LobbyUsername';
import Divider from '../../ui/Divider/Divider';

const LobbySelectRoles = ({
  editLobby,
  lobby: { lobby },
  myTracks, userTracks,
}) => {  
  return <>
      <Typography component="span" variant="subtitle1">Participant:</Typography>
      <LobbyUsername myTracks={myTracks} userTracks={userTracks} userId={lobby.participantId}></LobbyUsername>
      {lobby.participantId && <SelectUsers userIds={lobby.users.map(({id}) => id)} label="Select Participant" onSelect={(users) => {
        if(users[0]) {
          editLobby(lobby.id, {
            participantId: users[users.length - 1]
          })
        }
      }}/>}
    <Divider></Divider>
      <Typography component="span" variant="subtitle1">Guide:</Typography>
      <LobbyUsername myTracks={myTracks} userTracks={userTracks} userId={lobby.guideId}></LobbyUsername>
      {lobby.guideId && <SelectUsers userIds={lobby.users.map(({id}) => id)} label="Select Guide" onSelect={(users) => {
        if(users[0]) {
          editLobby(lobby.id, {
            guideId: users[users.length - 1]
          })
        }
      }}/>}
  </>
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
});

export default compose(
  connect(mapStateToProps, { editLobby }),
)(LobbySelectRoles);
