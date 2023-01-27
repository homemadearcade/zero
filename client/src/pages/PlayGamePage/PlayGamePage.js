import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './PlayGamePage.scss';

import { requestFullscreen } from '../../utils/webPageUtils';
import withGame from '../../hoc/withGame';
import requireChrome from '../../hoc/requireChrome';
import GameView from '../../game/GameView/GameView';
import { changeGameState } from '../../store/actions/gameContextActions';
import { START_STATE } from '../../game/constants';
import { unloadArcadeGame } from '../../store/actions/arcadeGameActions';

const PlayGamePage = ({ gameModel: { gameModel }, changeGameState, requestFullscreen, unloadArcadeGame}) => {
  useEffect(() => {
    changeGameState(START_STATE)

    return () => {
      // unloadArcadeGame()
    }
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
  gameModel: state.gameModel,
});

export default compose(
  requireChrome,
  withGame,
  connect(mapStateToProps, { requestFullscreen, changeGameState, unloadArcadeGame })
)(PlayGamePage);
