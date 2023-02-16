import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './PlayGamePage.scss';

import { requestFullscreen } from '../../utils/webPageUtils';
import withGame from '../../hoc/withGame';
import requireChrome from '../../hoc/requireChrome';
import GameView from '../../game/view/GameView/GameView';
import { unloadArcadeGame } from '../../store/actions/arcadeGameActions';
import { changeGameState } from '../../store/actions/gameSessionActions';
import LocalGameSessionContext from '../../hoc/LocalGameSessionContext';
import { START_STATE } from '../../game/constants';

const PlayGamePage = () => {
  return (
    <div className="PlayGamePage">
      <LocalGameSessionContext session={{gameState: START_STATE}}>
        <GameView/>
      </LocalGameSessionContext>
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
