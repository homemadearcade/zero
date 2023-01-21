import { Fade } from '@mui/material';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Constellation } from '../../app/homemadeArcade/Constellation/Constellation';
import Link from '../../ui/Link/Link';
import Typography from '../../ui/Typography/Typography';
import { GAME_OVER_STATE, PLAYTHROUGH_PLAY_STATE, PLAY_STATE, START_STATE, WIN_GAME_STATE } from '../constants';
import { changeGameState } from '../../store/actions/gameContextActions';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import KeyIndicator from '../ui/KeyIndicator/KeyIndicator';
import './StateScreen.scss';
import ControlsCard from '../ui/ControlsCard/ControlsCard';
import { getCurrentGameScene } from '../../utils/editorUtils';
import store from '../../store';

function StateScreenBody({changeGameState, gameStateMessage, gameState, gameModel: { gameModel }, player}) {
  useEffect(() => {
    window.addEventListener('keydown', progressIfX)
    return () => {
      window.removeEventListener('keydown', progressIfX)
    }
  })

  function progressIfX(event) {
    if(!event.key) return
    if(event.key.toLowerCase() === 'x'){
      const scene = getCurrentGameScene(store.getState().webPage.gameInstance)
      if(scene.isPlaythrough) {
        changeGameState(PLAYTHROUGH_PLAY_STATE)
      } else {
        changeGameState(PLAY_STATE)
      }
    }
  }

  function renderStateScreen() {
    if(gameState === START_STATE) {
      const playerClass = gameModel.classes[player.classId]
      return <Constellation notInteractive>
        <Fade in><div className="StateScreen__content">
          <Typography font="2P" component="h2" variant="h2">{gameModel.metadata.title}</Typography>
          <div className="StateScreen__press">
            <Typography component="h5" variant="h5">Press</Typography><KeyIndicator keyName="x"></KeyIndicator> <Typography component="h5" variant="h5">To Start</Typography>
          </div>
          <div className="StateScreen__controls">
            <Typography component="h5" variant="h5">Controls</Typography>
            <ControlsCard showInteract objectClass={playerClass} projectileClass={playerClass.projectile.class} controlScheme={playerClass.movement.controls} jumpStyle={playerClass.jump.style}></ControlsCard>
          </div>
        </div></Fade>
      </Constellation>
    }

    if(gameState === GAME_OVER_STATE) {
      return <Constellation notInteractive>
        <Fade in><div className="StateScreen__content">
          <Typography font="2P" component="h2" variant="h2">Game Over</Typography>
          {gameStateMessage && <Typography component="h3" variant="h3">{gameStateMessage}</Typography>}
          <div className="StateScreen__press">
            <Typography component="h5" variant="h5">Press</Typography><KeyIndicator keyName="x"></KeyIndicator> <Typography component="h3" variant="h3">To Try Again</Typography>
          </div>
          <Link to="/games"><Typography component="h5" variant="h5">Return to Arcade</Typography></Link>
        </div></Fade>
      </Constellation>
    }
    if(gameState === WIN_GAME_STATE) {
      return <Constellation notInteractive>
        <Fade in><div className="StateScreen__content">
          <Typography font="2P" component="h2" variant="h2">You won!</Typography>
          {gameStateMessage && <Typography component="h3" variant="h3">{gameStateMessage}</Typography>}
          <div className="StateScreen__press">
            <Typography component="h5" variant="h5">Press</Typography><KeyIndicator keyName="x"></KeyIndicator> <Typography component="h3" variant="h3">To Play Again</Typography>
          </div>
          <Link to="/games"><Typography component="h5" variant="h5">Return to Arcade</Typography></Link>
        </div></Fade>
      </Constellation>
    }
  }

  return (
    <div className="StateScreen">
      {renderStateScreen()}
    </div>
  );
}

function StateScreen({gameContext: { gameState, gameStateMessage, player}, changeGameState, gameModel}) {
  if(gameState !== START_STATE && gameState !== WIN_GAME_STATE && gameState !== GAME_OVER_STATE) {
    return null
  }

  return <StateScreenBody gameState={gameState} gameStateMessage={gameStateMessage} changeGameState={changeGameState} gameModel={gameModel} player={player}/>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameContext: state.gameContext,
  gameModel: state.gameModel,
});

export default compose(
  connect(mapStateToProps, { changeGameState}),
)(StateScreen)