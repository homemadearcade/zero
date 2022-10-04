import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './PlayGamePage.scss';

import { requestFullscreen } from '../../utils/browserUtils';
import { loadGame, unloadGame } from '../../store/actions/gameActions';
import withGame from '../../hoc/withGame';
import GameView from '../../game/GameView/GameView';

const PlayGamePage = ({ game: { gameModel }, requestFullscreen}) => {
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
  connect(mapStateToProps, { requestFullscreen, unloadGame, loadGame })
)(PlayGamePage);
