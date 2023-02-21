import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import GameEditor from '../../game/view/GameEditor/GameEditor';

import './EditGamePage.scss';

import withGame from '../../hoc/withGame';
import requireChrome from '../../hoc/requireChrome';
import GameView from '../../game/view/GameView/GameView';
import LocalGameRoomContext from '../../hoc/LocalGameRoomContext';
import { PLAY_STATE } from '../../game/constants';
import requireAuth from '../../hoc/requireAuth';

const EditGamePage = ({}) => {
  return (
    <div className="EditGamePage">
      <LocalGameRoomContext room={{isEdit: true, gameState: PLAY_STATE}}>
        <GameEditor 
          leftColumn={<>
          </>}
          rightColumn={<>
          </>}
        >
          <GameView/>
        </GameEditor>
      </LocalGameRoomContext>
    </div>
  );
};

const mapStateToProps = (state) => ({

});

export default compose(
  requireChrome,
  requireAuth,
  withGame,
  connect(mapStateToProps, { })
)(EditGamePage);
