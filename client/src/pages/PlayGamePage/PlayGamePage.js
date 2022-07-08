import React, { useEffect} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import GameEditor from '../../game/GameEditor/GameEditor';

import './PlayGamePage.scss';

import { requestFullscreen } from '../../store/actions/browserActions';
import { loadGame, unloadGame } from '../../store/actions/gameActions';
import Loader from '../../components/ui/Loader/Loader';
import GameClassList from '../../game/GameClassList/GameClassList';
import GameBrushList from '../../game/GameBrushList/GameBrushList';

const PlayGamePage = ({ loadGame, unloadGame, game: { gameModel, isGameModelLoading },  requestFullscreen, match}) => {
  useEffect(() => {
    loadGame(match.params.id);

    return () => {
      unloadGame()
    }
  }, []);

  if(!gameModel) {
    return <Loader text="Loading Game Data..."></Loader>
  }

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
        overlay={isGameModelLoading && <Loader text="Reloading Game Data..."></Loader>}
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

export default compose(connect(mapStateToProps, { requestFullscreen, unloadGame, loadGame }))(PlayGamePage);
