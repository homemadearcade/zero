import React, { useEffect} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import GameView from '../../game/GameView/GameView';

import './PlayGamePage.scss';

import { requestFullscreen } from '../../store/actions/browserActions';
import { getGame, clearGameModel } from '../../store/actions/gameActions';
import Loader from '../../components/Loader/Loader';

const PlayGamePage = ({ getGame, clearGameModel, game: { gameModel, isGameModelLoading },  requestFullscreen, match}) => {
  useEffect(() => {
    getGame(match.params.id);

    return () => {
      clearGameModel()
    }
  }, []);

  if(!gameModel) {
    return <Loader text="Loading Game Data..."></Loader>
  }

  return (
    <div className="PlayGamePage">
      <GameView 
        overlay={isGameModelLoading && <Loader text="Reloading Game Data..."></Loader>}
        gameModel={gameModel}
        leftColumn={<div>
          {!window.isFullscreen && <div onClick={() => {
            requestFullscreen()
          }}>
            <i className="fas fa-expand PlayGamePage__fullscreen"/>
          </div>}
        </div>}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  game: state.game
});

export default compose(connect(mapStateToProps, { requestFullscreen, clearGameModel, getGame }))(PlayGamePage);
