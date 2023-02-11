import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import GameEditor from '../../game/GameEditor/GameEditor';

import './EditGamePage.scss';

import { requestFullscreen } from '../../utils/webPageUtils';
import { loadArcadeGame, unloadArcadeGame } from '../../store/actions/arcadeGameActions';
import withGame from '../../hoc/withGame';
import requireChrome from '../../hoc/requireChrome';
import GameView from '../../game/GameView/GameView';
import { changeGameState } from '../../store/actions/gameSessionActions';
import { PLAY_STATE } from '../../game/constants';

const EditGamePage = ({changeGameState }) => {
  // <div>{!window.isFullscreen && <div onClick={() => {
  //   requestFullscreen()
  //    }}>
  //   <i className="fas fa-expand EditGamePage__fullscreen"/>
  //  </div>
  // </div>

  useEffect(() => {
    changeGameState(PLAY_STATE)

    return () => {
      // unloadArcadeGame()
    }
  }, [])

  return (
    <div className="EditGamePage">
      <GameEditor 
        leftColumn={<>
        </>}
        rightColumn={<>
        </>}
      >
        <GameView
          isEdit
        />
      </GameEditor>
    </div>
  );
};

const mapStateToProps = (state) => ({

});

export default compose(
  requireChrome,
  withGame,
  connect(mapStateToProps, { changeGameState })
)(EditGamePage);
