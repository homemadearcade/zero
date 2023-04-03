import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import GameEditor from '../../game/view/GameEditor/GameEditor';

import './EditGamePage.scss';

import withGame from '../../hoc/withGame';
import requireChrome from '../../hoc/requireChrome';
import LocalGameRoomContext from '../../hoc/LocalGameRoomContext';
import { PLAY_STATE } from '../../game/constants';
import requireAuth from '../../hoc/requireAuth';

const EditGamePage = ({}) => {
  return (
    <LocalGameRoomContext room={{isEdit: true, gameState: PLAY_STATE}}>
      <div className="EditGamePage">
          <GameEditor 
            leftColumn={<>
            </>}
            rightColumn={<>
            </>}
          >
          </GameEditor>
      </div>
    </LocalGameRoomContext>
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
