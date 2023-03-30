import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './GameStateToolbar.scss';
import ToolbarIcon from '../../../ui/ToolbarIcon/ToolbarIcon';
import { toggleGridView } from '../../../store/actions/game/gameViewEditorActions'
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { PAUSED_STATE, PLAYTHROUGH_PLAY_STATE, PLAY_STATE, START_STATE } from '../../constants';
import { onInstanceUndo } from '../../../store/actions/experience/lobbyInstanceActions';
import { INSTANCE_TOOLBAR_PAUSE_IID, INSTANCE_TOOLBAR_PLAYTHROUGH_IID, INSTANCE_TOOLBAR_PLAY_IID, INSTANCE_TOOLBAR_RESET_IID } from '../../../constants/interfaceIds';
import { changeGameState, editGameRoom } from '../../../store/actions/game/gameRoomInstanceActions';
import { useWishTheme } from '../../../hooks/useWishTheme';

const GameStateToolbar = ({ editGameRoom, changeGameState, toggleGridView, gameRoomInstance: { gameRoomInstance: { gameState }, gameRoomInstance } }) => {
  const color = useWishTheme().primaryColor.hexString

  if(gameState === START_STATE || gameState === PLAYTHROUGH_PLAY_STATE) {
    return <div className="GameStateToolbar">
      <Unlockable isTiny interfaceId={INSTANCE_TOOLBAR_RESET_IID}>
          <ToolbarIcon 
            size="lg"
            icon="faStop"
            onClick={() => {
              editGameRoom(gameRoomInstance.id, {
                gameResetDate: Date.now()
              })
              changeGameState(PLAY_STATE)
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
 return <div className="GameStateToolbar">
  <Unlockable isTiny interfaceId={INSTANCE_TOOLBAR_RESET_IID}>
    <ToolbarIcon 
      size="lg"
      icon="faRepeat"
      onClick={() => {
        editGameRoom(gameRoomInstance.id, {
          gameResetDate: Date.now()
        })
      }}
    />
  </Unlockable>
  <Unlockable isTiny interfaceId={INSTANCE_TOOLBAR_PAUSE_IID}>
    <ToolbarIcon 
      size="lg"
      icon="faPause"
      color={gameState === PAUSED_STATE ? color: null}
      onClick={() => {
        changeGameState(PAUSED_STATE)
      }}
    />
  </Unlockable>
  <Unlockable isTiny interfaceId={INSTANCE_TOOLBAR_PLAY_IID}>
    <ToolbarIcon 
      size="lg"
      icon="faPlay"
      color={gameState === PLAY_STATE ? color: null}
      onClick={() => {
        changeGameState(PLAY_STATE)
      }}
    />
  </Unlockable>
  <Unlockable isTiny interfaceId={INSTANCE_TOOLBAR_PLAYTHROUGH_IID}>
    <ToolbarIcon 
      size="lg"
      icon="faCirclePlay"
      color={(gameState === START_STATE || gameState === PLAYTHROUGH_PLAY_STATE) ? color: null}
      onClick={() => {
        toggleGridView(false)
        changeGameState(START_STATE)
      }}
    />
  </Unlockable>
 </div>
};

const mapStateToProps = (state) => ({
  gameRoomInstance: state.gameRoomInstance
});

export default compose(
  connect(mapStateToProps, { editGameRoom, toggleGridView, changeGameState, onInstanceUndo }))(GameStateToolbar);
