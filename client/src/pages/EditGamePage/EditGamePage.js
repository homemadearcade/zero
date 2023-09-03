import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import GameEditor from '../../game/view/GameEditor/GameEditor';

import './EditGamePage.scss';

import requireChrome from '../../hoc/requireChrome';
import LocalGameRoomContext from '../../hoc/LocalGameRoomContext';
import { PLAY_STATE } from '../../game/constants';
import requireAuth from '../../hoc/requireAuth';
import { withRouter } from 'react-router-dom';

const EditGamePage = ({ match }) => {
  return (
    <LocalGameRoomContext room={{isEdit: true, gameStatus: PLAY_STATE, arcadeGameMongoId: match.params.arcadeGameMongoId}}>
      <div className="EditGamePage">
        <GameEditor 
          leftColumn={<>

          </>}
          rightColumn={<>

          </>}
        />
      </div>
    </LocalGameRoomContext>
  );
};

const mapStateToProps = (state) => ({

});

export default compose(
  requireChrome,
  requireAuth,
  withRouter,
  connect(mapStateToProps, { })
)(EditGamePage);
