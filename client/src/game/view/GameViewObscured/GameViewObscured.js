
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import requireAuth from '../../../hoc/requireAuth';

import './GameViewObscured.scss';
import GameView from '../GameView/GameView';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { getInterfaceIdData } from '../../../utils/unlockableInterfaceUtils';
import { UNLOCK_TOOL } from '../../constants';
import Icon from '../../../ui/Icon/Icon';
import { clearErrorState } from '../../../store/actions/errorsActions';
import Button from '../../../ui/Button/Button';
import { GAME_VIEW_IID } from '../../../constants/interfaceIds';
import { editGameRoom } from '../../../store/actions/gameRoomActions';
import GameViewEmpty from '../GameViewEmpty/GameViewEmpty';
import { ADMIN_ROLE, PHASER_ERROR } from '../../../constants';

const GameViewObscured = ({
  auth: { me },
  cobrowsing: { cobrowsingUser, selectedTool, isActivelyCobrowsing },
  gameModel,
  errors: { errorStates },
  editGameRoom,
  gameRoom: { gameRoom },
  clearErrorState,
  webPage: { recentlyFocused }
}) => {
  const { isObscured, isUnlocked } = getInterfaceIdData(GAME_VIEW_IID)

  function renderOverlay() {
    if(cobrowsingUser.role === ADMIN_ROLE) return

    if(errorStates[PHASER_ERROR].on && !recentlyFocused) return <GameViewEmpty>
      <Icon icon="faTriangleExclamation"></Icon>
      Game Error
      {me.role === ADMIN_ROLE && <Button onClick={async () => {
        await editGameRoom(gameRoom.id, {
          isPoweredOn: false
        })
        setTimeout(async () => {
          await editGameRoom(gameRoom.id, {
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
    </GameViewEmpty>
  }

  if(!gameRoom.isPoweredOn) return <GameViewEmpty>
    <Icon icon="faPowerOff"></Icon>
    Not Powered On
  </GameViewEmpty>

  if(gameRoom.isPoweredOn) {
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
  gameRoom: state.gameRoom
});

export default compose(
  requireAuth,
  connect(mapStateToProps, { editGameRoom, clearErrorState }),
)(GameViewObscured);
