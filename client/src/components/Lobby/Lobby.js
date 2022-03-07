/* eslint-disable react-hooks/exhaustive-deps */
import React, {} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { assignLobbyRole } from '../../store/actions/lobbyActions';
import UserStatus from '../UserStatus/UserStatus';

import './Lobby.scss';
import classNames from 'classnames';

const UNASSIGNED_ROLE = 'unassigned'

const LobbyPage = ({
  assignLobbyRole,
  onClickUser,
  lobby: { lobby },
  auth: { me },
  status: { lobbyUserStatus }
}) => {
  const usersById = lobby.users.reduce((prev, next) => {
    prev[next.id] = next
    return prev
  }, {})

  const checklist = [
    {
      text: 'Participant role is set',
      test: () => {
        return lobby.participantId
      },
      required: true,
    },
    {
      text: 'Participant is present',
      test: () => {
        return usersById[lobby.participantId]?.joined && usersById[lobby.participantId]?.connected
      },
      required: true,
    },
    {
      text: 'Guide role is set and user is present ',
      test: () => {
        return lobby.guideId && usersById[lobby.guideId]?.joined && usersById[lobby.guideId]?.connected
      },
      required: true,
    },
    {
      text: 'Guide is present ',
      test: () => {
        return usersById[lobby.guideId]?.joined && usersById[lobby.guideId]?.connected
      },
      required: true,
    },
    {
      text: 'Game Host role is set and user is present',
      test: () => {
        return lobby.gameHostId
      },
      required: true,
    },
    {
      text: 'Game Host is present',
      test: () => {
        return usersById[lobby.gameHostId]?.joined && usersById[lobby.gameHostId]?.connected
      },
      required: true,
    },
    {
      text: 'Participant role is set to different user than guide',
      test: () => {
        return lobby.participantId !== lobby.guideId
      },
      required: true,
    },
    {
      text: 'Participant has connected camera',
      test: () => {
        if(me.id === lobby.participantId) {
          return window.uplinkNetworkQuality
        } else if(window.videoClient) {
          return window.videoClient.getRemoteNetworkQuality()[lobby.participantId]?.uplinkNetworkQuality;
        }
      },
      required: false,
    },
    {
      text: 'Guide has connected camera',
      test: () => {
        if(me.id === lobby.guideId) {
          return window.uplinkNetworkQuality
        } else if(window.videoClient) {
          return window.videoClient.getRemoteNetworkQuality()[lobby.guideId]?.uplinkNetworkQuality;
        }
      },
      required: false,
    },
    {
      text: 'Participant is fullscreen',
      test: () => {
        return lobbyUserStatus[lobby.participantId]?.isFullscreen
      },
      required: false,
    },
    {
      text: 'Participant has passed internet speed test',
      test: () => {
        return usersById[lobby.participantId]?.internetSpeedTestResults?.downloadSpeed > 50 && usersById[lobby.participantId]?.internetSpeedTestResults?.uploadSpeed > 1
      },
      required: false,
    },
    {
      text: 'Guide has passed internet speed test',
      test: () => {
        return usersById[lobby.guideId]?.internetSpeedTestResults?.downloadSpeed > 50 && usersById[lobby.guideId]?.internetSpeedTestResults?.uploadSpeed > 1
      },
      required: false,
    },
  ]

  const isAllRequiredPassing = checklist.every((item, i) => {
    if(!item.required) return true
    return !!item.test();
  })

  const isAllPassing = checklist.every((item, i) => {
    return !!item.test();
  })


  if(lobby?.id) {
    return (
      <div className="Lobby">
        <h1>{"You are in Lobby: " + lobby.id}</h1>
        <h3>In Room: </h3>
        {lobby.users.map((user) => {
          return <UserStatus key={user.id} onClick={onClickUser} userId={user.id}/>
        })}
        <h3>Roles: </h3>
        <div className="Lobby__roles">
          <div className="Lobby__role">
            <strong>Game Host</strong><br/>
            {lobby.gameHostId && <UserStatus userId={usersById[lobby.gameHostId]?.id}/>}
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
            <strong>Participant</strong><br/>
            {lobby.participantId && <UserStatus userId={usersById[lobby.participantId]?.id}/>}
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
            <strong>Guide</strong><br/>
            {lobby.guideId && <UserStatus userId={usersById[lobby.guideId]?.id}/>}
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
        <h3>Checklist: </h3>
        <div className="Lobby__checklist">
          {checklist.map((item, i) => {
            const isPassing = !!item.test();
            return <div  key={i} className={classNames("Lobby__checklist-item", { 'Lobby__checklist-item--required': item.required })}>
              {isPassing && <span className="Lobby__checklist-check"><i className="fa-solid fa-check"></i></span>}
              {!isPassing && <span className="Lobby__checklist-check" />}
              {item.text}
              {item.required && ' (required)'}
            </div>
          })}
        </div>
        <button
          type="button"
          onClick={() => {}}
          disabled={!isAllRequiredPassing}
        >
          Start game
          {!isAllPassing && <span style={{marginLeft: '5px'}}><i className="fas fa-warning"></i></span>}
        </button>
      </div>
    );
  } else {
    return <div className="LobbyPage"></div>
  }
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  lobby: state.lobby,
  status: state.status
});

export default compose(
  connect(mapStateToProps, { assignLobbyRole }),
)(LobbyPage);
