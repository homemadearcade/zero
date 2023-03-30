

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import requireAuth from '../../../hoc/requireAuth';

import './GameViewObscured.scss';
import GameView from '../GameView/GameView';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { getInterfaceIdData } from '../../../utils/unlockableInterfaceUtils';
import { UNLOCK_TOOL } from '../../../constants';
import Icon from '../../../ui/Icon/Icon';
import { clearErrorState } from '../../../store/actions/errorsActions';
import Button from '../../../ui/Button/Button';
import { GAME_VIEW_IID } from '../../../constants/interfaceIds';
import { editGameRoom } from '../../../store/actions/game/gameRoomInstanceActions';
import GameViewEmpty from '../GameViewEmpty/GameViewEmpty';
import { ADMIN_ROLE, PHASER_ERROR } from '../../../constants';
import GameLoadButton from '../../ui/GameLoadButton/GameLoadButton';
import GameCardLoad from '../../../app/gameModel/GameCardLoad/GameCardLoad';

const GameViewObscured = ({
  auth: { me },
  cobrowsing: { cobrowsingUser, selectedTool, isActivelyCobrowsing },
  gameModel,
  errors: { errorStates },
  editGameRoom,
  gameRoomInstance: { gameRoomInstance },
  clearErrorState,
  children,
  webPage: { recentlyFocused }
}) => {
  const { isObscured, isUnlocked } = getInterfaceIdData(GAME_VIEW_IID)

  function renderOverlay() {
    // if(cobrowsingUser.role === ADMIN_ROLE) return

    if(errorStates[PHASER_ERROR].on && !recentlyFocused) return <GameViewEmpty>
      <Icon icon="faTriangleExclamation"></Icon>
      Game Error
      {me.role === ADMIN_ROLE && <Button onClick={async () => {
        await editGameRoom(gameRoomInstance.id, {
          isPoweredOn: false
        })
        setTimeout(async () => {
          await editGameRoom(gameRoomInstance.id, {
            isPoweredOn: true
          })
          clearErrorState(PHASER_ERROR)
        }, 100)
      }}>Restart Game</Button>}
    </GameViewEmpty>

    if(isObscured) {
      return <GameViewEmpty>
        {me.role === ADMIN_ROLE && < div style={{color: 'red'}}>
          <Icon icon="faLock"></Icon>
          Game View Locked<br/> ( Participant only sees a black box )
        </div>}
      </GameViewEmpty>
    } else if(selectedTool === UNLOCK_TOOL && !isUnlocked) {
      return <GameViewEmpty>
        <Unlockable className="GameViewObscured__unlock" interfaceId={GAME_VIEW_IID}>
        </Unlockable>
      </GameViewEmpty>
    }
  }

  if(!gameModel.gameModel && !gameModel.isLoading) {
    return <GameViewEmpty>
      <Icon icon="faCircleQuestion"></Icon>
      No Game Loaded
      <GameLoadButton></GameLoadButton>
    </GameViewEmpty>
  }

  if(!gameRoomInstance.isPoweredOn && !gameModel.isLoading) return <GameViewEmpty>
    <GameCardLoad width="30%" gameId={gameRoomInstance.gameId}/>
    <Icon icon="faPowerOff"></Icon>
    Not Powered On
    {me.role === ADMIN_ROLE && <>
      <Button onClick={async () => {
          await editGameRoom(gameRoomInstance.id, {
          isPoweredOn: true
        })
      }}>Power On</Button>
      <GameLoadButton></GameLoadButton>
    </>}
  </GameViewEmpty>

  if(gameRoomInstance.isPoweredOn) {
    return <>
      {renderOverlay()}
      <GameView>
        {children}
      </GameView> 
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
  gameRoomInstance: state.gameRoomInstance
});

export default compose(
  requireAuth,
  connect(mapStateToProps, { editGameRoom, clearErrorState }),
)(GameViewObscured);
