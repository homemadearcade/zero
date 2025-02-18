
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { editLobby } from '../../store/actions/experience/lobbyInstanceActions';
import requireAuth from '../../hoc/requireAuth';
import requireChrome from '../../hoc/requireChrome';

import './LobbyPage.scss';
import LobbyInstanceContext from '../../hoc/LobbyInstanceContext';
import LobbyDashboard from '../../experience/lobbyInstance/LobbyDashboard/LobbyDashboard';
import withSpeedTest from '../../hoc/withSpeedTest';
import CobrowsingSession from '../../hoc/CobrowsingSession';
import LobbyErrorStates from '../../experience/lobbyInstance/LobbyErrorStates/LobbyErrorStates';
import GameRoomDrawer from '../../game/gameRoomInstance/GameRoomDrawer/GameRoomDrawer';
import withAgoraVideoCall from '../../hoc/withAgoraVideoCall';
import AgoraVideoPeek from '../../experience/agora/AgoraVideoPeek/AgoraVideoPeek';
import { APP_ADMIN_ROLE, EXPERIENCE_ROLE_FACILITATOR, WAITING_ROOM } from '../../constants';
import { ANIMATION_CONFETTI } from '../../game/constants';
import JSConfetti from 'js-confetti';
import { ON_LOBBY_INSTANCE_EVENT } from '../../store/types';
import redirectAfterLogin from '../../hoc/redirectAfterLogin';

const LobbyPage = ({
  lobbyInstance: { lobbyInstance, myRoleId },
  auth: { me },
  myTracks,
  userTracks,
}) => {
  // let { path } = useRouteMatch();

  useEffect(() => {
    window.socket.on(ON_LOBBY_INSTANCE_EVENT, async ({lobbyInstanceEventType, data}) => {
      switch(lobbyInstanceEventType) {
        case ANIMATION_CONFETTI:
          const jsConfetti = new JSConfetti()
          jsConfetti.addConfetti();
          return
        default: 
          return
      }
    })

    return () => {
      window.socket.off(ON_LOBBY_INSTANCE_EVENT)
    }
  }, [])

  const currentActivityCategory = lobbyInstance.activitys[lobbyInstance.currentActivityId].activityCategory

  function renderBody() {
    return <>
      <LobbyDashboard userTracks={userTracks} myTracks={myTracks}/>
      <LobbyErrorStates/>
      {currentActivityCategory !== WAITING_ROOM && <AgoraVideoPeek myTracks={myTracks} userTracks={userTracks}></AgoraVideoPeek>}
    </>
  }

  const role = lobbyInstance.roles[myRoleId]
  if(me.roles[APP_ADMIN_ROLE]) {
  //if(role.roleCategory === EXPERIENCE_ROLE_FACILITATOR) {
    return <CobrowsingSession userMongoId={lobbyInstance.cobrowsingUserMongoId}>
      {me.roles[APP_ADMIN_ROLE] && <GameRoomDrawer myTracks={myTracks} userTracks={userTracks}/>}
      {renderBody()}
    </CobrowsingSession>

  } else {
    return <CobrowsingSession userMongoId={me.id}>
      {renderBody()}
    </CobrowsingSession>
  }

  // return <RouterSwitch>
  //     <Route exact path={path}>

  //     </Route>
  //   </RouterSwitch>
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  lobbyInstance: state.lobbyInstance,
  gameRoomInstance: state.gameRoomInstance,
  cobrowsing: state.cobrowsing,
});

export default compose(
  requireChrome,
  redirectAfterLogin,
  requireAuth,
  LobbyInstanceContext,
  withSpeedTest,
  withAgoraVideoCall,
  connect(mapStateToProps, { editLobby }),
)(LobbyPage);
