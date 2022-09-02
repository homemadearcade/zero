import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './LobbyToolbar.scss';
import ToolbarIcon from '../../ui/ToolbarIcon/ToolbarIcon';
import { editLobby } from '../../../store/actions/lobbyActions';
import { toggleGridView } from '../../../store/actions/editorActions'
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { BACKGROUND_CANVAS_ID, FOREGROUND_CANVAS_ID, PLAYGROUND_CANVAS_ID } from '../../../constants';
import { getCurrentGameScene } from '../../../utils/editorUtils';

const LobbyToolbar = ({editLobby, game: { gameInstance }, lobby : { lobby, lobby : { isGamePaused }}}) => {
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
    icon="faRotateLeft"
    onClick={() => {
      const scene = getCurrentGameScene(gameInstance)
      const undoAction = window.undoStack.pop()
      console.log(undoAction)
      if(undoAction === BACKGROUND_CANVAS_ID) {
        scene.backgroundLayer.undo()
      }
      if(undoAction === PLAYGROUND_CANVAS_ID) {
        scene.playgroundLayer.undo()
      }
      if(undoAction === FOREGROUND_CANVAS_ID) {
        scene.foregrounddLayer.undo()
      }
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
  editor: state.editor,
  game: state.game
});

export default compose(
  connect(mapStateToProps, { editLobby, toggleGridView }))(LobbyToolbar);
