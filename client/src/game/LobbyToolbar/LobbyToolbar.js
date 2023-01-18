import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './LobbyToolbar.scss';
import ToolbarIcon from '../../ui/ToolbarIcon/ToolbarIcon';
import { editLobby, lobbyUndo } from '../../store/actions/lobbyActions';
import { toggleGridView } from '../../store/actions/gameViewEditorActions'
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import UndoButton from '../ui/UndoButton/UndoButton';
import Unlockable from '../../game/cobrowsing/Unlockable/Unlockable';

const LobbyToolbar = ({lobbyUndo, editLobby, gameContext: { gameState }, lobby : { lobby, lobby : { isGamePaused }}}) => {
 return <div className="LobbyToolbar">
   <Unlockable isTiny interfaceId="toolbar/playPause"><ToolbarIcon 
    size="lg"
    icon={isGamePaused ? "faPlay" : "faPause"} 
    onClick={() => {
      editLobby(lobby.id, {
        isGamePaused: !isGamePaused
      })
    }}
  /></Unlockable>
  <Unlockable isTiny interfaceId="toolbar/undo"><UndoButton onClick={lobbyUndo}/></Unlockable>
  <Unlockable isTiny interfaceId="toolbar/reset"><ToolbarIcon 
    size="lg"
    icon="faStop"
    onClick={() => {
      editLobby(lobby.id, {
        gameResetDate: Date.now(),
        isGamePaused: true
      })
    }}
  /></Unlockable>
 </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  lobby: state.lobby,
  gameContext: state.gameContext
});

export default compose(
  connect(mapStateToProps, { lobbyUndo, editLobby, toggleGridView }))(LobbyToolbar);
