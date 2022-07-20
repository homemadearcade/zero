/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';

import { joinLobby, leaveLobby, assignLobbyRole} from '../../store/actions/lobbyActions';
import { subscribeCobrowsing, startCobrowsing } from '../../store/actions/cobrowsingActions';
import Loader from '../../app/ui/Loader/Loader';
import requireAuth from '../../hoc/requireAuth';

import './LobbyPage.scss';
import Lobby from '../../app/Lobby/Lobby';
import CobrowsingRoot from '../../app/cobrowsing/CobrowsingRoot/CobrowsingRoot';
import { leaveAgoraVideoCall } from '../../store/actions/videoActions';
import AgoraVideoCall from '../../app/agora/AgoraVideoCall/AgoraVideoCall';
import Typography from '../../app/ui/Typography/Typography';

const LobbyPage = ({
  leaveLobby,
  joinLobby,
  assignLobbyRole,
  startCobrowsing,
  subscribeCobrowsing,
  leaveAgoraVideoCall,
  cobrowsing: { cobrowsingUser },
  lobby: { lobby, isLoading, isJoining },
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

    async function doJoinLobby() {   
      try {
        await joinLobby({lobbyId: matchId, userId: me?.id});
  
        window.addEventListener('beforeunload', askBeforeClosing);
      } catch(error) {
        console.log(error)
      }

    }

    doJoinLobby()

    return () => {
      leaveLobbyCleanup()
    }
  }, []);

  useEffect(() => {
    if(lobby.id) {
      if(me.role === 'ADMIN' && (!lobby.guideId)) {
        assignLobbyRole(matchId, {
          userId: me.id, 
          role: 'guide'
        });
      }
      
      if(me.role !== 'ADMIN' && (!lobby.gameHostId || lobby.participantId)) {
        assignLobbyRole(matchId, {
          userId: me.id, 
          role: 'gameHost'
        });
        assignLobbyRole(matchId, {
          userId: me.id, 
          role: 'participant'
        });
      }
    }
  }, [lobby?.id])

  function renderPageContents() {
    if(isLoading) {
      return <Loader text="Loading Lobby..."/>
    }
  
    if(isJoining) {
      return <Loader text="Joining Lobby..."/>
    }

    if(lobby?.id) {
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
  }

  function renderLobbyBody(props) {
    if(cobrowsingUser) {
      return <CobrowsingRoot {...props} />
    }
  
    return <Lobby onClickUser={(user) => {
      if(user.id === me.id) {
        startCobrowsing({lobbyId: lobby.id})
      } else {
        subscribeCobrowsing({lobbyId: lobby.id, userId: user.id})
      }
    }}/>
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
