/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom';

import { assignLobbyRole} from '../../store/actions/lobbyActions';
import requireAuth from '../../hoc/requireAuth';

import './LobbyPage.scss';
import withLobby from '../../hoc/withLobby';
import CobrowsingGame from '../../app/cobrowsing/CobrowsingGame/CobrowsingGame';
import LobbyDashboard from '../../app/LobbyDashboard/LobbyDashboard';
import Onboarding from '../../app/cobrowsing/Onboarding/Onboarding';
import GameView from '../../game/GameView/GameView';

const LobbyPage = ({
  lobby: { lobby },
  auth: { me },
  myTracks,
  userTracks,
  assignLobbyRole
}) => {
  let { path } = useRouteMatch();

  useEffect(() => {
    if(me.role === 'ADMIN' && (!lobby.guideId)) {
      assignLobbyRole(lobby.id, {
        userId: me.id, 
        role: 'guide'
      });
    }
    
    if(me.role !== 'ADMIN' && (!lobby.gameHostId || lobby.participantId)) {
      assignLobbyRole(lobby.id, {
        userId: me.id, 
        role: 'gameHost'
      });
      assignLobbyRole(lobby.id, {
        userId: me.id, 
        role: 'participant'
      });
    }
  }, [])

  return <Switch>
    <Route exact path={path}>
      <LobbyDashboard/>
    </Route>
    <Route path={`${path}/join/:cobrowsingUserId`}>
      <CobrowsingGame gameId={lobby.game.id} myTracks={myTracks} userTracks={userTracks}>
        {!lobby.isGameStarted && <div className="GameEditor__empty-game"><Onboarding/></div>}
        {lobby.isGameStarted && <GameView
          isHost={lobby.gameHostId === me.id}
          isNetworked
        />}
      </CobrowsingGame>
    </Route>
  </Switch>
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  lobby: state.lobby,
});

export default compose(
  requireAuth,
  withLobby,
  connect(mapStateToProps, {  assignLobbyRole }),
)(LobbyPage);
