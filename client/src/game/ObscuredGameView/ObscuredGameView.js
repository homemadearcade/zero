
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
import { editLobby } from '../../store/actions/lobbyActions';
import { GAME_VIEW_IID } from '../../constants/interfaceIds';

const ObscuredGameView = ({
  auth: { me },
  lobby: { lobby },
  cobrowsing: { cobrowsingUser, selectedTool },
  gameModel,
  errors: { errorStates },
  editLobby,
  clearErrorState
}) => {
  const { isObscured, isUnlocked } = getInterfaceIdData(GAME_VIEW_IID)

  function renderOverlay() {
    if(cobrowsingUser.role === ADMIN_ROLE) return

    if(errorStates[PHASER_ERROR].on) return <div className="GameView__empty">
      <Icon icon="faTriangleExclamation"></Icon>
      Game Error
      {me.role === ADMIN_ROLE && <Button onClick={async () => {
        await editLobby(lobby.id, {
          isGamePoweredOn: false
        })
        setTimeout(async () => {
          await editLobby(lobby.id, {
            isGamePoweredOn: true
          })
          clearErrorState(PHASER_ERROR)
        }, 100)
      }}>Restart Game</Button>}
    </div>

    if(isObscured) {
      return <div className="GameView__empty GameView__empty--overlay">
        {me.role === ADMIN_ROLE && <>
          <Icon icon="faLock"></Icon>
          Game View Locked
        </>}
      </div>
    } else if(selectedTool === UNLOCK_TOOL) {
      return <div className="ObscuredGameView__unlock">
        <Unlockable interfaceId={GAME_VIEW_IID}><div></div></Unlockable>
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
  errors: state.errors,
});

export default compose(
  requireAuth,
  connect(mapStateToProps, { editLobby, clearErrorState }),
)(ObscuredGameView);
