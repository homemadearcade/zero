
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
import { PHASER_ERROR } from '../../lobby/constants';
import { clearErrorState } from '../../store/actions/errorsActions';
import Button from '../../ui/Button/Button';
import { GAME_VIEW_IID } from '../../constants/interfaceIds';
import { editGameSession } from '../../store/actions/gameSessionActions';

const ObscuredGameView = ({
  auth: { me },
  cobrowsing: { cobrowsingUser, selectedTool, isActivelyCobrowsing },
  gameModel,
  errors: { errorStates },
  editGameSession,
  gameSession: { gameSession },
  clearErrorState,
  webPage: { recentlyFocused }
}) => {
  const { isObscured, isUnlocked } = getInterfaceIdData(GAME_VIEW_IID)

  function renderOverlay() {
    if(cobrowsingUser.role === ADMIN_ROLE) return

    if(errorStates[PHASER_ERROR].on && !recentlyFocused) return <div className="GameView__empty">
      <Icon icon="faTriangleExclamation"></Icon>
      Game Error
      {me.role === ADMIN_ROLE && <Button onClick={async () => {
        await editGameSession(gameSession.id, {
          isPoweredOn: false
        })
        setTimeout(async () => {
          await editGameSession(gameSession.id, {
            isPoweredOn: true
          })
          clearErrorState(PHASER_ERROR)
        }, 100)
      }}>Restart Game</Button>}
    </div>

    if(isObscured) {
      return <div className="GameView__empty">
        {me.role === ADMIN_ROLE && <>
          <Icon icon="faLock"></Icon>
          Game View Locked<br/> ( Participant only sees a black box )
        </>}
      </div>
    } else if(selectedTool === UNLOCK_TOOL && !isUnlocked) {
      return <div className="GameView__empty">
        <Unlockable className="ObscuredGameView__unlock" interfaceId={GAME_VIEW_IID}>
        </Unlockable>
      </div>
    }
  }

  if(!gameModel.gameModel && !gameModel.isLoading) {
    return <div className="GameView__empty">
      <Icon icon="faCircleQuestion"></Icon>
      No Game Loaded
    </div>
  }

  if(!gameSession.isPoweredOn) return <div className="GameView__empty">
    <Icon icon="faPowerOff"></Icon>
    Not Powered On
  </div>

  if(gameSession.isPoweredOn) {
    return <>
      {renderOverlay()}
      <GameView/>
    </>
  }
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  cobrowsing: state.cobrowsing,
  gameModel: state.gameModel,
  unlockableInterfaceIds: state.unlockableInterfaceIds,
  errors: state.errors,
  webPage: state.webPage,
  gameSession: state.gameSession
});

export default compose(
  requireAuth,
  connect(mapStateToProps, { editGameSession, clearErrorState }),
)(ObscuredGameView);
