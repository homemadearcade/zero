
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
import GameSessionDrawer from '../../game/gameSession/GameSessionDrawer/GameSessionDrawer';
import ExperienceView from '../../experience/ExperienceView/ExperienceView';
import withAgoraVideoCall from '../../hoc/withAgoraVideoCall';
import AgoraVideoPeek from '../../experience/agora/AgoraVideoPeek/AgoraVideoPeek';
import MultiplayerGameSessionContext from '../../hoc/MultiplayerGameSessionContext';
import { ADMIN_ROLE } from '../../constants';

const LobbyPage = ({
  lobby: { lobby },
  auth: { me },
  gameSession: { gameSession },
  myTracks,
  userTracks,
  assignLobbyRole,
}) => {
  let { path } = useRouteMatch();

  useEffect(() => {
    if(gameSession.isPoweredOn) return 
    
    if(me.role === ADMIN_ROLE && (!lobby.guideId)) {
      assignLobbyRole(lobby.id, {
        userId: me.id, 
        role: 'guide'
      });
    }
  }, [])

  return <RouterSwitch>
      <Route exact path={path}>
        <MultiplayerGameSessionContext gameSessionId={lobby.gameSessionId}>
          <CobrowsingSession userId={lobby.participantId}>
            <LobbyDashboard userTracks={userTracks} myTracks={myTracks}/>
          </CobrowsingSession>
        </MultiplayerGameSessionContext>
        <LobbyErrorStates/>
        <AgoraVideoPeek myTracks={myTracks} userTracks={userTracks}></AgoraVideoPeek>
      </Route>
      <Route path={`${path}/join/:cobrowsingUserId`}>
        {me.role === ADMIN_ROLE && <GameSessionDrawer myTracks={myTracks} userTracks={userTracks}/>}
        <MultiplayerGameSessionContext gameSessionId={lobby.gameSessionId}>
          <CobrowsingSession>
            <AskFullscreen>
              <ExperienceView myTracks={myTracks} userTracks={userTracks}/>
            </AskFullscreen>
          </CobrowsingSession>
        </MultiplayerGameSessionContext>
        <LobbyErrorStates/>
        <AgoraVideoPeek myTracks={myTracks} userTracks={userTracks}></AgoraVideoPeek>
      </Route>
    </RouterSwitch>
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  lobby: state.lobby,
  gameSession: state.gameSession
});

export default compose(
  requireChrome,
  requireAuth,
  withLobby,
  withSpeedTest,
  withAgoraVideoCall,
  connect(mapStateToProps, { assignLobbyRole, editLobby }),
)(LobbyPage);
