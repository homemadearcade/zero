/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';

import { joinLobby, leaveLobby, assignLobbyRole} from '../../store/actions/lobbyActions';
import { subscribeCobrowsing, startCobrowsing } from '../../store/actions/cobrowsingActions';
import Loader from '../../components/Loader/Loader';
import requireAuth from '../../hoc/requireAuth';

import './LobbyPage.scss';
import Lobby from '../../components/Lobby/Lobby';
import CobrowsingRoot from '../../components/cobrowsing/CobrowsingRoot/CobrowsingRoot';
import { leaveAgoraVideoCall } from '../../store/actions/videoActions';
import AgoraVideoCall from '../../components/AgoraVideoCall/AgoraVideoCall';

const LobbyPage = ({
  leaveLobby,
  joinLobby,
  assignLobbyRole,
  startCobrowsing,
  subscribeCobrowsing,
  leaveAgoraVideoCall,
  cobrowsing: { cobrowsingError, cobrowsingUser },
  lobby: { lobby, isLoading, isJoining, error, joinError },
  auth: { me },
  match,
}) => {
  const matchId = match.params.id;

  useEffect(() => {
    function leaveLobbyCleanup() {
      leaveAgoraVideoCall()
      leaveLobby({lobbyId: matchId, userId: me?.id})
      window.removeEventListener('beforeunload', askBeforeClosing)
    }

    function askBeforeClosing(e) {
      e.preventDefault();
      if(window.location.host.indexOf('localhost') === -1) e.returnValue = '';
      leaveLobbyCleanup()
    }

    async function joinLobbyAndAssignRoles() {      
      await joinLobby({lobbyId: matchId, userId: me?.id});

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

    joinLobbyAndAssignRoles()

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
    if(!window.chrome) {
      return <h1>Please use a Chromium browser such as Chrome or Brave to participate in the Homemade Arcade experience</h1>
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

    if(isLoading) {
      return <Loader text="Loading Lobby..."/>
    }
  
    if(isJoining) {
      return <Loader text="Joining Lobby..."/>
    }

    return <AgoraVideoCall 
      render={(props) => <div className="LobbyPage">
        {renderLobbyBody(props)}
      </div>}
      onClickJoin={() => {
        if(me.role !== 'ADMIN') {
          startCobrowsing({lobbyId: lobby.id})
        }
      }}
    >
    </AgoraVideoCall>
  }

  function renderLobbyBody(props) {
    if(cobrowsingUser) {
      return <CobrowsingRoot {...props} />
    }
  
    return <>
      <Lobby onClickUser={(user) => {
        if(user.id === me.id) {
          startCobrowsing({lobbyId: lobby.id})
        } else {
          subscribeCobrowsing({lobbyId: lobby.id, userId: user.id})
        }
      }}/>
    </>
  }

  return <div className="LobbyPage">
    {renderPageContents()}
  </div>
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  lobby: state.lobby,
  cobrowsing: state.cobrowsing,
  video: state.video
});

export default compose(
  requireAuth,
  withRouter,
  connect(mapStateToProps, { leaveAgoraVideoCall, joinLobby, leaveLobby, assignLobbyRole, startCobrowsing, subscribeCobrowsing }),
)(LobbyPage);
