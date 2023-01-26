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
  const [ups, setUps] = useState({})
  
  useEffect(() => {
    const upsInterval = setInterval(() => {
      const scene = getCurrentGameScene(store.getState().webPage.gameInstance)
      if(scene) setUps(
        {
          client: scene.upsclient,
          host: scene.upshost,
          server: scene.upsserver
        }
      )
    }, 1000)

    return () => {
      clearInterval(upsInterval)
    }
  }, [])

  if(!gameModel) return <Typography component="div" variant="subtitle2">No Game Model Loaded</Typography>
  const scene = getCurrentGameScene(store.getState().webPage.gameInstance)

  function renderGameInstanceSceneStatus() {
    return <>
      {ups.client >= 0 && <strong className="GameStatus__fullscreen"><strong className="GameStatus__icon"></strong>{`UPS-CLIENT: ${ups.client} (${String((ups.client/12) * 100).substring(0,5)}%)`}</strong>}
      {ups.host >= 0 && <strong className="GameStatus__fullscreen"><strong className="GameStatus__icon"></strong>{`UPS-HOST: ${ups.host} (${String((ups.host/12) * 100).substring(0,5)}%)`}</strong>}
      {ups.server >= 0 && <strong className="GameStatus__fullscreen"><strong className="GameStatus__icon"></strong>{`UPS-SERVER: ${ups.server} (${String((ups.server/12) * 100).substring(0,5)}%)`}</strong>}
      <span className="GameStatus__fullscreen"><span className="GameStatus__icon"></span>{'FPS: ' + String(scene.game.loop.actualFps).substring(0,5)}</span>
      <span className="GameStatus__fullscreen"><span className="GameStatus__icon"></span>{scene.isPaused ? 'Is Paused': 'Not Paused'}</span>
      <span className="GameStatus__fullscreen"><span className="GameStatus__icon"></span>{scene.isEditor ? 'Is Editor': 'Not Editor'}</span>
      <span className="GameStatus__fullscreen"><span className="GameStatus__icon"></span>{scene.isPlaythrough ? 'Is Playthrough': 'Not Playthrough'}</span>
      <span className="GameStatus__fullscreen"><span className="GameStatus__icon"></span>{scene.isGridViewOn ? 'GridView On': 'Not GridView'}</span>
    </>
  }
  
  return <div className={classnames("GameStatus")}>
    <AccordianList accordians={[{
      id: gameModel.id,
      title: <span className="GameStatus__title">
        {gameModel.metadata.name || gameModel.user?.username + "'s game"}
      </span>,
      body: <span className="GameStatus__icons">
        <span className="GameStatus__fullscreen"><span className="GameStatus__icon"><Icon icon="faPowerOff"/></span>{(isGamePoweredOn) ? 'Powered On' : 'Not Powered On'}</span>
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
