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
import { EXPERIENCE_ROLE_AUDIENCE, LOBBY_USER_PRESENT_DELTA } from '../../../constants';

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

  const userMongoIdToRole = lobbyInstance.members.reduce((prev, next) => {
    const roleId = Object.keys(lobbyInstance.roleIdToUserMongoIds).find((roleId) => {
      return lobbyInstance.roleIdToUserMongoIds[roleId].includes(next.userMongoId)
    })
    prev[next.userMongoId] = lobbyInstance.roles[roleId]
    return prev
  }, {})

  const presenceChecklist = lobbyInstance.members.map((member) => {
    if(userMongoIdToRole[member.userMongoId]?.roleCategory === EXPERIENCE_ROLE_AUDIENCE) return null
    return {
      text: `${member.username} is present`,
      test: () => {
        const userStatus = lobbyInstanceUserStatuses[member.userMongoId]
        return userStatus?.lastSeen + LOBBY_USER_PRESENT_DELTA > Date.now() && userStatus?.isFocused
      },
      required: true,
    }
  })

  const internetSpeedTestChecklist = lobbyInstance.members.map((member) => {
    if(userMongoIdToRole[member.userMongoId]?.roleCategory === EXPERIENCE_ROLE_AUDIENCE) return null
    return {
      text: `${member.username} has a tested internet and has a good connection`,
      test: () => {
        if(!membersById[member.userMongoId]?.speedTest) return false
        return isSpeedTestPassing(membersById[member.userMongoId]?.speedTest)
      },
      required: false,
    }
  })

  const isVideoConnectedChecklist = lobbyInstance.members.map((member) => {
    if(userMongoIdToRole[member.userMongoId]?.roleCategory === EXPERIENCE_ROLE_AUDIENCE) return null

    return {
      text: `${member.username} is connected to video`,
      test: () => {
        if(me.id === member.userMongoId) {
          return window.uplinkNetworkQuality
        } else if(client) {
          return client.getRemoteNetworkQuality()[member.userMongoId]?.uplinkNetworkQuality;
        }
      },
      required: false,
    }
  })

  const requireRolesSetChecklist = Object.keys(lobbyInstance.roleIdToUserMongoIds).map((roleId) => {
    if(lobbyInstance.roles[roleId].roleCategory === EXPERIENCE_ROLE_AUDIENCE) return null
    const role = lobbyInstance.roles[roleId]
    return {
      text: `${role.name} users have been set`,
      test: () => {
        return lobbyInstance.roleIdToUserMongoIds[roleId].length
      },
      required: true,
    }
  })

  const checklist = [
    ...presenceChecklist,
    ...internetSpeedTestChecklist,
    ...isVideoConnectedChecklist,
    ...requireRolesSetChecklist,
  ].filter((item) => !!item)

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
