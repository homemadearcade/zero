/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';

import { getLobbyById, joinLobby, leaveLobby, assignLobbyRole } from '../../store/actions/lobbyActions';
import UserStatus from '../UserStatus/UserStatus';
import requireAuth from '../../hoc/requireAuth';

import './Lobby.scss';

const UNASSIGNED_ROLE = 'unassigned'

const LobbyPage = ({
  assignLobbyRole,
  lobby: { lobby },
}) => {
  const usersById = lobby.users.reduce((prev, next) => {
    prev[next.id] = next
    return prev
  }, {})

  if(lobby?.id) {
    return (
      <div className="LobbyPage">
        <h1>{"You are in Lobby: " + lobby.id}</h1>
        <h3>In Room: </h3>
        {lobby.users.map((user) => {
          return <UserStatus key={user.id} user={user}/>
        })}
        <h3>Roles: </h3>
        <div className="Lobby__roles">
          <div className="Lobby__role">
            <strong>Game Host</strong>
            {lobby.gameHostId && <UserStatus user={usersById[lobby.gameHostId]}/>}
            <div className="Lobby__role-assign">
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
          <div className="Lobby__role">
            <strong>Participant</strong>
            {lobby.participantId && <UserStatus user={usersById[lobby.participantId]}/>}
            <div className="Lobby__role-assign">
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
            </div>
          </div>
          <div className="Lobby__role">
            <strong>Guide</strong>
            {lobby.guideId && <UserStatus user={usersById[lobby.guideId]}/>}
            <div className="Lobby__role-assign">
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
      </div>
    );
  } else {
    return <div className="LobbyPage"></div>
  }
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  lobby: state.lobby
});

export default compose(
  requireAuth,
  withRouter,
  connect(mapStateToProps, { assignLobbyRole }),
)(LobbyPage);
