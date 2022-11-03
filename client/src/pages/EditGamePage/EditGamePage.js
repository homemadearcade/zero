import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import GameEditor from '../../game/GameEditor/GameEditor';

import './EditGamePage.scss';

import { requestFullscreen } from '../../utils/webPageUtils';
import { loadGame, unloadGame } from '../../store/actions/gameActions';
import GameClassList from '../../game/class/ClassList/ClassList';
import GameBrushList from '../../game/brush/BrushList/BrushList';
import withGame from '../../hoc/withGame';
import GameView from '../../game/GameView/GameView';
import LocalGameToolbar from '../../game/LocalGameToolbar/LocalGameToolbar';
import GridToggle from '../../game/GridToggle/GridToggle';

const EditGamePage = ({ game: { gameModel }, requestFullscreen}) => {
  // <div>{!window.isFullscreen && <div onClick={() => {
  //   requestFullscreen()
  //    }}>
  //   <i className="fas fa-expand EditGamePage__fullscreen"/>
  //  </div>
  // </div>

  return (
    <div className="EditGamePage">
      <GameEditor 
        gameModel={gameModel}
        leftColumn={<>
          <GridToggle/>
          <GameBrushList/>
        </>}
        rightColumn={<>
          <LocalGameToolbar/>
          <GameClassList/>
        </>}
      >
        <GameView
          isHost
          isNetworked={false}
        />
      </GameEditor>
    </div>
  );
};

const mapStateToProps = (state) => ({
  game: state.game
});

export default compose(
  withGame,
  connect(mapStateToProps, { requestFullscreen, unloadGame, loadGame })
)(EditGamePage);
