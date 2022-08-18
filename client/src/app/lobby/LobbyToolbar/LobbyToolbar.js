import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './LobbyToolbar.scss';
import ToolbarIcon from '../../ui/ToolbarIcon/ToolbarIcon';
import { editLobby } from '../../../store/actions/lobbyActions';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { ADMIN_ROLE } from '../../../constants';

const LobbyToolbar = ({editLobby, auth: { me }, lobby : { lobby, lobby : { isEditModeOn, isGamePaused, isGamePoweredOn }}}) => {
 return <div className="LobbyToolbar">
  {me.role === ADMIN_ROLE && <ToolbarIcon 
    size="lg"
    icon="faPowerOff" 
    color={isGamePoweredOn ? "green" : 'white'}
    onClick={() => {
      editLobby(lobby.id, {
        isGamePoweredOn: !isGamePoweredOn,
        isGamePaused: false
      })
    }}
  />}
  {isGamePoweredOn && <Unlockable isTiny interfaceId="toolbar/toggleEditMode">
    <ToolbarIcon 
      size="lg"
      icon="faTableCells"
      color={isEditModeOn ? "green" : 'white'}
      onClick={() => {
        editLobby(lobby.id, {
          isEditModeOn: !isEditModeOn
        })
      }}
    />
  </Unlockable>}
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
  lobby: state.lobby,
  auth: state.auth
});

export default compose(
  connect(mapStateToProps, { editLobby }))(LobbyToolbar);
