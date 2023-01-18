import React, { } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import './GameStatus.scss';
import AccordianList from '../../../../ui/AccordianList/AccordianList';
import Typography from '../../../../ui/Typography/Typography';
import Icon from '../../../../ui/Icon/Icon';
import { mapCobrowsingState } from '../../../../utils/cobrowsingUtils';
import { getCurrentGameScene } from '../../../../utils/editorUtils';
import store from '../../../../store';

const GameStatus = ({ lobby: { lobby: { game, isGamePoweredOn}}, gameContext: { gameState } }) => {

  if(!game) return <Typography component="div" variant="subtitle2">No Game Selected</Typography>
  const scene = getCurrentGameScene(store.getState().webPage.gameInstance)

  function renderGameInstanceSceneStatus() {
    return <>
      <span className="GameStatus__fullscreen"><span className="GameStatus__icon"></span>{scene.isPaused ? 'Is Paused': 'Not Paused'}</span>
      <span className="GameStatus__fullscreen"><span className="GameStatus__icon"></span>{scene.isEditor ? 'Is Editor': 'Not Editor'}</span>
      <span className="GameStatus__fullscreen"><span className="GameStatus__icon"></span>{scene.isPlaythrough ? 'Is Playthrough': 'Not Playthrough'}</span>
      <span className="GameStatus__fullscreen"><span className="GameStatus__icon"></span>{scene.isGridViewOn ? 'GridView On': 'Not GridView'}</span>
    </>
  }
  
  return <div className={classnames("GameStatus")}>
    <AccordianList accordians={[{
      id: game.id,
      title: <span className="GameStatus__title">
        {game.metadata.name || game.user.username + "'s game"}
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
  gameContext: state.gameContext
});

export default connect(mapStateToProps, {  })(GameStatus);
