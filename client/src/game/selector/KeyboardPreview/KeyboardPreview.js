import React  from 'react';
import { connect } from 'react-redux';
import './KeyboardPreview.scss'
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Typography from '../../../ui/Typography/Typography';
import Icon from '../../../ui/Icon/Icon';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { KEY_TOOLBAR_ACTIONS_IID } from '../../../constants/interfaceIds';

import { unlockInterfaceId } from '../../../store/actions/game/unlockedInterfaceActions';

const KeyboardPreview = ({ 
  cobrowsing: {
    interfaceIdHovering,
    isActivelyCobrowsing,
    isSubscribedCobrowsing,
    selectedTool,
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
    currentSelectorListInterfaceId,
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
    isMouseOverGameView
  },
  changeKeyboardPreviewActionIdHovering,
  unlockInterfaceId,
  keyToolbar
}) => {


  function renderCoreKey(text) {
    return <>
      <Typography sx={{fontSize: '.5em', color: '#aaa'}} variant="subtitle2" font="2P">
        {text}
      </Typography>
    </>
  }

  return <Unlockable interfaceId={KEY_TOOLBAR_ACTIONS_IID}>
    <div className="KeyboardPreview">
      <div className="KeyboardPreview__core-row">
        <div className="KeyboardPreview__core-key">
          {renderCoreKey('ESC')}
        </div>
        <div className="KeyboardPreview__core-action">

        </div>
      </div>
      <div className="KeyboardPreview__core-row">
        <div className="KeyboardPreview__core-key">
          {renderCoreKey('SHIFT')}
        </div>
        <div className="KeyboardPreview__core-action">
          
        </div>
      </div>
      <div className="KeyboardPreview__core-row">
        <div className="KeyboardPreview__core-key">
          {renderCoreKey('X')}
        </div>
        <div className="KeyboardPreview__core-action">
          
        </div>
      </div>
      <div className="KeyboardPreview__core-row">
        <div className="KeyboardPreview__core-key">
          {renderCoreKey('Space')}
        </div>
        <div className="KeyboardPreview__core-action">
          
        </div>
      </div>
      <div className="KeyboardPreview__core-row">
        <div className="KeyboardPreview__core-key">
          {renderCoreKey('Up')}
        </div>
        <div className="KeyboardPreview__core-action">
          
        </div>
      </div>
      <div className="KeyboardPreview__core-row">
        <div className="KeyboardPreview__core-key">
          {renderCoreKey('Left/Right')}
        </div>
        <div className="KeyboardPreview__core-action">
          
        </div>
      </div>
      <div className="KeyboardPreview__core-row">
        <div className="KeyboardPreview__core-key">
          {renderCoreKey('Down')}
        </div>
        <div className="KeyboardPreview__core-action">
          
        </div>
      </div>
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
})

export default connect(mapStateToProps, {
  unlockInterfaceId
})(KeyboardPreview);
