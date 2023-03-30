
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Switch as RouterSwitch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom';

import { assignLobbyRole, editLobby, toggleLobbyDashboard} from '../../store/actions/experience/lobbyInstanceActions';
import requireAuth from '../../hoc/requireAuth';
import requireChrome from '../../hoc/requireChrome';

import './LobbyPage.scss';
import withLobby from '../../hoc/withLobby';
import LobbyDashboard from '../../experience/lobbyInstance/LobbyDashboard/LobbyDashboard';
import withSpeedTest from '../../hoc/withSpeedTest';
import CobrowsingSession from '../../hoc/CobrowsingSession';
import LobbyErrorStates from '../../experience/lobbyInstance/LobbyErrorStates/LobbyErrorStates';
import GameRoomDrawer from '../../game/gameRoomInstance/GameRoomDrawer/GameRoomDrawer';
import withAgoraVideoCall from '../../hoc/withAgoraVideoCall';
import AgoraVideoPeek from '../../experience/agora/AgoraVideoPeek/AgoraVideoPeek';
import MultiplayerGameRoomContext from '../../hoc/MultiplayerGameRoomContext';
import { ADMIN_ROLE, WAITING_ACTIVITY } from '../../constants';

const LobbyPage = ({
  lobbyInstance: { lobbyInstance },
  auth: { me },
  gameRoomInstance: { gameRoomInstance },
  myTracks,
  userTracks,
  assignLobbyRole,
  toggleLobbyDashboard
}) => {
  let { path } = useRouteMatch();

  useEffect(() => {
    if(me.role === ADMIN_ROLE) toggleLobbyDashboard(true)

    if(gameRoomInstance.isPoweredOn) return 
    
    if(me.role === ADMIN_ROLE && (!lobbyInstance.guideId)) {
      assignLobbyRole(lobbyInstance.id, {
        userMongoId: me.id, 
        role: 'guide'
      });
    }
  }, [])

  return <RouterSwitch>
      <Route exact path={path}>
        {me.role === ADMIN_ROLE && <GameRoomDrawer myTracks={myTracks} userTracks={userTracks}/>}
        <MultiplayerGameRoomContext gameRoomInstanceMongoId={lobbyInstance.gameRoomInstanceMongoId}>
          <CobrowsingSession userMongoId={lobbyInstance.participantId}>
            <LobbyDashboard userTracks={userTracks} myTracks={myTracks}/>
          </CobrowsingSession>
        </MultiplayerGameRoomContext>
        <LobbyErrorStates/>
        {lobbyInstance.currentActivity !== WAITING_ACTIVITY && <AgoraVideoPeek myTracks={myTracks} userTracks={userTracks}></AgoraVideoPeek>}
      </Route>
    </RouterSwitch>
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  lobbyInstance: state.lobbyInstance,
  gameRoomInstance: state.gameRoomInstance
});

export default compose(
  requireChrome,
  requireAuth,
  withLobby,
  withSpeedTest,
  withAgoraVideoCall,
  connect(mapStateToProps, { assignLobbyRole, editLobby, toggleLobbyDashboard }),
)(LobbyPage);
