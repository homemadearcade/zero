import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './GameStatusToolbar.scss';
import ToolbarIcon from '../../../ui/ToolbarIcon/ToolbarIcon';
import { toggleGridView } from '../../../store/actions/game/gameViewEditorActions'
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { PAUSED_STATE, PLAYTHROUGH_PLAY_STATE, PLAY_STATE, PLAYTHROUGH_START_STATE } from '../../constants';
import { INSTANCE_TOOLBAR_PAUSE_IID, INSTANCE_TOOLBAR_PLAYTHROUGH_IID, INSTANCE_TOOLBAR_PLAY_IID, INSTANCE_TOOLBAR_RESET_IID } from '../../../constants/interfaceIds';
import { changeGameStatus, editGameRoom } from '../../../store/actions/game/gameRoomInstanceActions';
import { useWishTheme } from '../../../hooks/useWishTheme';

const GameStatusToolbar = ({ editGameRoom, changeGameStatus, toggleGridView, gameRoomInstance: { gameRoomInstance: { gameStatus, gameResetVersion }, gameRoomInstance } }) => {
  const color = useWishTheme().primaryColor.hexString

  if(gameStatus === PLAYTHROUGH_START_STATE || gameStatus === PLAYTHROUGH_PLAY_STATE) {
    return <div className="GameStatusToolbar">
      <Unlockable isTiny interfaceId={INSTANCE_TOOLBAR_RESET_IID}>
          <ToolbarIcon 
            size="lg"
            icon="faStop"
            onClick={() => {
              editGameRoom(gameRoomInstance.id, {
                gameResetVersion: gameResetVersion + 1
              })
              changeGameStatus(PLAY_STATE)
            }}
          />
      </Unlockable>
    </div>
  }

  //   <Unlockable isTiny interfaceId={INSTANCE_TOOLBAR_UNDO_IID}>
  //   <UndoButton onClick={lobby.id ? lobbyUndo : onInstanceUndo}/>
  // </Unlockable>
  // <Unlockable interfaceId={INSTANCE_TOOLBAR_UNDO_IID}>
  //   <Divider orientation="vertical" variant="middle" flexItem sx={{
  //     mx: 0,
  //     my: 0,
  //     color: '#ccc'
  //   }}/>
  // </Unlockable>
 return <div className="GameStatusToolbar">
  <Unlockable isTiny interfaceId={INSTANCE_TOOLBAR_RESET_IID}>
    <ToolbarIcon 
      size="lg"
      icon="faRepeat"
      onClick={() => {
        editGameRoom(gameRoomInstance.id, {
          gameResetVersion: gameResetVersion + 1
        })
      }}
    />
  </Unlockable>
  <Unlockable isTiny interfaceId={INSTANCE_TOOLBAR_PAUSE_IID}>
    <ToolbarIcon 
      size="lg"
      icon="faPause"
      color={gameStatus === PAUSED_STATE ? color: null}
      onClick={() => {
        changeGameStatus(PAUSED_STATE)
      }}
    />
  </Unlockable>
  <Unlockable isTiny interfaceId={INSTANCE_TOOLBAR_PLAY_IID}>
    <ToolbarIcon 
      size="lg"
      icon="faPlay"
      color={gameStatus === PLAY_STATE ? color: null}
      onClick={() => {
        changeGameStatus(PLAY_STATE)
      }}
    />
  </Unlockable>
  <Unlockable isTiny interfaceId={INSTANCE_TOOLBAR_PLAYTHROUGH_IID}>
    <ToolbarIcon 
      size="lg"
      icon="faCirclePlay"
      color={(gameStatus === PLAYTHROUGH_START_STATE || gameStatus === PLAYTHROUGH_PLAY_STATE) ? color: null}
      onClick={() => {
        toggleGridView(false)
        changeGameStatus(PLAYTHROUGH_START_STATE)
      }}
    />
  </Unlockable>
 </div>
};

const mapStateToProps = (state) => ({
  gameRoomInstance: state.gameRoomInstance
});

export default compose(
  connect(mapStateToProps, { editGameRoom, toggleGridView, changeGameStatus }))(GameStatusToolbar);
