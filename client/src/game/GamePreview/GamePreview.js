import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './GamePreview.scss';
import withGame from '../../hoc/withGame';
import GameView from '../../game/GameView/GameView';
import GameStatus from '../../app/homemadeArcade/arcadeGame/GameStatus/GameStatus';
import { loadCobrowsingPreview } from '../../store/actions/cobrowsingActions';
import LobbyUserStatus from '../../lobby/LobbyUserStatus/LobbyUserStatus';
import { getInterfaceIdData } from '../../utils/unlockableInterfaceUtils';

const GamePreview = ({unlockableInterfaceIds, userId, loadCobrowsingPreview, lobby: { lobby }}) => {
  useEffect(() => {
    if(userId) {
      loadCobrowsingPreview(userId)
    }
  }, [userId])

  const usersById = lobby.users.reduce((prev, next) => {
    prev[next.id] = next
    return prev
  }, {})

  const { isUnlocked } = getInterfaceIdData('gameView')

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

const mapStateToProps = (state) => ({
  lobby: state.lobby,
  unlockableInterfaceIds: state.unlockableInterfaceIds
});

export default compose(
  withGame,
  connect(mapStateToProps, { loadCobrowsingPreview })
)(GamePreview);
