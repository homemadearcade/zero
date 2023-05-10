import React  from 'react';
import { connect } from 'react-redux';
import './KeyboardPreview.scss'
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Typography from '../../../ui/Typography/Typography';
import Icon from '../../../ui/Icon/Icon';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { KEYBOARD_ACTIONS_IID } from '../../../constants/interfaceIds';
import { COBROWSE_CLICK_TOOL_AID, COBROWSE_UNLOCK_TOOL_AID } from '../../../constants/interfaceActionIds';
import PlayerControlsCard from '../PlayerControlsCard/PlayerControlsCard';
import { useKeyPress } from '../../../hooks/useKeyPress';
import { useWishTheme } from '../../../hooks/useWishTheme';
import { toggleGridView } from '../../../store/actions/game/gameViewEditorActions';

const KeyboardPreview = ({ 
  cobrowsing: {
    interfaceIdHovering,
    isActivelyCobrowsing,
    isSubscribedCobrowsing,
    selectedTool,
  },
  playerInterface: {
    interactOppurtunity,
    playerEntityModelId
  },
  hoverPreview: { 
    brushIdHovering, 
    entityModelIdHovering,
    entityInstanceIdHovering,
    instanceDataHovering,
    effectIdHovering,
    relationIdHovering,
    relationTagIdHovering
  },
  gameSelector: {
    brushIdSelectedBrushList,
    entityModelIdSelectedEntityList,
  },
  gameModel: { 
    currentStageId,
    gameModel,
  },
  gameRoomInstance: {
    gameRoomInstance
  },
  gameViewEditor: {
    isBoundaryEditorOpen,
    isSnapshotTakerOpen,
    isMouseOverGameView,
    resizingEntityInstanceId,
    isDialogOverGameView
  },
  toggleGridView,
  isExpanded
}) => {

  const isShiftPressed = useKeyPress('Shift', () => {
    if(selectedTool) {
      return
    }

    if(entityModelIdSelectedEntityList) {
      return
    }
    if(isDialogOverGameView) {
      return
    }
    
    toggleGridView()
  }, [selectedTool, isDialogOverGameView, entityModelIdSelectedEntityList])

  const isEscPressed = useKeyPress('Escape')
  const isXPressed = useKeyPress('x')
  const isX2Pressed = useKeyPress('X')

  const theme = useWishTheme()

  const isKeyIdPressed = {
    'Shift': isShiftPressed,
    'Esc': isEscPressed,
    'X': isXPressed || isX2Pressed,
  }

  function renderKey(key) {
    return <div className="KeyboardPreview__key" style={{
      backgroundColor: isKeyIdPressed[key] && theme.primaryColor.hexString,
      color: isKeyIdPressed[key] && 'white',
    }}>
      <Typography sx={{fontSize: '.5em', color: '#aaa'}} variant="subtitle2" font="2P">
        {key}
      </Typography>
    </div>
  }

  function renderActionTitle(action) {
    return <>
      <Typography sx={{fontSize: '.8em'}} variant="subtitle2">
        {action}
      </Typography>
    </>
  }

  function renderEscAction() {
    if(selectedTool) {
      return 'Close Tool'
    }

    if(brushIdSelectedBrushList) {
      return 'Unselect'
    }

    if(entityModelIdSelectedEntityList) {
      return 'Unselect'
    }

    if(resizingEntityInstanceId) {
      return 'Cancel Resize'
    }

    if(isBoundaryEditorOpen) {
      return 'Close Boundary Editor'
    }

    if(isSnapshotTakerOpen) {
      return 'Close Snapshot Taker'
    }
  }

  function renderShiftAction() {
    if(entityModelIdSelectedEntityList) {
      return 'Place Multiple'
    }

    if(selectedTool === COBROWSE_UNLOCK_TOOL_AID) {
      return 'Unlock Multiple'
    }

    if(selectedTool === COBROWSE_CLICK_TOOL_AID) {
      return 'Click Multiple'
    }

    return 'Toggle Grid View'
  }

  const playerEntityModel = gameModel.entityModels[playerEntityModelId]
  const projectileEntityModel = gameModel.entityModels[playerEntityModel?.projectile.entityModelId]

  if(!isExpanded) return

  return <Unlockable interfaceId={KEYBOARD_ACTIONS_IID}>
    <div className="KeyboardPreview">
      <div className="KeyboardPreview__row">
        {renderKey('Esc')}
        <div className="KeyboardPreview__action">
          {renderActionTitle(renderEscAction())}
        </div>
      </div>
      <div className="KeyboardPreview__row">
        {renderKey('Shift')}
        <div className="KeyboardPreview__action">
          {renderActionTitle(renderShiftAction())}
        </div>
      </div>
      <div className="KeyboardPreview__row">
        {renderKey('X')}
        <div className="KeyboardPreview__action">
          {interactOppurtunity && renderActionTitle('Interact')}
        </div>
      </div>
      {playerEntityModel && <PlayerControlsCard 
        entityModel={playerEntityModel}
        projectileEntityModel={projectileEntityModel}
        movementControlBehavior={playerEntityModel.movement.movementControlsBehavior}
        jumpControlsBehavior={playerEntityModel.jump.jumpControlsBehavior}
      />}
    </div>
  </Unlockable>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  hoverPreview: state.hoverPreview,
  gameModel: state.gameModel,
  gameSelector: state.gameSelector,
  cobrowsing: state.cobrowsing,
  gameRoomInstance: state.gameRoomInstance,
  gameViewEditor: state.gameViewEditor,
  keyToolbar: state.keyToolbar,
  playerInterface: state.playerInterface,
})

export default connect(mapStateToProps, {
  toggleGridView
})(KeyboardPreview);
