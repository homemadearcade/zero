/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';

import { getLobbyById, joinLobby, leaveLobby, assignLobbyRole} from '../../store/actions/lobbyActions';
import { subscribeCobrowsing, startCobrowsing } from '../../store/actions/cobrowsingActions';
import Loader from '../../components/Loader/Loader';
import requireAuth from '../../hoc/requireAuth';

import './LobbyPage.scss';
import Lobby from '../../components/Lobby/Lobby';
import Onboarding from '../../components/cobrowsing/Onboarding/Onboarding';
import { startAgoraVideoCall } from '../../store/actions/videoActions';

const LobbyPage = ({
  getLobbyById,
  leaveLobby,
  joinLobby,
  assignLobbyRole,
  startCobrowsing,
  subscribeCobrowsing,
  cobrowsing: { cobrowsingError, cobrowsingUser, cobrowsingState },
  lobby: { lobby, isLoading, isJoining, error, joinError },
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
        startCobrowsing({lobbyId: matchId})

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
    if(error) {
      return <h1>{error}</h1>
    }
  
    if(joinError) {
      return <h1>{joinError}</h1>
    }
  
    if(cobrowsingError) {
      return <h1>{cobrowsingError}</h1>
    }

    if(isLoading) {
      return <Loader/>
    }
  
    if(isJoining) {
      return <Loader text="Joining lobby..."/>
    }
  
    if(cobrowsingUser && cobrowsingState) {
      return <Onboarding/>
    }
  
    if(me?.role !== 'ADMIN') {
      return <Loader text="Waiting for game to start..."/>
    }
  
    return <>
      <Lobby onClickUser={(user) => {
        if(user.id === me.id) {
          startCobrowsing({lobbyId: lobby.id})
        } else {
          subscribeCobrowsing({lobbyId: lobby.id, userId: user.id})
        }
      }}/>
      <button onClick={() => {
        startCobrowsing({lobbyId: lobby.id})
      }}>Start Onboarding</button>
    </>
  }
 
  return <div className="LobbyPage">
    {renderPageContents()}
  </div>
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  lobby: state.lobby,
  cobrowsing: state.cobrowsing
});

export default compose(
  requireAuth,
  withRouter,
  connect(mapStateToProps, { startAgoraVideoCall, getLobbyById, joinLobby, leaveLobby, assignLobbyRole, startCobrowsing, subscribeCobrowsing }),
)(LobbyPage);
