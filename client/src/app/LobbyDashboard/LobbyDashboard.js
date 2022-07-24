/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { editLobby } from '../../store/actions/lobbyActions';

import './LobbyDashboard.scss';
import Button from '../ui/Button/Button';
import LobbyDetail from '../LobbyDetail/LobbyDetail';
import Link from '../ui/Link/Link';
import LobbySetupFlow from '../LobbySetupFlow/LobbySetupFlow';

const LobbyDashboard = ({
  editLobby,
  unloadGame,
  myTracks, 
  userTracks,
  lobby: { lobby },
}) => {


  console.log(lobby.game)
  
  return (
    <div className="LobbyDashboard">
      <div className="LobbyDashboard__content">
        <LobbySetupFlow/>
        <LobbyDetail userTracks={userTracks} myTracks={myTracks}/>
      </div>

      <div className="LobbyDashboard__leave"><Link to="/lobbys">leave lobby</Link></div>
      {lobby.isGamePoweredOn && <Button
        type="button"
        variant="contained"
        onClick={() => {
          editLobby(lobby.id, {
            isGamePoweredOn:false
          })
          unloadGame()
        }}
      >
        End game
      </Button>}
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  lobby: state.lobby,
  status: state.status
});

export default compose(
  connect(mapStateToProps, { editLobby }),
)(LobbyDashboard);
