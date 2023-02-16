
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
import LobbyDashboard from '../../lobby/LobbyDashboard/LobbyDashboard';
import { ADMIN_ROLE } from '../../game/constants';
import withSpeedTest from '../../hoc/withSpeedTest';
import WithCobrowsing from '../../hoc/withCobrowsing';
import AskFullscreen from '../../hoc/askFullscreen';
import LobbyErrorStates from '../../lobby/LobbyErrorStates/LobbyErrorStates';
import GameSessionDrawer from '../../lobby/GameSessionDrawer/GameSessionDrawer';
import ExperienceView from '../../lobby/ExperienceView/ExperienceView';
import withAgoraVideoCall from '../../hoc/withAgoraVideoCall';
import AgoraVideoPeek from '../../lobby/agora/AgoraVideoPeek/AgoraVideoPeek';
import MultiplayerGameSessionContext from '../../hoc/MultiplayerGameSessionContext';

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
          <WithCobrowsing userId={lobby.participantId}>
            <LobbyDashboard userTracks={userTracks} myTracks={myTracks}/>
          </WithCobrowsing>
        </MultiplayerGameSessionContext>
        <LobbyErrorStates/>
        <AgoraVideoPeek myTracks={myTracks} userTracks={userTracks}></AgoraVideoPeek>
      </Route>
      <Route path={`${path}/join/:cobrowsingUserId`}>
        {me.role === ADMIN_ROLE && <GameSessionDrawer myTracks={myTracks} userTracks={userTracks}/>}
        <MultiplayerGameSessionContext gameSessionId={lobby.gameSessionId}>
          <WithCobrowsing>
            <AskFullscreen>
              <ExperienceView myTracks={myTracks} userTracks={userTracks}/>
            </AskFullscreen>
          </WithCobrowsing>
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
