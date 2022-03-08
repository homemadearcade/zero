import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getLobbys } from '../../store/actions/lobbysActions';
import { deleteLobby, joinLobby } from '../../store/actions/lobbyActions';

import Layout from '../../layout/Layout';
import Loader from '../../components/Loader/Loader';
import LobbyForm from '../../components/LobbyForm/LobbyForm';
import requireAuth from '../../hoc/requireAuth';
import requireAdmin from '../../hoc/requireAdmin';

import './styles.scss';

const Lobbys = ({ history, getLobbys, deleteLobby, joinLobby, lobbys: { lobbys, isLoading } }) => {
  useEffect(() => {
    getLobbys();
  }, [getLobbys]);

  return (
    <Layout>
      <div className="LobbysPage">
        <h1>Lobbies Page</h1>
        <p>
          This is the lobbies page where all active lobbies are listed. Only admin users can see this page.
        </p>
        <div className="LobbysPage__list">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {lobbys.map((lobby, index) => {
                return (
                  <div key={index} className="LobbysPage__lobby">

                    <div className="LobbysPage__info-container">
                      <div>
                        <span className="LobbysPage__label">Lobby ID: </span>
                        <span className="LobbysPage__info">{lobby.id}</span>
                      </div>
                      <div>
                        <span className="LobbysPage__label">Participants Email: </span>
                        <span className="LobbysPage__info">{lobby.participantEmail}</span>
                      </div>
                      <div>
                        <span className="LobbysPage__label">Start Time: </span>
                        <span className="LobbysPage__info">{lobby.startTime}</span>
                      </div>
                      <button
                        className="LobbysPage__button"
                        type="button"
                        onClick={() => {
                          history.push('/lobby/'+lobby.id)
                        }}
                      >
                        Join
                      </button>
                      <button
                        className="LobbysPage__button"
                        type="button"
                        onClick={async () => {
                          await deleteLobby(lobby.id, history)
                          getLobbys()
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })} 
              <LobbyForm onSubmit={() => {
                getLobbys()
              }}/>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  lobbys: state.lobbys,
});

export default compose(
  requireAuth,
  requireAdmin,  
  withRouter,
  connect(mapStateToProps, { getLobbys, deleteLobby, joinLobby }))(Lobbys);
