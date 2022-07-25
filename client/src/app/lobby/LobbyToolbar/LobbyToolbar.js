import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './LobbyToolbar.scss';
import ToolbarIcon from '../../ui/ToolbarIcon/ToolbarIcon';
import { editLobby } from '../../../store/actions/lobbyActions';

const LobbyToolbar = ({editLobby, lobby : { lobby, lobby : { isGamePaused, isGamePoweredOn }}}) => {
 return <div className="LobbyToolbar">
  <ToolbarIcon 
    size="lg"
    icon="faPowerOff" 
    color={isGamePoweredOn ? "green" : 'white'}
    onClick={() => {
      editLobby(lobby.id, {
        isGamePoweredOn: !isGamePoweredOn,
        isGamePaused: false
      })
    }}
  />
  {isGamePoweredOn && <ToolbarIcon 
    size="lg"
    icon={isGamePaused ? "faPlay" : "faPause"} 
    onClick={() => {
      editLobby(lobby.id, {
        isGamePaused: !isGamePaused
      })
    }}
  />}
  {isGamePoweredOn && <ToolbarIcon 
    size="lg"
    icon="faRotateRight"
    onClick={() => {
      editLobby(lobby.id, {
        gameResetDate: Date.now()
      })
    }}
  />}

 </div>
};

const mapStateToProps = (state) => ({
  lobby: state.lobby
});

export default compose(
  connect(mapStateToProps, { editLobby }))(LobbyToolbar);
