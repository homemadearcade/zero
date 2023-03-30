/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { editLobby } from '../../../store/actions/experience/lobbyInstanceActions';

import './LobbyChecklist.scss';
import classNames from 'classnames';
import { useAgoraVideoCallClient } from '../../../store/actions/experience/videoActions';
import Icon from '../../../ui/Icon/Icon';
import { isSpeedTestPassing } from '../../../utils/networkUtils';
import { LOBBY_USER_PRESENT_DELTA } from '../../../constants';

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
  lobbyInstance: { lobbyInstance },
  auth: { me },
  status: { lobbyInstanceUserStatuses },
  cobrowsing: { remoteStateUserMongoId }
}) => {
  const membersById = lobbyInstance.members.reduce((prev, next) => {
    prev[next.userMongoId] = next
    return prev
  }, {})

  const client = useAgoraVideoCallClient()

  const checklist = [
    {
      text: 'Participant role is set',
      test: () => {
        return lobbyInstance.participantId
      },
      required: true,
    },
    {
      text: 'Participant is present',
      test: () => {
        return lobbyInstanceUserStatuses[lobbyInstance.participantId]?.lastSeen + LOBBY_USER_PRESENT_DELTA > Date.now() && lobbyInstanceUserStatuses[lobbyInstance.participantId]?.isFocused
      },
      required: true,
    },
    {
      text: 'Guide role is set',
      test: () => {
        return lobbyInstance.guideId
      },
      required: true,
    },
    {
      text: 'Guide is present',
      test: () => {
        return lobbyInstanceUserStatuses[lobbyInstance.guideId]?.lastSeen + LOBBY_USER_PRESENT_DELTA > Date.now() && lobbyInstanceUserStatuses[lobbyInstance.guideId]?.isFocused
      },
      required: true,
    },
    {
      text: 'Participant role is set to different user than guide',
      test: () => {
        return lobbyInstance.participantId !== lobbyInstance.guideId
      },
      required: true,
    },
    {
      text: 'Game has been selected',
      test: () => {
        return !!lobbyInstance.editingGameId
      },
      required: true
    },
    {
      text: 'Participant has interacted with experience',
      test: () => {
        return !!remoteStateUserMongoId
      },
      required: true,
    },
    {
      text: 'Participant has connected camera',
      test: () => {
        if(me.id === lobbyInstance.participantId) {
          return window.uplinkNetworkQuality
        } else if(client) {
          return client.getRemoteNetworkQuality()[lobbyInstance.participantId]?.uplinkNetworkQuality;
        }
      },
      required: false,
    },
    {
      text: 'Guide has connected camera',
      test: () => {
        if(me.id === lobbyInstance.guideId) {
          return window.uplinkNetworkQuality
        } else if(client) {
          return client.getRemoteNetworkQuality()[lobbyInstance.guideId]?.uplinkNetworkQuality;
        }
      },
      required: false,
    },
    {
      text: 'Participant is fullscreen',
      test: () => {
        return lobbyInstanceUserStatuses[lobbyInstance.participantId]?.isFullscreen
      },
      required: false,
    },
    {
      text: 'Participant has passed internet speed test',
      test: () => {
        const speedTest = membersById[lobbyInstance.participantId]?.internetSpeedTestResults
        return speedTest && isSpeedTestPassing(membersById[lobbyInstance.participantId]?.internetSpeedTestResults)
      },
      required: false,
    },
    {
      text: 'Guide has passed internet speed test',
      test: () => {
        const speedTest = membersById[lobbyInstance.guideId]?.internetSpeedTestResults
        return speedTest && isSpeedTestPassing(membersById[lobbyInstance.guideId]?.internetSpeedTestResults)
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
  //   if(me.id === lobbyInstance.guideId) {
  //     window.lobbyInstance = {
  //       isAllPassing, isAllRequiredPassing
  //     }
  //   }
  // }, [client, lobbyInstance, lobbyInstanceUserStatuses])

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
  lobbyInstance: state.lobbyInstance,
  status: state.status,
  cobrowsing: state.cobrowsing
});

export default compose(
  connect(mapStateToProps, { editLobby }),
)(LobbyChecklist);
