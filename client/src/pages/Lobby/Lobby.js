/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import { getLobbyById, joinLobby, leaveLobby } from '../../store/actions/lobbyActions';
import { loadMe } from '../../store/actions/authActions';
import Loader from '../../components/Loader/Loader';
import requireAuth from '../../hoc/requireAuth';

import './styles.scss';

const Lobby = ({
  getLobbyById,
  leaveLobby,
  joinLobby,
  lobby: { lobby, isLoading, isJoining, error },
  auth: { me },
  match,
}) => {
  const matchId = match.params.id;

  useEffect(() => {
    function askBeforeClosing(e) {
      e.preventDefault();
      e.returnValue = '';
      leaveLobby(matchId)
    }

    async function getLobbyAndJoinLobby() {
      await getLobbyById(matchId);
      await joinLobby(matchId);
      // window.addEventListener('beforeunload', askBeforeClosing);
    }

    getLobbyAndJoinLobby()

    return () => {
      // window.removeEventListener('beforeunload', askBeforeClosing)
      leaveLobby(matchId)
    }
  }, []);

  if(isLoading) {
    return <Loader/>
  }

  if(isJoining) {
    return <Loader text="Joining lobby..."/>
  }

  if(lobby) {
    return (
      <div className="LobbyPage">
        <h1>{"You are in Lobby: " + lobby.id}</h1>
        <p>
          Hello {me.username}
        </p>
      </div>
    );
  }
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
  auth: state.auth,
});

export default compose(
  requireAuth,
  withRouter,
  connect(mapStateToProps, { getLobbyById, joinLobby, leaveLobby, loadMe }),
)(Lobby);
