/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { assignLobbyRole, editLobby } from '../../store/actions/lobbyActions';
import UserStatus from '../UserStatus/UserStatus';

import './LobbyDashboard.scss';
import classNames from 'classnames';
import { useAgoraVideoCallClient } from '../../store/actions/videoActions';
import { addGame } from '../../store/actions/gameActions';
import GameSelect from '../GameSelect/GameSelect';
import GameCard from '../GameCard/GameCard';
import Typography from '../ui/Typography/Typography';
import Button from '../ui/Button/Button';
import Link from '../ui/Link/Link';

const UNASSIGNED_ROLE = 'unassigned'

const LobbyDashboard = ({
  addGame,
  editLobby,
  assignLobbyRole,
  lobby: { lobby },
  auth: { me },
  status: { lobbyUserStatus }
}) => {
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
      text: 'Game has been selected',
      test: () => {
        return !!lobby.game
      },
      required: true
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

  return (
    <div className="LobbyDashboard">
      <div className="LobbyDashboard__leave"><Link to="/lobbys">leave</Link></div>
      <Typography component="h5" variant="h5">{"You are in Lobby: " + lobby.id}</Typography>

      {lobby.isGameStarted && <>
        <Typography variant="subtitle1" component="div">Game Started!</Typography>
        <GameCard game={lobby.game}/>
      </>}

      <Typography component="h5" variant="h5">Users in room: </Typography>
      <div className="LobbyDashboard__users">
        {lobby.users.map((user) => {
          return <UserStatus key={user.id}  userId={user.id}/>
        })}
      </div>
      <Typography component="h5" variant="h5">Roles: </Typography>
      <div className="LobbyDashboard__roles">
        <div className="LobbyDashboard__role">
          <strong>Game Host</strong><br/>
          {lobby.gameHostId && <UserStatus userId={usersById[lobby.gameHostId]?.id}/>}
          {!lobby.isGameStarted && <div className="LobbyDashboard__role-assign">
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
        <div className="LobbyDashboard__role">
          <strong>Participant</strong><br/>
          {lobby.participantId && <UserStatus userId={usersById[lobby.participantId]?.id}/>}
          {!lobby.isGameStarted && <div className="LobbyDashboard__role-assign">
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
        <div className="LobbyDashboard__role">
          <strong>Guide</strong><br/>
          {lobby.guideId && <UserStatus userId={usersById[lobby.guideId]?.id}/>}
          {!lobby.isGameStarted && <div className="LobbyDashboard__role-assign">
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
      </>}

      <Typography component="h5" variant="h5">Checklist: </Typography>
      <div className="LobbyDashboard__checklist">
        {checklist.map((item, i) => {
          const isPassing = !!item.test();
          return <div key={i} className={classNames("LobbyDashboard__checklist-item", { 'Lobby__checklist-item--required': item.required })}>
            {isPassing && <span className="LobbyDashboard__checklist-check"><i className="fa-solid fa-check"></i></span>}
            {!isPassing && <span className="LobbyDashboard__checklist-check" />}
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
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  lobby: state.lobby,
  status: state.status
});

export default compose(
  connect(mapStateToProps, { editLobby,addGame, assignLobbyRole }),
)(LobbyDashboard);
