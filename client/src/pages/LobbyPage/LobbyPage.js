
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Switch as RouterSwitch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom';

import { assignLobbyRole, editLobby} from '../../store/actions/lobbyActions';
import requireAuth from '../../hoc/requireAuth';
import requireChrome from '../../hoc/requireChrome';

import './LobbyPage.scss';
import withLobby from '../../hoc/withLobby';
import LobbyDashboard from '../../experience/lobby/LobbyDashboard/LobbyDashboard';
import withSpeedTest from '../../hoc/withSpeedTest';
import CobrowsingSession from '../../hoc/CobrowsingSession';
import AskFullscreen from '../../hoc/askFullscreen';
import LobbyErrorStates from '../../experience/lobby/LobbyErrorStates/LobbyErrorStates';
import GameRoomDrawer from '../../game/gameRoom/GameRoomDrawer/GameRoomDrawer';
import ActivityView from '../../experience/activity/ActivityView/ActivityView';
import withAgoraVideoCall from '../../hoc/withAgoraVideoCall';
import AgoraVideoPeek from '../../experience/agora/AgoraVideoPeek/AgoraVideoPeek';
import MultiplayerGameRoomContext from '../../hoc/MultiplayerGameRoomContext';
import { ADMIN_ROLE, WAITING_ACTIVITY } from '../../constants';

const LobbyPage = ({
  lobby: { lobby },
  auth: { me },
  gameRoom: { gameRoom },
  myTracks,
  userTracks,
  assignLobbyRole,
}) => {
  let { path } = useRouteMatch();

  useEffect(() => {
    if(gameRoom.isPoweredOn) return 
    
    if(me.role === ADMIN_ROLE && (!lobby.guideId)) {
      assignLobbyRole(lobby.id, {
        userId: me.id, 
        role: 'guide'
      });
    }
  }, [])

  return <RouterSwitch>
      <Route exact path={path}>
        <MultiplayerGameRoomContext gameRoomId={lobby.gameRoomId}>
          <CobrowsingSession userId={lobby.participantId}>
            <LobbyDashboard userTracks={userTracks} myTracks={myTracks}/>
          </CobrowsingSession>
        </MultiplayerGameRoomContext>
        <LobbyErrorStates/>
        <AgoraVideoPeek myTracks={myTracks} userTracks={userTracks}></AgoraVideoPeek>
      </Route>
      <Route path={`${path}/join/:cobrowsingUserId`}>
        {me.role === ADMIN_ROLE && <GameRoomDrawer myTracks={myTracks} userTracks={userTracks}/>}
        <MultiplayerGameRoomContext gameRoomId={lobby.gameRoomId}>
          <CobrowsingSession>
            <AskFullscreen>
              <ActivityView myTracks={myTracks} userTracks={userTracks}/>
            </AskFullscreen>
          </CobrowsingSession>
        </MultiplayerGameRoomContext>
        <LobbyErrorStates/>
       {lobby.currentActivity !== WAITING_ACTIVITY && <AgoraVideoPeek myTracks={myTracks} userTracks={userTracks}></AgoraVideoPeek>}
      </Route>
    </RouterSwitch>
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  lobby: state.lobby,
  gameRoom: state.gameRoom
});

export default compose(
  requireChrome,
  requireAuth,
  withLobby,
  withSpeedTest,
  withAgoraVideoCall,
  connect(mapStateToProps, { assignLobbyRole, editLobby }),
)(LobbyPage);
