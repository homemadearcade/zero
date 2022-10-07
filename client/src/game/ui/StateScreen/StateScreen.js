import { Fade } from '@mui/material';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Constellation } from '../../../app/Constellation/Constellation';
import Link from '../../../app/ui/Link/Link';
import Typography from '../../../app/ui/Typography/Typography';
import { GAME_OVER_STATE, PLAY_STATE, START_STATE, WIN_GAME_STATE } from '../../../constants';
import { changeGameState } from '../../../store/actions/narrativeActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import KeyIndicator from '../KeyIndicator/KeyIndicator';
import './StateScreen.scss';

function StateScreenBody({changeGameState, gameState}) {
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
          <Typography component="h3" variant="h3">Press</Typography><KeyIndicator keyName="x"></KeyIndicator> <Typography component="h3" variant="h3">To Start</Typography>
        </div></Fade>
      </Constellation>
    }
    if(gameState === GAME_OVER_STATE) {
      return <Constellation notInteractive>
        <Fade in><div className="StateScreen__content">
          <Typography font="2P" component="h2" variant="h2">Game Over</Typography>
          <Typography component="h3" variant="h3">Press</Typography><KeyIndicator keyName="x"></KeyIndicator> <Typography component="h3" variant="h3">To Try Again</Typography>
          <Link to="/games"><Typography component="h3" variant="h3">Return to Arcade</Typography></Link>
        </div></Fade>
      </Constellation>
    }
    if(gameState === WIN_GAME_STATE) {
      return <Constellation notInteractive>
        <Fade in><div className="StateScreen__content">
          <Typography font="2P" component="h2" variant="h2">You won!</Typography>
          <Typography component="h3" variant="h3">Press</Typography><KeyIndicator keyName="x"></KeyIndicator> <Typography component="h3" variant="h3">To Play Again</Typography>
          <Link to="/games"><Typography component="h3" variant="h3">Return to Arcade</Typography></Link>
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

function StateScreen({narrative: { gameState}, changeGameState}) {
  if(gameState === PLAY_STATE) {
    return null
  }
  return <StateScreenBody gameState={gameState} changeGameState={changeGameState}/>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  narrative: state.narrative,
});

export default compose(
  connect(mapStateToProps, { changeGameState}),
)(StateScreen)