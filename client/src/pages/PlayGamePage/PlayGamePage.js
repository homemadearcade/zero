import React, { useEffect} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import GameView from '../../game/GameView/GameView';

import './PlayGamePage.scss';

import { requestFullscreen } from '../../store/actions/browserActions';
import { getGame } from '../../store/actions/gameActions';
import Loader from '../../components/Loader/Loader';

const PlayGamePage = ({ getGame, game: { model, isModelLoading },  requestFullscreen, match}) => {
  useEffect(() => {
    getGame(match.params.id);
  }, []);

  if(!model) {
    return <Loader text="Loading Game Data..."></Loader>
  }

  return (
    <div className="PlayGamePage">
      <GameView 
        overlay={isModelLoading && <Loader text="Reloading Game Data..."></Loader>}
        model={model}
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

export default compose(connect(mapStateToProps, { requestFullscreen, getGame }))(PlayGamePage);
