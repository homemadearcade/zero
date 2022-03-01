/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import { getLobbyById, joinLobby, leaveLobby } from '../../store/actions/lobbyActions';
import { loadMe } from '../../store/actions/authActions';
import Loader from '../../components/Loader/Loader';
import Video from '../../components/Video/Video';
import requireAuth from '../../hoc/requireAuth';

import './styles.scss';

const Lobby = ({
  getLobbyById,
  leaveLobby,
  joinLobby,
  lobby: { lobby, isLoading, isJoining, error, joinError },
  auth: { me },
  match,
}) => {
  const matchId = match.params.id;

  let [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    function askBeforeClosing(e) {
      e.preventDefault();
      e.returnValue = '';
      leaveLobby(matchId)
    }

    async function getLobbyAndJoinLobby() {
      await joinLobby(matchId);
      await getLobbyById(matchId);
      // window.addEventListener('beforeunload', askBeforeClosing);
    }

    getLobbyAndJoinLobby()

    return () => {
      // window.removeEventListener('beforeunload', askBeforeClosing)
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

  if(lobby?.id) {
    return (
      <div className="Lobby">
        <h1>{"You are in Lobby: " + lobby.id}</h1>
        <p>
          Hello {me.username}
        </p>
        <button onClick={() => {
          setShowVideo(true)
        }}>Join Video</button>
        {showVideo && <Video channelId={lobby.id}/>}
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
  connect(mapStateToProps, { getLobbyById, joinLobby, leaveLobby, loadMe }),
)(Lobby);
