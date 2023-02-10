/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { editLobby } from '../../store/actions/lobbyActions';

import './LobbyChecklist.scss';
import classNames from 'classnames';
import { useAgoraVideoCallClient } from '../../store/actions/videoActions';
import Icon from '../../ui/Icon/Icon';
import { LOBBY_USER_PRESENT_DELTA } from '../constants';

// {<Button
//   type="button"
//   variant="contained"
//   onClick={() => {
//     editLobby(lobby.id, {
//       isGamePoweredOn: true
//     })
//   }}
//   disabled={!isAllRequiredPassing}
//   startIcon={!isAllPassing && <span style={{marginLeft: '5px'}}><Icon icon="faWarning"/></span>}
// >
//   Start game
// </Button>}

const LobbyChecklist = ({
  editLobby,
  lobby: { lobby },
  auth: { me },
  status: { lobbyUserStatuses }
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
        return lobbyUserStatuses[lobby.participantId]?.lastSeen + LOBBY_USER_PRESENT_DELTA > Date.now() && lobbyUserStatuses[lobby.participantId]?.isFocused
      },
      required: true,
    },
    {
      text: 'Guide role is set',
      test: () => {
        return lobby.guideId
      },
      required: true,
    },
    {
      text: 'Guide is present',
      test: () => {
        return lobbyUserStatuses[lobby.guideId]?.lastSeen + LOBBY_USER_PRESENT_DELTA > Date.now() && lobbyUserStatuses[lobby.guideId]?.isFocused
      },
      required: true,
    },
    {
      text: 'Game Host role is set',
      test: () => {
        return lobby.gameHostId
      },
      required: true,
    },
    {
      text: 'Game Host is present',
      test: () => {
        return lobbyUserStatuses[lobby.gameHostId]?.lastSeen + LOBBY_USER_PRESENT_DELTA > Date.now() && lobbyUserStatuses[lobby.gameHostId]?.isFocused
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
        return lobbyUserStatuses[lobby.participantId]?.isFullscreen
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

  // const isAllRequiredPassing = checklist.every((item, i) => {
  //   if(!item.required) return true
  //   return !!item.test();
  // })

  // const isAllPassing = checklist.every((item, i) => {
  //   return !!item.test();
  // })

  // useEffect(() => {
  //   if(me.id === lobby.guideId) {
  //     window.lobby = {
  //       isAllPassing, isAllRequiredPassing
  //     }
  //   }
  // }, [client, lobby, lobbyUserStatuses])

  return <div className="LobbyChecklist__checklist">
    {checklist.map((item, i) => {
      const isPassing = !!item.test();
      return <div key={i} className={classNames("LobbyChecklist__checklist-item", { 'LobbyChecklist__checklist-item--required': item.required, 'LobbyChecklist__checklist-item--red': item.required && !isPassing })}>
        {isPassing && <span className="LobbyChecklist__checklist-check"><Icon icon="faCheck"/></span>}
        {!isPassing && <span className="LobbyChecklist__checklist-check" />}
        {item.text}
        {item.required && ' (required)'}
      </div>
    })}
  </div>
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  lobby: state.lobby,
  status: state.status
});

export default compose(
  connect(mapStateToProps, { editLobby }),
)(LobbyChecklist);
