/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Button from '@mui/material/Button';

import { assignLobbyRole, editLobby } from '../../store/actions/lobbyActions';
import UserStatus from '../UserStatus/UserStatus';

import './Lobby.scss';
import classNames from 'classnames';
import { useAgoraVideoCallClient } from '../../store/actions/videoActions';
import { addGame, loadGame } from '../../store/actions/gameActions';
import SelectGame from '../SelectGame/SelectGame';
import GameCard from '../GameCard/GameCard';

const UNASSIGNED_ROLE = 'unassigned'

const LobbyPage = ({
  addGame,
  editLobby,
  loadGame,
  assignLobbyRole,
  onClickUser,
  lobby: { lobby },
  auth: { me },
  status: { lobbyUserStatus }
}) => {
  useEffect(() => {
    if(lobby.isGameStarted && lobby.game?.id) {
      loadGame(lobby.game.id)
    }
  }, [lobby.isGameStarted])


  const usersById = lobby.users.reduce((prev, next) => {
    prev[next.id] = next
    return prev
  }, {})

  const client = useAgoraVideoCallClient()

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
      text: 'Guide role is set and Guide is present ',
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
      text: 'Game Host role is set and Game Host is present',
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
        } else if(client) {
          return client.getRemoteNetworkQuality()[lobby.participantId]?.uplinkNetworkQuality;
        }
      },
      required: false,
    },
    {
      text: 'Guide has connected camera',
      test: () => {
        if(me.id === lobby.guideId) {
          return window.uplinkNetworkQuality
        } else if(client) {
          return client.getRemoteNetworkQuality()[lobby.guideId]?.uplinkNetworkQuality;
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
        return usersById[lobby.participantId]?.internetSpeedTestResults?.downloadSpeed >= 10 && usersById[lobby.participantId]?.internetSpeedTestResults?.uploadSpeed >= 1
      },
      required: false,
    },
    {
      text: 'Guide has passed internet speed test',
      test: () => {
        return usersById[lobby.guideId]?.internetSpeedTestResults?.downloadSpeed >= 10 && usersById[lobby.guideId]?.internetSpeedTestResults?.uploadSpeed >= 1
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

        {lobby.isGameStarted && <>
          <h2>Game Started!</h2>
          <GameCard game={lobby.game}/>
        </>}

        <h3>In Room: </h3>
        {lobby.users.map((user) => {
          return <UserStatus key={user.id} onClick={onClickUser} userId={user.id}/>
        })}
        <h3>Roles: </h3>
        <div className="Lobby__roles">
          <div className="Lobby__role">
            <strong>Game Host</strong><br/>
            {lobby.gameHostId && <UserStatus userId={usersById[lobby.gameHostId]?.id}/>}
            {!lobby.isGameStarted && <div className="Lobby__role-assign">
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
            </div>}
          </div>
          <div className="Lobby__role">
            <strong>Participant</strong><br/>
            {lobby.participantId && <UserStatus userId={usersById[lobby.participantId]?.id}/>}
            {!lobby.isGameStarted && <div className="Lobby__role-assign">
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
          <div className="Lobby__role">
            <strong>Guide</strong><br/>
            {lobby.guideId && <UserStatus userId={usersById[lobby.guideId]?.id}/>}
            {!lobby.isGameStarted && <div className="Lobby__role-assign">
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
            </div>}
          </div>
        </div>

        {!lobby.isGameStarted && <>
          <h3>Select Game: </h3>
          {lobby?.game?.id && <GameCard game={lobby.game}/>}
          <SelectGame onSelect={(game) => {
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
        </>}

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
        {!lobby.isGameStarted && <Button
          type="button"
          variant="contained"
          onClick={() => {
            editLobby(lobby.id, {
              isGameStarted: true
            })
          }}
          disabled={!isAllRequiredPassing}
          startIcon={!isAllPassing && <span style={{marginLeft: '5px'}}><i className="fas fa-warning"></i></span>}
        >
          Start game
        </Button>}
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
  connect(mapStateToProps, { editLobby, loadGame, addGame, assignLobbyRole }),
)(LobbyPage);
