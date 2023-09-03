import { Fade } from '@mui/material';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Constellation } from '../../../marketing/homemadeArcade/Constellation/Constellation';
import Link from '../../../ui/Link/Link';
import Typography from '../../../ui/Typography/Typography';
import { GAME_END_STATE, PLAYTHROUGH_PLAY_STATE, PLAY_STATE,
PLAYTHROUGH_START_STATE } from '../../constants';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import KeyIndicator from '../../ui/KeyIndicator/KeyIndicator';
import './GameStatusScreen.scss';
import PlayerControlsCard from '../../selector/PlayerControlsCard/PlayerControlsCard';
import store from '../../../store';
import useFitText from "use-fit-text";
import { changeGameStatus } from '../../../store/actions/game/gameRoomInstanceActions';
import useGameEditorSize from '../../../hooks/useGameEditorSize';

function GameStatusScreenBody({changeGameStatus, gameStatusMessage, gameStatus, gameModel: { gameModel }}) {
  const { fontSize, ref } = useFitText();
  const { gameEditorWidth, gameEditorHeight } = useGameEditorSize()

  function renderGameStatusScreen() {
    if(gameStatus === PLAYTHROUGH_START_STATE) {
      const playerEntityModel = gameModel.entityModels[gameModel.stages[gameModel.player.startingStageId].playerEntityModelId]
      const projectileEntityModel = gameModel.entityModels[playerEntityModel?.projectile.entityModelId]
      return <Constellation width={gameEditorWidth} height={gameEditorHeight} notInteractive>
        <Fade in><div className="GameStatusScreen__content">
          <Typography font="2P" component="h2" variant="h2"><div ref={ref} style={{fontSize}} className='GameStatusScreen__title'>
              {gameModel.metadata.title}
          </div></Typography>
          <div className="GameStatusScreen__press">
            <Typography component="h5" variant="h5">Press</Typography><KeyIndicator blink keyName="x"></KeyIndicator> <Typography component="h5" variant="h5">To Start</Typography>
          </div>
          <div className="GameStatusScreen__controls">
            {playerEntityModel && <PlayerControlsCard showInteract entityModel={playerEntityModel} projectileEntityModel={projectileEntityModel} movementControlBehavior={playerEntityModel.movement.movementControlsBehavior} jumpControlsBehavior={playerEntityModel.jump.jumpControlsBehavior}></PlayerControlsCard>}
          </div>
        </div></Fade>
      </Constellation>
    }

    if(gameStatus === GAME_END_STATE) {
      return <Constellation width={gameEditorWidth} height={gameEditorHeight} notInteractive>
        <Fade in><div className="GameStatusScreen__content">
          <Typography font="2P" component="h2" variant="h2">Game Over</Typography>
          {gameStatusMessage && <Typography component="h3" variant="h3"><div ref={ref} style={{fontSize}} className='GameStatusScreen__title' >
          {gameStatusMessage}
        </div></Typography>}
          <div className="GameStatusScreen__press">
            <Typography component="h5" variant="h5">Press</Typography><KeyIndicator keyName="x"></KeyIndicator> <Typography component="h5" variant="h5">To Play Again</Typography>
          </div>
          {!store.getState().gameRoomInstance.gameRoomInstance.isOnlineMultiplayer && <Link to="/arcade"><Typography component="h5" variant="h5">Return to Arcade</Typography></Link>}
        </div></Fade>
      </Constellation>
    }
  }

  return (
    <div className="GameStatusScreen">
      {renderGameStatusScreen()}
    </div>
  );
}

function GameStatusScreen({gameRoomInstance: { gameRoomInstance: { gameStatus, gameStatusMessage }}, changeGameStatus, gameModel}) {
  if(gameStatus !== PLAYTHROUGH_START_STATE && gameStatus !== GAME_END_STATE) {
    return null
  }

  return <GameStatusScreenBody gameStatus={gameStatus} gameStatusMessage={gameStatusMessage} changeGameStatus={changeGameStatus} gameModel={gameModel}/>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameRoomInstance: state.gameRoomInstance,
  gameModel: state.gameModel,
});

export default compose(
  connect(mapStateToProps, { changeGameStatus}),
)(GameStatusScreen)