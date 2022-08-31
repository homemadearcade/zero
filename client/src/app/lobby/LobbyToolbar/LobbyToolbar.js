import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './LobbyToolbar.scss';
import ToolbarIcon from '../../ui/ToolbarIcon/ToolbarIcon';
import { editLobby } from '../../../store/actions/lobbyActions';
import { toggleGridView } from '../../../store/actions/editorActions'
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';

const LobbyToolbar = ({editLobby, lobby : { lobby, lobby : { isGamePaused, isGamePoweredOn }}}) => {
 return <div className="LobbyToolbar">
   <ToolbarIcon 
    size="lg"
    icon={isGamePaused ? "faPlay" : "faPause"} 
    onClick={() => {
      editLobby(lobby.id, {
        isGamePaused: !isGamePaused
      })
    }}
  />
   <ToolbarIcon 
    size="lg"
    icon="faStop"
    onClick={() => {
      editLobby(lobby.id, {
        gameResetDate: Date.now()
      })
    }}
  />
 </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  lobby: state.lobby,
  editor: state.editor
});

export default compose(
  connect(mapStateToProps, { editLobby, toggleGridView }))(LobbyToolbar);
