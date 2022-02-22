import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { joinMatchingLobby } from '../../store/actions/lobbysActions';
import Layout from '../../layout/Layout';
import Loader from '../../components/Loader/Loader';
import requireAuth from '../../hoc/requireAuth';
import requireAdmin from '../../hoc/requireAdmin';

import './styles.scss';

const LobbyFind = ({ joinMatchingLobby }, auth) => {
  useEffect(() => {
    joinMatchingLobby();
  }, []);

  if(auth.lobbyId) {
    return <Redirect to={"/lobby/" + auth.lobbyId} />;
  }

  return (
    <Layout>
      <div className="LobbyFind">

      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  lobbys: state.lobbys,
});

export default compose(requireAuth, requireAdmin, connect(mapStateToProps, { joinMatchingLobby  }))(LobbyFind);
