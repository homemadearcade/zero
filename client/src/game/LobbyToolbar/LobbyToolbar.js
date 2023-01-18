import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './LobbyToolbar.scss';
import ToolbarIcon from '../../ui/ToolbarIcon/ToolbarIcon';
import { lobbyUndo } from '../../store/actions/lobbyActions';
import { toggleGridView } from '../../store/actions/gameViewEditorActions'
import { getCobrowsingState, mapCobrowsingState } from '../../utils/cobrowsingUtils';
import UndoButton from '../ui/UndoButton/UndoButton';
import Unlockable from '../../game/cobrowsing/Unlockable/Unlockable';
import { changeGameState } from '../../store/actions/gameContextActions';
import { PAUSED_STATE, PLAYTHROUGH_PLAY_STATE, PLAY_STATE, START_STATE, STOPPED_STATE } from '../constants';
import { Divider } from '@mui/material';
import { onInstanceUndo } from '../../store/actions/lobbyActions';

const LobbyToolbar = ({ changeGameState, lobbyUndo, toggleGridView, gameContext: { gameState }, lobby: { lobby }, onInstanceUndo}) => {
  function renderStop() {
    return <Unlockable isTiny interfaceId="toolbar/stop">
      <ToolbarIcon 
        size="lg"
        icon="faStop"
        color={gameState === STOPPED_STATE ? 'blue': null}
        onClick={() => {
          changeGameState(STOPPED_STATE)
        }}
      />
    </Unlockable>
  }

  if(gameState === START_STATE || gameState === PLAYTHROUGH_PLAY_STATE) {
    return <div className="LobbyToolbar">
      {renderStop()}
    </div>
  }

 return <div className="LobbyToolbar">
  <Unlockable isTiny interfaceId="toolbar/undo">
    <UndoButton onClick={lobby.id ? lobbyUndo : onInstanceUndo}/>
  </Unlockable>
  <Unlockable hideLockToggle interfaceId="toolbar/undo">
    <Divider orientation="vertical" variant="middle" flexItem sx={{
      mx: 0,
      my: 0,
      color: '#ccc'
    }}/>
  </Unlockable>
  {renderStop()}
  <Unlockable isTiny interfaceId="toolbar/pause">
    <ToolbarIcon 
      size="lg"
      icon="faPause"
      color={gameState === PAUSED_STATE ? 'blue': null}
      onClick={() => {
        changeGameState(PAUSED_STATE)
      }}
    />
  </Unlockable>
  <Unlockable isTiny interfaceId="toolbar/play">
    <ToolbarIcon 
      size="lg"
      icon="faPlay"
      color={gameState === PLAY_STATE ? 'blue': null}
      onClick={() => {
        changeGameState(PLAY_STATE)
      }}
    />
  </Unlockable>
  <Unlockable isTiny interfaceId="toolbar/playthrough">
    <ToolbarIcon 
      size="lg"
      icon="faCirclePlay"
      color={(gameState === START_STATE || gameState === PLAYTHROUGH_PLAY_STATE) ? 'blue': null}
      onClick={() => {
        toggleGridView(false)
        changeGameState(START_STATE)
      }}
    />
  </Unlockable>
 </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  lobby: state.lobby,
  gameContext: state.gameContext
}, { force: true });

export default compose(
  connect(mapStateToProps, { lobbyUndo, toggleGridView, changeGameState, onInstanceUndo }))(LobbyToolbar);
