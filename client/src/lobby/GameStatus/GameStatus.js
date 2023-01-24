import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import './GameStatus.scss';
import AccordianList from '../../ui/AccordianList/AccordianList';
import Typography from '../../ui/Typography/Typography';
import Icon from '../../ui/Icon/Icon';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import { getCurrentGameScene } from '../../utils/editorUtils';
import store from '../../store';

const GameStatus = ({ lobby: { lobby: { isGamePoweredOn}}, gameContext: { gameState }, gameModel: { gameModel } }) => {
  const [ups, setUps] = useState(null)
  
  useEffect(() => {
    const upsInterval = setInterval(() => {
      const scene = getCurrentGameScene(store.getState().webPage.gameInstance)
      setUps(scene.ups)
    }, 1000)

    return () => {
      clearInterval(upsInterval)
    }
  }, [])

  if(!gameModel) return <Typography component="div" variant="subtitle2">No Game Model Loaded</Typography>
  const scene = getCurrentGameScene(store.getState().webPage.gameInstance)

  function renderGameInstanceSceneStatus() {
    return <>
      <span className="GameStatus__fullscreen"><span className="GameStatus__icon"></span>{scene.isPaused ? 'Is Paused': 'Not Paused'}</span>
      <span className="GameStatus__fullscreen"><span className="GameStatus__icon"></span>{scene.isEditor ? 'Is Editor': 'Not Editor'}</span>
      <span className="GameStatus__fullscreen"><span className="GameStatus__icon"></span>{scene.isPlaythrough ? 'Is Playthrough': 'Not Playthrough'}</span>
      <span className="GameStatus__fullscreen"><span className="GameStatus__icon"></span>{scene.isGridViewOn ? 'GridView On': 'Not GridView'}</span>
      <span className="GameStatus__fullscreen"><span className="GameStatus__icon"></span>{'FPS:' + scene.game.loop.actualFps}</span>
      {ups && <span className="GameStatus__fullscreen"><span className="GameStatus__icon"></span>{'UPS:' + ups}</span>}
    </>
  }
  
  return <div className={classnames("GameStatus")}>
    <AccordianList accordians={[{
      id: gameModel.id,
      title: <span className="GameStatus__title">
        {gameModel.metadata.name || gameModel.user.username + "'s game"}
      </span>,
      body: <span className="GameStatus__icons">
        <span className="GameStatus__fullscreen"><span className="GameStatus__icon"><Icon icon="faPowerOff"/></span>{(isGamePoweredOn) ? 'Started' : 'Not Started'}</span>
        <span className="GameStatus__fullscreen"><span className="GameStatus__icon"></span>{gameState}</span>
        {scene && renderGameInstanceSceneStatus()}
      </span>
    }]}/>
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  lobby: state.lobby,
  gameContext: state.gameContext,
  gameModel: state.gameModel
});

export default connect(mapStateToProps, {  })(GameStatus);
