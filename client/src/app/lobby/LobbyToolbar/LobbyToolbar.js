import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './LobbyToolbar.scss';
import ToolbarIcon from '../../ui/ToolbarIcon/ToolbarIcon';
import { editLobby, lobbyUndo } from '../../../store/actions/lobbyActions';
import { toggleGridView } from '../../../store/actions/editorActions'
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import LoadingIcon from '../../ui/LoadingIcon/LoadingIcon';

const LobbyToolbar = ({lobbyUndo, editLobby, lobby : { lobby, isUndoing, lobby : { isGamePaused }}}) => {
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
  {isUndoing ? 
    <LoadingIcon
      size="lg"
    />
  :
    <ToolbarIcon
      size="lg"
      icon="faRotateLeft"
      onClick={() => {
        lobbyUndo(lobby.id)
      }}
    />}
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
  editor: state.editor,
});

export default compose(
  connect(mapStateToProps, { lobbyUndo, editLobby, toggleGridView }))(LobbyToolbar);
