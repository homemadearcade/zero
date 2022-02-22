/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import { getLobbyById } from '../../store/actions/lobbyActions';
import { loadMe } from '../../store/actions/authActions';
import Loader from '../../components/Loader/Loader';
import requireAuth from '../../hoc/requireAuth';

import './styles.scss';

const Lobby = ({
  getLobbyById,
  lobby: { lobby, isLoading },
  auth: { me },
  history,
  match,
}) => {
  const matchId = match.params.id;

  useEffect(() => {
    getLobbyById(matchId, history);
  }, [matchId]);

  if(isLoading) {
    return <Loader/>
  }

  return (
      <div className="UserPage">
        <h1>{"You are in Lobby: " + lobby.id}</h1>
        <p>
          Hello {me.username}
        </p>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="user-info">
            <div className="info-container">
              {false && 
              <div>
                <span className="label">Joined: </span>
                <span className="info">
                  {moment(0).format('dddd, MMMM Do YYYY, H:mm:ss')}
                </span>
              </div>}
            </div>
          </div>
        )}
      </div>
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
  auth: state.auth,
});

export default compose(
  requireAuth,
  withRouter,
  connect(mapStateToProps, { getLobbyById, loadMe }),
)(Lobby);
