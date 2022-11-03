import { Fade } from '@mui/material';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Constellation } from '../../components/Constellation/Constellation';
import Link from '../../components/ui/Link/Link';
import Typography from '../../components/ui/Typography/Typography';
import { EDIT_STATE, GAME_OVER_STATE, PLAY_STATE, START_STATE, WIN_GAME_STATE } from '../../constants';
import { changeGameState } from '../../store/actions/gameContextActions';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import KeyIndicator from '../ui/KeyIndicator/KeyIndicator';
import './StateScreen.scss';

function StateScreenBody({changeGameState, gameStateMessage, gameState}) {
  useEffect(() => {
    window.addEventListener('keydown', progressIfX)
    return () => {
      window.removeEventListener('keydown', progressIfX)
    }
  })

  function progressIfX(event) {
    if(!event.key) return
    if(event.key.toLowerCase() === 'x'){
      changeGameState(PLAY_STATE)
    }
  }

  function renderStateScreen() {
    if(gameState === START_STATE) {
      return <Constellation notInteractive>
        <Fade in><div className="StateScreen__content">
          <Typography font="2P" component="h2" variant="h2">Start Game</Typography>
          <Typography component="h5" variant="h5">Press</Typography><KeyIndicator keyName="x"></KeyIndicator> <Typography component="h3" variant="h3">To Start</Typography>
        </div></Fade>
      </Constellation>
    }
    if(gameState === GAME_OVER_STATE) {
      return <Constellation notInteractive>
        <Fade in><div className="StateScreen__content">
          <Typography font="2P" component="h2" variant="h2">Game Over</Typography>
          {gameStateMessage && <Typography component="h3" variant="h3">{gameStateMessage}</Typography>}
          <Typography component="h5" variant="h5">Press</Typography><KeyIndicator keyName="x"></KeyIndicator> <Typography component="h3" variant="h3">To Try Again</Typography>
          <Link to="/games"><Typography component="h5" variant="h5">Return to Arcade</Typography></Link>
        </div></Fade>
      </Constellation>
    }
    if(gameState === WIN_GAME_STATE) {
      return <Constellation notInteractive>
        <Fade in><div className="StateScreen__content">
          <Typography font="2P" component="h2" variant="h2">You won!</Typography>
          {gameStateMessage && <Typography component="h3" variant="h3">{gameStateMessage}</Typography>}
          <Typography component="h5" variant="h5">Press</Typography><KeyIndicator keyName="x"></KeyIndicator> <Typography component="h3" variant="h3">To Play Again</Typography>
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

function StateScreen({gameContext: { gameState, gameStateMessage}, changeGameState}) {
  if(gameState === PLAY_STATE || gameState === EDIT_STATE) {
    return null
  }
  return <StateScreenBody gameState={gameState} gameStateMessage={gameStateMessage} changeGameState={changeGameState}/>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameContext: state.gameContext,
});

export default compose(
  connect(mapStateToProps, { changeGameState}),
)(StateScreen)