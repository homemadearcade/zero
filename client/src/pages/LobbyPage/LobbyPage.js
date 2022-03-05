/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';

import { getLobbyById, joinLobby, leaveLobby, assignLobbyRole, subscribeLobbyCobrowsing, startLobbyCobrowsing } from '../../store/actions/lobbyActions';
import Loader from '../../components/Loader/Loader';
import VideoHA from '../../components/VideoHA/VideoHA';
import requireAuth from '../../hoc/requireAuth';

import './LobbyPage.scss';
import Lobby from '../../components/Lobby/Lobby';
import Onboarding from '../../components/cobrowsing/Onboarding/Onboarding';

const LobbyPage = ({
  getLobbyById,
  leaveLobby,
  joinLobby,
  assignLobbyRole,
  startLobbyCobrowsing,
  subscribeLobbyCobrowsing,
  lobby: { lobby, isLoading, isJoining, error, joinError, cobrowsingError, cobrowsingUser },
  auth: { me },
  match,
}) => {
  const matchId = match.params.id;

  let [showVideo, setShowVideo] = useState(false);

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

  if(isLoading) {
    return <div className="LobbyPage">
      <Loader/>
    </div>
  }

  if(isJoining) {
    return <div className="LobbyPage">
      <Loader text="Joining lobby..."/>
    </div>
  }

  if(error) {
    return <div className="LobbyPage">
      <h1>{error}</h1>
    </div>
  }

  if(joinError) {
    return <div className="LobbyPage">
      <h1>{joinError}</h1>
    </div>
  }

  if(cobrowsingError) {
    return <div className="LobbyPage">
      <h1>{cobrowsingError}</h1>
    </div>
  }

  if(me?.role !== 'ADMIN') {
    return <div className="LobbyPage">
      <Loader text="Waiting for game to start..."/>
    </div>
  }

  if(cobrowsingUser) {
    return <div className="LobbyPage">
      <Onboarding/>
    </div>
  }

  return <div className="LobbyPage">
    <Lobby onClickUser={(user) => {
      subscribeLobbyCobrowsing({lobbyId: lobby.id, userId: user.id})
    }}/>
    <button onClick={() => {
      startLobbyCobrowsing({lobbyId: lobby.id})
    }}>Start Onboarding</button>
    {showVideo && <VideoHA channelId={matchId} user={me} />}
    <button onClick={() => {
      setShowVideo(true)
    }}>Join Video</button>
    {showVideo && <VideoHA channelId={matchId} user={me} />}
  </div>
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  lobby: state.lobby
});

export default compose(
  requireAuth,
  withRouter,
  connect(mapStateToProps, { getLobbyById, joinLobby, leaveLobby, assignLobbyRole, startLobbyCobrowsing, subscribeLobbyCobrowsing }),
)(LobbyPage);
