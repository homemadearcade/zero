import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import GameEditor from '../../game/GameEditor/GameEditor';

import './PlayGamePage.scss';

import { requestFullscreen } from '../../utils/browser';
import { loadGame, unloadGame } from '../../store/actions/gameActions';
import GameClassList from '../../game/ClassList/ClassList';
import GameBrushList from '../../game/BrushList/BrushList';
import withGame from '../../hoc/withGame';

const PlayGamePage = ({ game: { gameModel }, requestFullscreen}) => {
  // <div>{!window.isFullscreen && <div onClick={() => {
  //   requestFullscreen()
  //    }}>
  //   <i className="fas fa-expand PlayGamePage__fullscreen"/>
  //  </div>
  // </div>

  return (
    <div className="PlayGamePage">
      <GameEditor 
        isHost
        isNetworked={false}
        gameModel={gameModel}
        leftColumn={<GameBrushList/>}
        rightColumn={<GameClassList/>}
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
