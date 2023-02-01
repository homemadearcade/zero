
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import requireAuth from '../../hoc/requireAuth';

import './ObscuredGameView.scss';
import GameView from '../GameView/GameView';
import Unlockable from '../cobrowsing/Unlockable/Unlockable';
import { getInterfaceIdData } from '../../utils/unlockableInterfaceUtils';
import { ADMIN_ROLE } from '../constants';

const ObscuredGameView = ({
  auth: { me },
  lobby: { lobby },
  cobrowsing: { cobrowsingUser, isActivelyCobrowsing }
}) => {
  const { isObscured, isUnlocked } = getInterfaceIdData('gameView')

  function renderOverlay() {
    if(cobrowsingUser.role === ADMIN_ROLE) return

    if(isObscured) {
      return <div className="GameView__empty GameView__empty--overlay">

      </div>
    } else if(!isActivelyCobrowsing) {
      return <div className="ObscuredGameView__unlock">
        <Unlockable interfaceId="gameView"><div></div></Unlockable>
      </div>
    }
  }


  if(!lobby.isGamePoweredOn) return <div className="GameView__empty"></div>

  if(lobby.isGamePoweredOn) {
    return <>
      {renderOverlay()}
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
