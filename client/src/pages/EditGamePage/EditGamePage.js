import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import GameEditor from '../../game/GameEditor/GameEditor';

import './EditGamePage.scss';

import { requestFullscreen } from '../../utils/webPageUtils';
import { loadArcadeGame, unloadArcadeGame } from '../../store/actions/arcadeGameActions';
import GameClassList from '../../game/class/ClassList/ClassList';
import GameBrushList from '../../game/brush/BrushList/BrushList';
import withGame from '../../hoc/withGame';
import requireChrome from '../../hoc/requireChrome';
import GameView from '../../game/GameView/GameView';
import LocalGameToolbar from '../../game/LocalGameToolbar/LocalGameToolbar';
import GridToggle from '../../game/GridToggle/GridToggle';

const EditGamePage = ({ gameModel: { gameModel }, requestFullscreen}) => {
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
          <LocalGameToolbar/>
        </>}
        rightColumn={<>
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
  gameModel: state.gameModel,
});

export default compose(
  requireChrome,
  withGame,
  connect(mapStateToProps, { requestFullscreen, unloadArcadeGame, loadArcadeGame })
)(EditGamePage);
