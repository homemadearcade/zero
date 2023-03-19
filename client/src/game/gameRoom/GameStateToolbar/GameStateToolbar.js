import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './GameStateToolbar.scss';
import ToolbarIcon from '../../../ui/ToolbarIcon/ToolbarIcon';
import { lobbyUndo } from '../../../store/actions/lobbyActions';
import { toggleGridView } from '../../../store/actions/gameViewEditorActions'
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { PAUSED_STATE, PLAYTHROUGH_PLAY_STATE, PLAY_STATE, START_STATE, STOPPED_STATE } from '../../constants';
import { onInstanceUndo } from '../../../store/actions/lobbyActions';
import { INSTANCE_TOOLBAR_PAUSE_IID, INSTANCE_TOOLBAR_PLAYTHROUGH_IID, INSTANCE_TOOLBAR_PLAY_IID, INSTANCE_TOOLBAR_RESET_IID } from '../../../constants/interfaceIds';
import { changeGameState, editGameRoom } from '../../../store/actions/gameRoomActions';
import { useWishTheme } from '../../../hooks/useWishTheme';

const GameStateToolbar = ({ editGameRoom, changeGameState, lobbyUndo, toggleGridView, gameRoom: { gameRoom: { gameState }, gameRoom } }) => {
  const color = useWishTheme().primaryColor.hexString
        // color={gameState === STOPPED_STATE ? color: null}

  if(gameState === START_STATE || gameState === PLAYTHROUGH_PLAY_STATE) {
    return <div className="GameStateToolbar">
      <Unlockable isTiny interfaceId={INSTANCE_TOOLBAR_RESET_IID}>
          <ToolbarIcon 
            size="lg"
            icon="faStop"
            color={gameState === STOPPED_STATE ? color: null}
            onClick={() => {
              editGameRoom(gameRoom.id, {
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
      color={gameState === STOPPED_STATE ? color: null}
      onClick={() => {
        editGameRoom(gameRoom.id, {
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
  gameRoom: state.gameRoom
});

export default compose(
  connect(mapStateToProps, { editGameRoom, lobbyUndo, toggleGridView, changeGameState, onInstanceUndo }))(GameStateToolbar);
