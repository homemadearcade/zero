
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import requireAuth from '../../hoc/requireAuth';

import './ObscuredGameView.scss';
import GameView from '../GameView/GameView';
import Unlockable from '../cobrowsing/Unlockable/Unlockable';
import { getInterfaceIdData } from '../../utils/unlockableInterfaceUtils';

const ObscuredGameView = ({
  auth: { me },
  lobby: { lobby },
  cobrowsing: { showUnlockableInterfaceLocks }
}) => {

  const { isObscured, isUnlocked } = getInterfaceIdData('gameView')

    if(!lobby.isGamePoweredOn) return <div className="GameEditor__empty-game"></div>

    if(lobby.isGamePoweredOn) {
      return <>{(isObscured || (!isUnlocked && showUnlockableInterfaceLocks)) && 
        <div className="GameEditor__empty-game GameEditor__empty-game--overlay">
          <Unlockable isTiny interfaceId="gameView"><div></div></Unlockable>
        </div>
        }
        <GameView
          isHost={lobby.gameHostId === me.id}
          isNetworked
        />
      </>
    }
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  lobby: state.lobby,
  cobrowsing: state.cobrowsing,
  unlockableInterfaceIds: state.unlockableInterfaceIds,
});

export default compose(
  requireAuth,
  connect(mapStateToProps, { }),
)(ObscuredGameView);
