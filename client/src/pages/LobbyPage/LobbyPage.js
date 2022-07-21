/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom';

import { assignLobbyRole} from '../../store/actions/lobbyActions';
import { loadGame, unloadGame } from '../../store/actions/gameActions';
import requireAuth from '../../hoc/requireAuth';

import './LobbyPage.scss';
import withLobby from '../../hoc/withLobby';
import CobrowsingGame from '../../app/cobrowsing/CobrowsingGame/CobrowsingGame';
import LobbyDashboard from '../../app/LobbyDashboard/LobbyDashboard';

const LobbyPage = ({
  lobby: { lobby },
  auth: { me },
  myTracks,
  userTracks,
  loadGame,
  unloadGame,
  assignLobbyRole
}) => {
  let { path } = useRouteMatch();

  useEffect(() => {
    if(lobby.isGameStarted && lobby.game?.id) {
      loadGame(lobby.game.id)
    }

    return () => {
      if(lobby.isGameStarted && lobby.game?.id) {
        unloadGame()
      }
    }
  }, [lobby.isGameStarted])

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
      {lobby.game.id && <CobrowsingGame gameId={lobby.game.id} myTracks={myTracks} userTracks={userTracks} />}
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
  connect(mapStateToProps, {  assignLobbyRole, loadGame, unloadGame }),
)(LobbyPage);
