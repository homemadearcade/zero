import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { getLobbyByEmail } from '../../store/actions/lobbyActions';
import Loader from '../../components/Loader/Loader';
import requireAuth from '../../hoc/requireAuth';

import './styles.scss';

const LobbyFind = ({ getLobbyByEmail, lobby: { lobby, error }, auth: { me }}) => {
  useEffect(() => {
    getLobbyByEmail(me.email);
  }, []);

  if(error) {
    return <div className="LobbyFind">
      <h1>{error}</h1>
      Please double check the assigned time for your session or contact team@homemadearcade.net
    </div>
  }

  if(lobby?.id) {
    return <Redirect to={"/lobby/" + lobby.id} />;
  }

  return (
      <div className="LobbyFind">
        <Loader text="Finding lobby..."/>
      </div>
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
  auth: state.auth,
});

export default compose(requireAuth, connect(mapStateToProps, { getLobbyByEmail  }))(LobbyFind);
