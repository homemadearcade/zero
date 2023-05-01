

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import requireAuth from '../../../hoc/requireAuth';

import './GameViewObscured.scss';
import GameView from '../GameView/GameView';
import Icon from '../../../ui/Icon/Icon';
import { clearErrorState } from '../../../store/actions/errorsActions';
import Button from '../../../ui/Button/Button';
import { editGameRoom } from '../../../store/actions/game/gameRoomInstanceActions';
import GameViewEmpty from '../GameViewEmpty/GameViewEmpty';
import { APP_ADMIN_ROLE, PHASER_ERROR } from '../../../constants';
import GameLoadButton from '../../ui/GameLoadButton/GameLoadButton';
import GameCardLoad from '../../../app/gameModel/GameCardLoad/GameCardLoad';

const GameViewObscured = ({
  auth: { me },
  gameModel,
  errors: { errorStates },
  editGameRoom,
  gameRoomInstance: { gameRoomInstance },
  clearErrorState,
  children,
  webPage: { recentlyFocused }
}) => {
  function renderOverlay() {
    // if(cobrowsingUser.roles[APP_ADMIN_ROLE]) return

    if(errorStates[PHASER_ERROR].on && !recentlyFocused) return <GameViewEmpty>
      <Icon icon="faTriangleExclamation"></Icon>
      Game Error
      {me.roles[APP_ADMIN_ROLE] && <Button onClick={async () => {
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

  }

  if(!gameModel.gameModel && !gameModel.isLoading) {
    return <GameViewEmpty>
      <Icon icon="faCircleQuestion"></Icon>
      No Game Loaded
      <GameLoadButton></GameLoadButton>
    </GameViewEmpty>
  }

  if(!gameRoomInstance.isPoweredOn && !gameModel.isLoading) {
    return <GameViewEmpty>
      {gameRoomInstance.arcadeGameMongoId && <GameCardLoad width="30%" arcadeGameMongoId={gameRoomInstance.arcadeGameMongoId}/>}
      <Icon icon="faPowerOff"></Icon>
      Not Powered On
      {me.roles[APP_ADMIN_ROLE] && <>
        <Button onClick={async () => {
          await editGameRoom(gameRoomInstance.id, {
            isPoweredOn: true
          })
        }}>Power On</Button>
        <GameLoadButton></GameLoadButton>
      </>}
    </GameViewEmpty>
  }

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
  errors: state.errors,
  webPage: state.webPage,
  gameRoomInstance: state.gameRoomInstance
});

export default compose(
  requireAuth,
  connect(mapStateToProps, { editGameRoom, clearErrorState }),
)(GameViewObscured);
