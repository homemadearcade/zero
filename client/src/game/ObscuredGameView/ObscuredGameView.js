
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import requireAuth from '../../hoc/requireAuth';

import './ObscuredGameView.scss';
import GameView from '../GameView/GameView';
import Unlockable from '../cobrowsing/Unlockable/Unlockable';
import { getInterfaceIdData } from '../../utils/unlockableInterfaceUtils';
import { ADMIN_ROLE, UNLOCK_TOOL } from '../constants';
import Icon from '../../ui/Icon/Icon';

const ObscuredGameView = ({
  auth: { me },
  lobby: { lobby },
  cobrowsing: { cobrowsingUser, selectedTool },
  gameModel,
}) => {
  const { isObscured, isUnlocked } = getInterfaceIdData('gameView')

  function renderOverlay() {
    if(cobrowsingUser.role === ADMIN_ROLE) return

    if(isObscured) {
      return <div className="GameView__empty GameView__empty--overlay">
        {me.role === ADMIN_ROLE && <>
          <Icon icon="faLock"></Icon>
          Game View Locked
        </>}
      </div>
    } else if(selectedTool === UNLOCK_TOOL) {
      return <div className="ObscuredGameView__unlock">
        <Unlockable interfaceId="gameView"><div></div></Unlockable>
      </div>
    }
  }

  if(!gameModel.gameModel) {
     return <div className="GameView__empty">
        <Icon icon="faCircleQuestion"></Icon>
        No Game Loaded
      </div>
  }

  if(!lobby.isGamePoweredOn) return <div className="GameView__empty">
    <Icon icon="faPowerOff"></Icon>
    Not Powered On
  </div>
  

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
  gameModel: state.gameModel,
  unlockableInterfaceIds: state.unlockableInterfaceIds,
});

export default compose(
  requireAuth,
  connect(mapStateToProps, { }),
)(ObscuredGameView);
