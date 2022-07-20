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
import Lobby from '../../app/Lobby/Lobby';
import withLobby from '../../hoc/withLobby';
import CobrowsingGame from '../../app/cobrowsing/CobrowsingGame/CobrowsingGame';

const LobbyPage = ({
  lobby: { lobby },
  auth: { me },
  myTracks,
  userTracks
}) => {
  let { path} = useRouteMatch();

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
  
    if(me.role !== 'ADMIN') {
      // startCobrowsing({lobbyId: lobby.id})
    }
  }, [])

  return <Switch>
    <Route exact path={path}>
      <Lobby/>
    </Route>
    <Route path={`${path}/join/:cobrowsingUserId`}>
      <CobrowsingGame myTracks={myTracks} userTracks={userTracks} />
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
