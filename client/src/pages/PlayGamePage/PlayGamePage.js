import React, { useEffect} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import GameEditor from '../../game/GameEditor/GameEditor';

import './PlayGamePage.scss';

import { requestFullscreen } from '../../utils/browser';
import { loadGame, unloadGame } from '../../store/actions/gameActions';
import Loader from '../../app/ui/Loader/Loader';
import GameClassList from '../../game/ClassList/ClassList';
import GameBrushList from '../../game/BrushList/BrushList';

const PlayGamePage = ({ loadGame, unloadGame, game: { gameModel, isSpriteSheetDataLoading, isPhaserLoadingSpriteSheets, isGameModelLoading },  requestFullscreen, match}) => {
  useEffect(() => {
    loadGame(match.params.id);

    return () => {
      unloadGame()
    }
  }, []);

  if(!gameModel) {
    return <Loader text="Loading Game Data..."></Loader>
  }

  if(isSpriteSheetDataLoading) {
    return <Loader text="Loading Sprites..."/>
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
