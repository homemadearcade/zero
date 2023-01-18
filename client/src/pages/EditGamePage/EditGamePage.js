import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import GameEditor from '../../game/GameEditor/GameEditor';

import './EditGamePage.scss';

import { requestFullscreen } from '../../utils/webPageUtils';
import { loadArcadeGame, unloadArcadeGame } from '../../store/actions/arcadeGameActions';
import withGame from '../../hoc/withGame';
import requireChrome from '../../hoc/requireChrome';
import GameView from '../../game/GameView/GameView';

const EditGamePage = ({ }) => {
  // <div>{!window.isFullscreen && <div onClick={() => {
  //   requestFullscreen()
  //    }}>
  //   <i className="fas fa-expand EditGamePage__fullscreen"/>
  //  </div>
  // </div>

  return (
    <div className="EditGamePage">
      <GameEditor 
        leftColumn={<>
        </>}
        rightColumn={<>
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

});

export default compose(
  requireChrome,
  withGame,
  connect(mapStateToProps, { requestFullscreen, unloadArcadeGame, loadArcadeGame })
)(EditGamePage);
