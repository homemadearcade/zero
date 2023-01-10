/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './LobbyDashboard.scss';
import LobbySetupFlow from '../LobbySetupFlow/LobbySetupFlow';
import GamePreview from '../../game/GamePreview/GamePreview';

const LobbyDashboard = ({
  lobby: { lobby },
}) => {

  function renderGamePreview() {      
    return <GamePreview gameId={lobby.currentGameId} userId={lobby.participantId}></GamePreview>
  }

  return (
    <div className="LobbyDashboard">
      <div className="LobbyDashboard__content">
        {renderGamePreview()}
        <LobbySetupFlow/>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
});

export default compose(
  connect(mapStateToProps, { }),
)(LobbyDashboard);
