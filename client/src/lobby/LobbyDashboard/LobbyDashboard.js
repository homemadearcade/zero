/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './LobbyDashboard.scss';
import LobbyDetail from '../LobbyDetail/LobbyDetail';
import Link from '../../ui/Link/Link';
import LobbySetupFlow from '../LobbySetupFlow/LobbySetupFlow';
import LobbyPowerIndicator from '../LobbyPowerIndicator/LobbyPowerIndicator';
import GamePreview from '../../game/GamePreview/GamePreview';
import { getInterfaceIdData } from '../../utils/unlockableInterfaceUtils';
import LobbyUserStatus from '../LobbyUserStatus/LobbyUserStatus';

const LobbyDashboard = ({
  lobby: { lobby }
}) => {
  const usersById = lobby.users.reduce((prev, next) => {
    prev[next.id] = next
    return prev
  }, {})

  const { isUnlocked } = getInterfaceIdData('gameView')

  function renderGamePreview() {    
    return <GamePreview gameId={lobby.game?.id}>
      {(!isUnlocked) && 
        <div className="GameEditor__empty-game GameEditor__empty-game--overlay">

        </div>
      }
      <div className="GamePreview__user"><LobbyUserStatus hasJoinLink userId={usersById[lobby.participantId]?.id}/></div>
    </GamePreview>    
  }

  return (
    <div className="LobbyDashboard">
      <div className="LobbyDashboard__content">
        <LobbySetupFlow/>
        <Link to={`/lobby/${lobby.id}/join/${lobby.participantId}`}>{renderGamePreview()}</Link>
      </div>
    </div>      
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby
});

export default compose(
  connect(mapStateToProps, { }),
)(LobbyDashboard);
