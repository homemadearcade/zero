import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './LobbyToolbar.scss';

import { faPowerOff, faPlay, faPause, faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { editLobby } from '../../../store/actions/lobbyActions';

const LobbyToolbar = ({editLobby, lobby : { lobby, lobby : { game, isGamePaused, isGamePoweredOn }}}) => {
 return <div className="LobbyToolbar">
  <FontAwesomeIcon 
    size="lg"
    icon={faPowerOff} 
    color={isGamePoweredOn ? "green" : 'white'}
    onClick={() => {
      editLobby(lobby.id, {
        isGamePoweredOn: !isGamePoweredOn
      })
    }}
  />
  <FontAwesomeIcon 
    size="lg"
    icon={isGamePaused ? faPlay : faPause} 
    onClick={() => {
      editLobby(lobby.id, {
        isGamePaused: !isGamePaused
      })
    }}
  />

 </div>
};

const mapStateToProps = (state) => ({
  lobby: state.lobby
});

export default compose(
  connect(mapStateToProps, { editLobby }))(LobbyToolbar);
