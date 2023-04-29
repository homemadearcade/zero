import React, { useState } from 'react';
import { connect } from 'react-redux';
import './ClickPreview.scss'
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Typography from '../../../ui/Typography/Typography';
import Texture from '../../textures/Texture/Texture';
import { getLayerIdFromColorId, getLayerIdFromEraserId, getHexFromColorId, isBrushIdColor, isBrushIdEraser } from '../../../utils/editorUtils';
import { dataSourceIIDToIcon, effectInterfaceDatas, layerGroupIIDtoShortName, PAUSED_STATE } from '../../constants';
import Icon from '../../../ui/Icon/Icon';
import ColorNameFit from '../../color/ColorNameFit/ColorNameFit';
import { interfaceIdData } from '../../../constants/interfaceIdData';
import { entityModelTypeToDisplayName } from '../../constants';
import { initialStageId } from '../../constants';
import { changeSelectorList, openEntityBehaviorLiveEditor, openGameEditDialog, openStageLiveEditor } from '../../../store/actions/game/gameSelectorActions';
import Button from '../../../ui/Button/Button';
import { openEditContentDialog, openEditEntityDialog, openEditEntityGraphics, openEditRelationSystemDialog, openEffectPromptDialog } from '../../../store/actions/game/gameFormEditorActions';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { openSnapshotTaker } from '../../../store/actions/game/gameViewEditorActions';
import { useWishTheme } from '../../../hooks/useWishTheme';
import IconButton from '../../../ui/IconButton/IconButton';
import useGameEditorSize from '../../../hooks/useGameEditorSize';
import { Paper } from '@mui/material';
import { CLICK_PREVIEW_IID } from '../../../constants/interfaceIds';

const ClickPreview = ({ 
  cobrowsing: {
    interfaceIdHovering
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
}) => {

  function renderActionTitle(text, icon) {
     return <>
      {icon && <Icon size="xs" icon={icon}></Icon>}
      <Typography variant="subtitle2" sx={{fontSize: '.8em'}}>
        {text}
      </Typography>
    </>
  }

  function renderLeftClickAction() {
    
    if(brushIdHovering) {
      return <>
        {/* <Icon size="xs" icon="faMap"></Icon> */}
        {renderActionTitle('Select Brush')}
      </>
    }

    if(brushIdSelectedBrushList && isMouseOverGameView) {
      return renderActionTitle('Paint with Brush')
    }
    

    if(entityModelIdHovering) {

    }

    if(entityModelIdHovering && !isMouseOverGameView) {
      return renderActionTitle('Select Entity')
    }

    if(entityInstanceIdHovering && isMouseOverGameView) {
      return renderActionTitle('Edit Behavior', 'faDna')
    }

    if(entityModelIdSelectedEntityList && isMouseOverGameView) {
      return renderActionTitle('Place Entity')
    }

    if(entityInstanceIdHovering) {
      return renderActionTitle('Select Entity')
    }


    if(isMouseOverGameView) {
      return renderActionTitle('Edit Stage', 'faMap')
    }

    if(interfaceIdHovering) {

      const interfaceData = interfaceIdData[interfaceIdHovering]
      if(interfaceData) {
        return renderActionTitle(interfaceData.leftClickAction)
      }
    }
  }

  function renderRightClickAction() {

    if(isMouseOverGameView || entityModelIdHovering) {
      return renderActionTitle('More')
    }
  }

  function renderDoubleClickAction() {

    if(entityModelIdHovering) {
      const entityModel = gameModel.entityModels[entityModelIdHovering]
      return renderActionTitle('Edit ' + entityModelTypeToDisplayName[entityModel.entityIID], 'faChessPawn')
    }

    if(isMouseOverGameView) {
      return renderActionTitle('Edit Game', 'faGamepad')
    }
  }

  function renderControl(text) {
    return <Typography sx={{fontSize: '.5em', color: '#aaa'}} variant="subtitle2" font="2P">
      {text}
    </Typography>
  }
 
  return <Unlockable interfaceId={CLICK_PREVIEW_IID}>
    <div className="ClickPreview">
      <div className="ClickPreview__row">
        <div className="ClickPreview__row-control">
          {renderControl('Left Click')}
        </div>
        <div className="ClickPreview__row-action">
          {renderLeftClickAction()}
        </div>
      </div>
      <div className="ClickPreview__row">
        <div className="ClickPreview__row-control">
          {renderControl('Double Click')}
        </div>
        <div className="ClickPreview__row-action">
          {renderDoubleClickAction()}
        </div>
      </div>
      <div className="ClickPreview__row">
        <div className="ClickPreview__row-control">
          {renderControl('Right Click')}
        </div>
        <div className="ClickPreview__row-action">
          {renderRightClickAction()}
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
})

export default connect(mapStateToProps, {})(ClickPreview);
