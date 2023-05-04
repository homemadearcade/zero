import React  from 'react';
import { connect } from 'react-redux';
import './KeyboardPreview.scss'
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Typography from '../../../ui/Typography/Typography';
import Icon from '../../../ui/Icon/Icon';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { KEY_TOOLBAR_ACTIONS_IID } from '../../../constants/interfaceIds';
import { COBROWSE_CLICK_TOOL_AID, COBROWSE_UNLOCK_TOOL_AID } from '../../../constants/interfaceActionIds';
import PlayerControlsCard from '../PlayerControlsCard/PlayerControlsCard';

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
  },
}) => {


  function renderKey(text) {
    return <>
      <Typography sx={{fontSize: '.5em', color: '#aaa'}} variant="subtitle2" font="2P">
        {text}
      </Typography>
    </>
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
  }

  const playerEntityModel = gameModel.entityModels[playerEntityModelId]
  const projectileEntityModel = gameModel.entityModels[playerEntityModel?.projectile.entityModelId]

  return <Unlockable interfaceId={KEY_TOOLBAR_ACTIONS_IID}>
    <div className="KeyboardPreview">
      <div className="KeyboardPreview__row">
        <div className="KeyboardPreview__key">
          {renderKey('ESC')}
        </div>
        <div className="KeyboardPreview__action">
          {renderActionTitle(renderEscAction())}
        </div>
      </div>
      <div className="KeyboardPreview__row">
        <div className="KeyboardPreview__key">
          {renderKey('SHIFT')}
        </div>
        <div className="KeyboardPreview__action">
          {renderActionTitle(renderShiftAction())}
        </div>
      </div>
      <div className="KeyboardPreview__row">
        <div className="KeyboardPreview__key">
          {renderKey('X')}
        </div>
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

})(KeyboardPreview);
