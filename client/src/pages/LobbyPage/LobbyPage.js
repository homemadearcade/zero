/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { assignLobbyRole} from '../../store/actions/lobbyActions';
import { subscribeCobrowsing, startCobrowsing } from '../../store/actions/cobrowsingActions';
import requireAuth from '../../hoc/requireAuth';

import './LobbyPage.scss';
import Lobby from '../../app/Lobby/Lobby';
import CobrowsingRoot from '../../app/cobrowsing/CobrowsingRoot/CobrowsingRoot';
import withLobby from '../../hoc/withLobby';

const LobbyPage = ({
  startCobrowsing,
  subscribeCobrowsing,
  cobrowsing: { cobrowsingUser },
  lobby: { lobby },
  auth: { me },
  myTracks,
  userTracks
}) => {

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
      startCobrowsing({lobbyId: lobby.id})
    }
  }, [])

  if(cobrowsingUser) {
    return <CobrowsingRoot myTracks={myTracks} userTracks={userTracks} />
  }

  return <Lobby onClickUser={(user) => {
    if(user.id === me.id) {
      startCobrowsing({lobbyId: lobby.id})
    } else {
      subscribeCobrowsing({lobbyId: lobby.id, userId: user.id})
    }
  }}/>
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  lobby: state.lobby,
  cobrowsing: state.cobrowsing,
});

export default compose(
  requireAuth,
  withLobby,
  connect(mapStateToProps, {  assignLobbyRole, startCobrowsing, subscribeCobrowsing }),
)(LobbyPage);
