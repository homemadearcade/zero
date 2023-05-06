import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './PlayGamePage.scss';

import { requestFullscreen } from '../../utils/webPageUtils';
import requireChrome from '../../hoc/requireChrome';
import GameView from '../../game/view/GameView/GameView';
import { unloadArcadeGame } from '../../store/actions/game/arcadeGameActions';
import { changeGameState } from '../../store/actions/game/gameRoomInstanceActions';
import LocalGameRoomContext from '../../hoc/LocalGameRoomContext';
import { PLAYTHROUGH_START_STATE } from '../../game/constants';
import { withRouter } from 'react-router-dom';

const PlayGamePage = ({ match }) => {
  return (
    <div className="PlayGamePage">
      <LocalGameRoomContext room={{gameState: PLAYTHROUGH_START_STATE, arcadeGameMongoId: match.params.arcadeGameMongoId}}>
        <GameView/>
      </LocalGameRoomContext>
    </div>
  );
};

const mapStateToProps = (state) => ({

});

export default compose(
  requireChrome,
  withRouter,
  connect(mapStateToProps, { requestFullscreen, changeGameState, unloadArcadeGame })
)(PlayGamePage);
