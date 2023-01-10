/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './LobbyDashboard.scss';
import LobbySetupFlow from '../LobbySetupFlow/LobbySetupFlow';
import GamePreview from '../../game/GamePreview/GamePreview';
import { getInterfaceIdData } from '../../utils/unlockableInterfaceUtils';
import LobbyUserStatus from '../LobbyUserStatus/LobbyUserStatus';

const LobbyDashboard = ({
  lobby: { lobby },
  unlockableInterfaceIds,
}) => {
  const usersById = lobby.users.reduce((prev, next) => {
    prev[next.id] = next
    return prev
  }, {})

  const { isUnlocked } = getInterfaceIdData('gameView')

  function renderGamePreview() {      
    return <GamePreview gameId={lobby.currentGameId} userId={lobby.participantId}>
      {(!isUnlocked || !lobby.isGamePoweredOn) && 
        <div className="GameEditor__empty-game GameEditor__empty-game--overlay">

        </div>
      }
      <div className="GamePreview__user">
        <LobbyUserStatus hasJoinLink userId={usersById[lobby.participantId]?.id}/>
      </div>
    </GamePreview>
  }

  return (
    <div className="LobbyDashboard">
      <div className="LobbyDashboard__content">
        <LobbySetupFlow/>
        {renderGamePreview()}
      </div>
    </div>      
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
  unlockableInterfaceIds: state.unlockableInterfaceIds
});

export default compose(
  connect(mapStateToProps, { }),
)(LobbyDashboard);
