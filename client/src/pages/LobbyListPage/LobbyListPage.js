import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getLobbys } from '../../store/actions/lobbysActions';
import { deleteLobby } from '../../store/actions/lobbyActions';

import Layout from '../../layout/Layout';
import Loader from '../../ui/Loader/Loader';
import LobbyAddForm from '../../app/lobby/LobbyAddForm/LobbyAddForm';
import requireAuth from '../../hoc/requireAuth';
import requireAdmin from '../../hoc/requireAdmin';

import './styles.scss';
import Button from '../../ui/Button/Button';
import Typography from '../../ui/Typography/Typography';
import Link from '../../ui/Link/Link';
import PageHeader from '../../ui/PageHeader/PageHeader';

const LobbyListPage = ({ history, getLobbys, deleteLobby, lobbys: { lobbys, isLoading } }) => {
  useEffect(() => {
    getLobbys();
  }, [getLobbys]);

  return (
    <Layout>
      <div className="LobbyListPage">
        <PageHeader 
          title="Lobbies Page"
          description={`This is the lobbies page where all active lobbies are listed. Only admin users can see this page.`}
        ></PageHeader>
        <div className="LobbyListPage__list">
          {isLoading ? (
            <Loader text="Lobbys Loading..."/>
          ) : (
            <>
              {lobbys.map((lobby, index) => {
                return (
                  <div key={index} className="LobbyListPage__lobby">

                    <div className="LobbyListPage__info-container">
                      <Typography component="h5" variant="h5">{lobby.invitedUsers[0]?.username}'s Lobby</Typography>
                      <div>
                        <span className="LobbyListPage__label">Lobby ID: </span>
                        <span className="LobbyListPage__info">{lobby.id}</span>
                      </div>
                      <div>
                        <span className="LobbyListPage__label">Participants Email: </span>
                        <span className="LobbyListPage__info">{lobby.invitedUsers[0]?.email}</span>
                      </div>
                      <div>
                        <span className="LobbyListPage__label">Participants Username: </span>
                        <span className="LobbyListPage__info">{lobby.invitedUsers[0]?.username}</span>
                      </div>
                      <div>
                        <span className="LobbyListPage__label">Start Time: </span>
                        <span className="LobbyListPage__info">{lobby.startTime}</span>
                      </div>
                      {/* <Button
                        className="LobbyListPage__button"
                        type="button"
                        onClick={() => {
                          history.push('/lobby/'+lobby.id)
                        }}
                      >
                        Enter
                      </Button> */}
                      <Link to={'/lobby/'+lobby.id}>Enter</Link>
                      <Button
                        className="LobbyListPage__button"
                        type="button"
                        onClick={async () => {
                          await deleteLobby(lobby.id, history)
                          getLobbys()
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })} 
              <LobbyAddForm onSubmit={() => {
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
  connect(mapStateToProps, { getLobbys, deleteLobby }))(LobbyListPage);
