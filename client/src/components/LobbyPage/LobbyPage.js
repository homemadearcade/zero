/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

// import moment from 'moment';
import { withRouter } from 'react-router-dom';

import { getLobbyById, joinLobby, leaveLobby, assignLobbyRole } from '../../store/actions/lobbyActions';
import Loader from '../Loader/Loader';
import UserStatus from '../UserStatus/UserStatus';
import VideoHA from '../VideoHA/VideoHA';
import requireAuth from '../../hoc/requireAuth';

import './LobbyPage.scss';

const UNASSIGNED_ROLE = 'unassigned'

const LobbyPage = ({
  getLobbyById,
  leaveLobby,
  joinLobby,
  assignLobbyRole,
  lobby: { lobby, isLoading, isJoining, error, joinError },
  auth: { me },
  match,
}) => {
  const matchId = match.params.id;

  let [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    function leaveLobbyCleanup() {
      leaveLobby(matchId, {userId: me?.id})
      window.removeEventListener('beforeunload', askBeforeClosing)
    }

    function askBeforeClosing(e) {
      e.preventDefault();
      if(window.location.host.indexOf('localhost') === -1) e.returnValue = '';
      leaveLobbyCleanup()
    }

    async function getLobbyAndJoinLobby() {
      await joinLobby(matchId, {userId: me?.id});
      await getLobbyById(matchId);

      if(me.role !== 'ADMIN') {
        await assignLobbyRole(matchId, {
          userId: me.id, 
          role: 'gameHost'
        });
        await assignLobbyRole(matchId, {
          userId: me.id, 
          role: 'participant'
        });
      }

      window.addEventListener('beforeunload', askBeforeClosing);
    }

    getLobbyAndJoinLobby()

    return () => {
      leaveLobbyCleanup()
    }
  }, []);

  // useEffect(() => {
  //   if(lobby.id) {
  //     if(me.role === 'ADMIN' && (!lobby.guideId)) {
  //       assignLobbyRole(matchId, {
  //         userId: me.id, 
  //         role: 'guide'
  //       });
  //     }
  //   }
  // }, [lobby?.id])

  if(isLoading) {
    return <div className="LobbyPage">
      <Loader/>
    </div>
  }

  if(isJoining) {
    return <div className="LobbyPage">
      <Loader text="Joining lobby..."/>
    </div>
  }

  if(error) {
    return <div className="LobbyPage">
      <h1>{error}</h1>
    </div>
  }

  if(joinError) {
    return <div className="LobbyPage">
      <h1>{joinError}</h1>
    </div>
  }

  if(me?.role !== 'ADMIN') {
    return <div className="LobbyPage">
    <Loader text="Waiting for game to start..."/>
  </div>
  }

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
                assignLobbyRole(matchId, {
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
                assignLobbyRole(matchId, {
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
                assignLobbyRole(matchId, {
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
        <button onClick={() => {
          setShowVideo(true)
        }}>Join Video</button>
        {showVideo && <VideoHA lobby={lobby} channelId={lobby.id} user={me} />}
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
  connect(mapStateToProps, { getLobbyById, joinLobby, leaveLobby, assignLobbyRole }),
)(LobbyPage);
