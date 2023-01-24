import React, { } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './GamePreview.scss';
import withGame from '../../hoc/withGame';
import GameView from '../../game/GameView/GameView';
import GameStatus from '../../lobby/GameStatus/GameStatus';
import LobbyUserStatus from '../../lobby/LobbyUserStatus/LobbyUserStatus';
import { getInterfaceIdData } from '../../utils/unlockableInterfaceUtils';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';

const GamePreview = ({lobby: { lobby }}) => {
  const usersById = lobby.users.reduce((prev, next) => {
    prev[next.id] = next
    return prev
  }, {})

  const { isUnlocked } = getInterfaceIdData('gameView', { forceActiveCobrowsing: true })

  return (
    <div className="GamePreview">
      <GameView
        isHost={false}
        isNetworked={true}
      />
      {(!isUnlocked || !lobby.isGamePoweredOn) && 
        <div className="GameView__empty">

        </div>
      }
      <div className="GamePreview__user">
        <LobbyUserStatus hasJoinLink hasUIButton userId={usersById[lobby.participantId]?.id}/>
      </div>
      <div className="GamePreview__note"><GameStatus/></div>
    </div>
  );
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  lobby: state.lobby,
  unlockableInterfaceIds: state.unlockableInterfaceIds
}, { forceActiveCobrowsing: true });

export default compose(
  withGame,
  connect(mapStateToProps, { })
)(GamePreview);
