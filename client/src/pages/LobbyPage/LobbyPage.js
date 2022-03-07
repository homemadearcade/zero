/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';

import { getLobbyById, joinLobby, leaveLobby, assignLobbyRole, subscribeLobbyCobrowsing, startLobbyCobrowsing } from '../../store/actions/lobbyActions';
import Loader from '../../components/Loader/Loader';
import AgoraVideoCall from '../../components/AgoraVideoCall/AgoraVideoCall';
import requireAuth from '../../hoc/requireAuth';

import './LobbyPage.scss';
import Lobby from '../../components/Lobby/Lobby';
import Onboarding from '../../components/cobrowsing/Onboarding/Onboarding';
import VideoLayoutHA from '../../components/VideoLayoutHA/VideoLayoutHA';
import { startAgoraVideoCall } from '../../store/actions/videoActions';

const LobbyPage = ({
  getLobbyById,
  leaveLobby,
  joinLobby,
  assignLobbyRole,
  startLobbyCobrowsing,
  subscribeLobbyCobrowsing,
  startAgoraVideoCall,
  lobby: { lobby, isLoading, isJoining, error, joinError, cobrowsingError, cobrowsingUser },
  auth: { me },
  match,
}) => {
  const matchId = match.params.id;

  useEffect(() => {
    function leaveLobbyCleanup() {
      leaveLobby({lobbyId: matchId, userId: me?.id})
      window.removeEventListener('beforeunload', askBeforeClosing)
    }

    function askBeforeClosing(e) {
      e.preventDefault();
      if(window.location.host.indexOf('localhost') === -1) e.returnValue = '';
      leaveLobbyCleanup()
    }

    async function getLobbyAndJoinLobby() {      
      await joinLobby({lobbyId: matchId, userId: me?.id});
      await getLobbyById(matchId);

      if(me.role !== 'ADMIN') {
        startLobbyCobrowsing({lobbyId: matchId})

        await assignLobbyRole(matchId, {
          userId: me.id, 
          role: 'gameHost'
        });
        await assignLobbyRole(matchId, {
          userId: me.id, 
          role: 'participant'
        });
      }

      window.addEventListener('beforeunload', askBeforeClosing);
    }

    getLobbyAndJoinLobby()

    return () => {
      leaveLobbyCleanup()
    }
  }, []);

  // useEffect(() => {
  //   if(lobby.id) {
  //     if(me.role === 'ADMIN' && (!lobby.guideId)) {
  //       assignLobbyRole(matchId, {
  //         userId: me.id, 
  //         role: 'guide'
  //       });
  //     }
  //   }
  // }, [lobby?.id])

  function renderPageContents() {
    if(isLoading) {
      return <Loader/>
    }
  
    if(isJoining) {
      return <Loader text="Joining lobby..."/>
    }
  
    if(error) {
      return <h1>{error}</h1>
    }
  
    if(joinError) {
      return <h1>{joinError}</h1>
    }
  
    if(cobrowsingError) {
      return <h1>{cobrowsingError}</h1>
    }
  
    if(cobrowsingUser) {
      return <Onboarding/>
    }
  
    if(me?.role !== 'ADMIN') {
      return <Loader text="Waiting for game to start..."/>
    }
  
    return <>
      <Lobby onClickUser={(user) => {
        subscribeLobbyCobrowsing({lobbyId: lobby.id, userId: user.id})
      }}/>
      <button onClick={() => {
        startLobbyCobrowsing({lobbyId: lobby.id})
      }}>Start Onboarding</button>
      <button onClick={() => {
        startAgoraVideoCall({lobbyId: lobby.id})
      }}>Join Video</button>
    </>
  }
 
  return <div className="LobbyPage">
    {renderPageContents()}
  </div>
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  lobby: state.lobby
});

export default compose(
  requireAuth,
  withRouter,
  connect(mapStateToProps, { startAgoraVideoCall, getLobbyById, joinLobby, leaveLobby, assignLobbyRole, startLobbyCobrowsing, subscribeLobbyCobrowsing }),
)(LobbyPage);
