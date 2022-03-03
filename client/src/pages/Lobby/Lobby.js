/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

// import moment from 'moment';
import { withRouter } from 'react-router-dom';

import { getLobbyById, joinLobby, leaveLobby, assignLobbyRole } from '../../store/actions/lobbyActions';
import { loadMe } from '../../store/actions/authActions';
import Loader from '../../components/Loader/Loader';
import UserStatus from '../../components/UserStatus/UserStatus';
import VideoHA from '../../components/VideoHA/VideoHA';
import requireAuth from '../../hoc/requireAuth';

import './Lobby.scss';

const Lobby = ({
  getLobbyById,
  leaveLobby,
  joinLobby,
  assignLobbyRole,
  lobby: { lobby, isLoading, isJoining, error, joinError },
  auth: { me },
  match,
  history,
}) => {
  const matchId = match.params.id;

  let [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    function askBeforeClosing(e) {
      e.preventDefault();
      if(window.location.host.indexOf('localhost') === -1) e.returnValue = '';
      leaveLobby(matchId)
    }

    async function getLobbyAndJoinLobby() {
      await joinLobby(matchId);
      await getLobbyById(matchId);

      if(me.role !== 'ADMIN') {
        await assignLobbyRole(matchId, {
          userId: me.id, 
          role: 'host'
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
      window.removeEventListener('beforeunload', askBeforeClosing)
      leaveLobby(matchId)
    }
  }, []);

  if(isLoading) {
    return <div className="Lobby">
      <Loader/>
    </div>
  }

  if(isJoining) {
    return <div className="Lobby">
      <Loader text="Joining lobby..."/>
    </div>
  }

  if(error) {
    return <div className="Lobby">
      <h1>{error}</h1>
    </div>
  }

  if(joinError) {
    return <div className="Lobby">
      <h1>{joinError}</h1>
    </div>
  }

  const usersById = lobby.users.reduce((prev, next) => {
    prev[next.id] = next
    return prev
  }, {})

  if(lobby?.id) {
    return (
      <div className="Lobby">
        <h1>{"You are in Lobby: " + lobby.id}</h1>
        <p>
        <h3>In Room: </h3>
        {lobby.users.map((user) => {
          return <UserStatus user={user}/>
        })}
        </p>
        <h3>Roles: </h3>
        <div className="Lobby__roles">
          <div className="Lobby__role">
            Host: 
            {lobby.hostId && <UserStatus user={usersById[lobby.hostId]}/>}
          </div>
          <div className="Lobby__role">
            Participant: 
            {lobby.participantId && <UserStatus user={usersById[lobby.participantId]}/>}
          </div>
          <div className="Lobby__role">
            Guide: 
            {lobby.guideId && <UserStatus user={usersById[lobby.guideId]}/>}
          </div>
        </div>
        <button onClick={() => {
          setShowVideo(true)
        }}>Join Video</button>
        {showVideo && <VideoHA channelId={lobby.id} user={me} />}
      </div>
    );
  } else {
    return <div className="Lobby"></div>
  }
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
  auth: state.auth,
});

export default compose(
  requireAuth,
  withRouter,
  connect(mapStateToProps, { getLobbyById, joinLobby, leaveLobby, assignLobbyRole, loadMe }),
)(Lobby);
