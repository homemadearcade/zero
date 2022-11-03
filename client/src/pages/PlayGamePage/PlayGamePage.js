import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './PlayGamePage.scss';

import { requestFullscreen } from '../../utils/webPageUtils';
import { loadGame, unloadGame } from '../../store/actions/gameActions';
import withGame from '../../hoc/withGame';
import GameView from '../../game/GameView/GameView';
import { changeGameState } from '../../store/actions/gameContextActions';
import { START_STATE } from '../../game/constants';

const PlayGamePage = ({ game: { gameModel }, changeGameState, requestFullscreen}) => {
  useEffect(() => {
    changeGameState(START_STATE)
  }, [])

  // <div>{!window.isFullscreen && <div onClick={() => {
  //   requestFullscreen()
  //    }}>
  //   <i className="fas fa-expand PlayGamePage__fullscreen"/>
  //  </div>
  // </div>

  return (
    <div className="PlayGamePage">
        <GameView
          isHost
          isNetworked={false}
          isPlay
        />
    </div>
  );
};

const mapStateToProps = (state) => ({
  game: state.game
});

export default compose(
  withGame,
  connect(mapStateToProps, { requestFullscreen, unloadGame, loadGame, changeGameState })
)(PlayGamePage);
