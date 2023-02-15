import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import GameEditor from '../../game/GameEditor/GameEditor';

import './EditGamePage.scss';

import withGame from '../../hoc/withGame';
import requireChrome from '../../hoc/requireChrome';
import GameView from '../../game/GameView/GameView';
import LocalGameSessionContext from '../../hoc/LocalGameSessionContext';
import { PLAY_STATE } from '../../game/constants';

const EditGamePage = ({changeGameState }) => {
  return (
    <div className="EditGamePage">
      <LocalGameSessionContext session={{isEdit: true, gameState: PLAY_STATE}}>
        <GameEditor 
          leftColumn={<>
          </>}
          rightColumn={<>
          </>}
        >
          <GameView/>
        </GameEditor>
      </LocalGameSessionContext>
    </div>
  );
};

const mapStateToProps = (state) => ({

});

export default compose(
  requireChrome,
  withGame,
  connect(mapStateToProps, { })
)(EditGamePage);
