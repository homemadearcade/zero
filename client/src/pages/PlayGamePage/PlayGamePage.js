import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './PlayGamePage.scss';

import { requestFullscreen } from '../../utils/webPageUtils';
import withGame from '../../hoc/withGame';
import requireChrome from '../../hoc/requireChrome';
import GameView from '../../game/view/GameView/GameView';
import { unloadArcadeGame } from '../../store/actions/game/arcadeGameActions';
import { changeGameState } from '../../store/actions/game/gameRoomInstanceActions';
import LocalGameRoomContext from '../../hoc/LocalGameRoomContext';
import { START_STATE } from '../../game/constants';

const PlayGamePage = () => {
  return (
    <div className="PlayGamePage">
      <LocalGameRoomContext room={{gameState: START_STATE}}>
        <GameView/>
      </LocalGameRoomContext>
    </div>
  );
};

const mapStateToProps = (state) => ({

});

export default compose(
  requireChrome,
  withGame,
  connect(mapStateToProps, { requestFullscreen, changeGameState, unloadArcadeGame })
)(PlayGamePage);
