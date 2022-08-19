import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './LobbyToolbar.scss';
import ToolbarIcon from '../../ui/ToolbarIcon/ToolbarIcon';
import { editLobby } from '../../../store/actions/lobbyActions';
import { toggleGridView } from '../../../store/actions/editorActions'
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { ADMIN_ROLE } from '../../../constants';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';

const LobbyToolbar = ({editLobby, auth: { me }, lobby : { lobby, lobby : { isGamePaused, isGamePoweredOn }}, editor: { isGridViewOn}, toggleGridView}) => {
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
      color={isGridViewOn ? "green" : 'white'}
      onClick={() => {
        toggleGridView()
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

const mapStateToProps = (state) => mapCobrowsingState(state, {
  lobby: state.lobby,
  auth: state.auth,
  editor: state.editor
});

export default compose(
  connect(mapStateToProps, { editLobby, toggleGridView }))(LobbyToolbar);
