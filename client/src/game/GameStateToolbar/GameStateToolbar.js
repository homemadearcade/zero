import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './GameStateToolbar.scss';
import ToolbarIcon from '../../ui/ToolbarIcon/ToolbarIcon';
import { lobbyUndo } from '../../store/actions/lobbyActions';
import { toggleGridView } from '../../store/actions/gameViewEditorActions'
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import UndoButton from '../ui/UndoButton/UndoButton';
import Unlockable from '../cobrowsing/Unlockable/Unlockable';
import { changeGameState } from '../../store/actions/gameContextActions';
import { PAUSED_STATE, PLAYTHROUGH_PLAY_STATE, PLAY_STATE, START_STATE, STOPPED_STATE } from '../constants';
import { Divider } from '@mui/material';
import { onInstanceUndo } from '../../store/actions/lobbyActions';

const color = 'rgb(144, 202, 249)'

const GameStateToolbar = ({ changeGameState, lobbyUndo, toggleGridView, gameContext: { gameState }, lobby: { lobby }, onInstanceUndo}) => {
  function renderStop() {
    return <Unlockable isTiny interfaceId="gameInstance/stop">
      <ToolbarIcon 
        size="lg"
        icon="faStop"
        color={gameState === STOPPED_STATE ? color: null}
        onClick={() => {
          changeGameState(STOPPED_STATE)
        }}
      />
    </Unlockable>
  }

  if(gameState === START_STATE || gameState === PLAYTHROUGH_PLAY_STATE) {
    return <div className="GameStateToolbar">
      {renderStop()}
    </div>
  }

  //   <Unlockable isTiny interfaceId="gameInstance/undo">
  //   <UndoButton onClick={lobby.id ? lobbyUndo : onInstanceUndo}/>
  // </Unlockable>
  // <Unlockable interfaceId="gameInstance/undo">
  //   <Divider orientation="vertical" variant="middle" flexItem sx={{
  //     mx: 0,
  //     my: 0,
  //     color: '#ccc'
  //   }}/>
  // </Unlockable>
 return <div className="GameStateToolbar">
  {renderStop()}
  <Unlockable isTiny interfaceId="gameInstance/pause">
    <ToolbarIcon 
      size="lg"
      icon="faPause"
      color={gameState === PAUSED_STATE ? color: null}
      onClick={() => {
        changeGameState(PAUSED_STATE)
      }}
    />
  </Unlockable>
  <Unlockable isTiny interfaceId="gameInstance/play">
    <ToolbarIcon 
      size="lg"
      icon="faPlay"
      color={gameState === PLAY_STATE ? color: null}
      onClick={() => {
        changeGameState(PLAY_STATE)
      }}
    />
  </Unlockable>
  <Unlockable isTiny interfaceId="gameInstance/playthrough">
    <ToolbarIcon 
      size="lg"
      icon="faCirclePlay"
      color={(gameState === START_STATE || gameState === PLAYTHROUGH_PLAY_STATE) ? color: null}
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
}, { forceActiveCobrowsing: true });

export default compose(
  connect(mapStateToProps, { lobbyUndo, toggleGridView, changeGameState, onInstanceUndo }))(GameStateToolbar);
