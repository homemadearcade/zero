/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { assignLobbyRole, editLobby } from '../../store/actions/lobbyActions';

import './LobbySetupFlow.scss';
import { addGame, unloadGame } from '../../store/actions/gameActions';
import GameSelect from '../GameSelect/GameSelect';
import GameCard from '../GameCard/GameCard';
import Typography from '../ui/Typography/Typography';
import Button from '../ui/Button/Button';
import LobbyChecklist from '../LobbyChecklist/LobbyChecklist';

const UNASSIGNED_ROLE = 'unassigned'

// {lobby.isGamePoweredOn && <Button
//   type="button"
//   variant="contained"
//   onClick={() => {
//     editLobby(lobby.id, {
//       isGamePoweredOn:false
//     })
//     unloadGame()
//   }}
// >
//   End game
// </Button>}

const LobbySetupFlow = ({
  addGame,
  editLobby,
  assignLobbyRole,
  unloadGame,
  lobby: { lobby },
}) => {
  return (
    <div className="LobbySetupFlow">
      <Typography component="h5" variant="h5">Roles: </Typography>
      <div className="LobbySetupFlow__roles">
        <div className="LobbySetupFlow__role">
          <strong>Game Host</strong><br/>
          <div className="LobbySetupFlow__role-assign">
            Assign:
            <select onChange={(e) => {
              assignLobbyRole(lobby.id, {
                userId: e.target.value, 
                role: 'gameHost'
              });
            }}>
              <option/>
              <option value={UNASSIGNED_ROLE}>unassign</option>
              {lobby.users.map((user) => {
                return <option key={user.id} value={user.id}>{user.username}</option>
              })}
            </select>
          </div>
        </div>
        <div className="LobbySetupFlow__role">
          <strong>Participant</strong><br/>
          {<div className="LobbySetupFlow__role-assign">
            Assign:
            <select onChange={(e) => {
              assignLobbyRole(lobby.id, {
                userId: e.target.value, 
                role: 'participant'
              });
            }}>
              <option/>
              <option value={UNASSIGNED_ROLE}>unassign</option>
              {lobby.users.map((user) => {
                return <option key={user.id} value={user.id}>{user.username}</option>
              })}
            </select>
          </div>}
        </div>
        <div className="LobbySetupFlow__role">
          <strong>Guide</strong><br/>
          <div className="LobbySetupFlow__role-assign">
          Assign:
            <select onChange={(e) => {
              assignLobbyRole(lobby.id, {
                userId: e.target.value, 
                role: 'guide'
              });
            }}>
              <option/>
              <option value={UNASSIGNED_ROLE}>unassign</option>
              {lobby.users.map((user) => {
                return <option key={user.id} value={user.id}>{user.username}</option>
              })}
            </select>
          </div>
        </div>
      </div>

      <Typography component="h5" variant="h5">Select Game: </Typography>
      {lobby?.game?.id && <GameCard game={lobby.game}/>}
      <GameSelect onSelect={(game) => {
        editLobby(lobby.id, {
          game
        })
      }}/>
      <Button disabled={!lobby.participantId} variant="contained" onClick={async () => {
        const response = await addGame({
          userId: lobby.participantId
        })
        editLobby(lobby.id, {
          game: response.data.game
        })
      }} startIcon={<i className="fas fa-plus"/>}>
        New Game
      </Button>

      <LobbyChecklist/>
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
});

export default compose(
  connect(mapStateToProps, { editLobby,addGame, assignLobbyRole, unloadGame }),
)(LobbySetupFlow);
