import React, { useState } from 'react';
import { connect } from 'react-redux';
import './ClickPreview.scss'
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Typography from '../../../ui/Typography/Typography';
import Icon from '../../../ui/Icon/Icon';
import { interfaceIdData } from '../../../constants/interfaceIdData';
import { entityModelClassToDisplayName } from '../../constants';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { CLICK_PREVIEW_IID } from '../../../constants/interfaceIds';

const ClickPreview = ({ 
  cobrowsing: {
    interfaceIdHovering
  },
  hoverPreview: { 
    brushIdHovering, 
    entityModelIdHovering,
    entityInstanceIdHovering,
    keyToolbarActionIdHovering,
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

  function getEntityClassName() {
    const entityModelId = entityModelIdHovering || entityModelIdSelectedEntityList
    const entityModel = gameModel.entityModels[entityModelId]
    if(!entityModel) return
    return entityModelClassToDisplayName[entityModel.entityIID]
  }

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
        {renderActionTitle('Select Brush', 'faPaintbrush')}
      </>
    }

    if(brushIdSelectedBrushList && isMouseOverGameView) {
      return renderActionTitle('Paint with Brush', 'faPaintbrush')
    }
    

    if(entityModelIdHovering) {

    }

    if(entityModelIdHovering && !isMouseOverGameView) {

      return renderActionTitle('Select ' + getEntityClassName(), 'faArrowPointer')
    }

    if(entityInstanceIdHovering && isMouseOverGameView) {
      return renderActionTitle('Edit Behavior', 'faDna')
    }

    if(entityModelIdSelectedEntityList && isMouseOverGameView) {
      return renderActionTitle('Place ' + getEntityClassName(), 'faArrowPointer')
    }

    if(entityInstanceIdHovering) {
      return renderActionTitle('Select ' + getEntityClassName(), 'faArrowPointer')
    }


    if(isMouseOverGameView) {
      return renderActionTitle('Edit Stage', 'faMap')
    }

    if(keyToolbarActionIdHovering) {
      const effect = gameModel.effects[keyToolbarActionIdHovering]
      return renderActionTitle('Do Action', effect.icon)
    }

    if(interfaceIdHovering) {

      const interfaceData = interfaceIdData[interfaceIdHovering]
      if(interfaceData) {
        return renderActionTitle(interfaceData.leftClickAction, interfaceData.leftClickIcon ? interfaceData.leftClickIcon : null)
      }
    }
  }

  function renderRightClickAction() {

    if(isMouseOverGameView || entityModelIdHovering) {
      return renderActionTitle('More', 'faEllipsis')
    }
  }

  function renderDoubleClickAction() {

    if(entityModelIdHovering) {
      return renderActionTitle('Edit ' + getEntityClassName(), 'faChessPawn')
    }

    if(isMouseOverGameView) {
      return renderActionTitle('Edit Game', 'faGamepad')
    }
  }

  function renderControl(text) {
    return <>
      <Icon size="xs" icon="faComputerMouse" color="#aaa"></Icon>
      <Typography sx={{fontSize: '.5em', color: '#aaa'}} variant="subtitle2" font="2P">
        {text}
      </Typography>
    </>
  }
 
  return <Unlockable interfaceId={CLICK_PREVIEW_IID}>
    <div className="ClickPreview">
      <div className="ClickPreview__row">
        <div className="ClickPreview__row-control">
          {renderControl('L')}
        </div>
        <div className="ClickPreview__row-action">
          {renderLeftClickAction()}
        </div>
      </div>
      <div className="ClickPreview__row">
        <div className="ClickPreview__row-control">
          {renderControl('x2')}
        </div>
        <div className="ClickPreview__row-action">
          {renderDoubleClickAction()}
        </div>
      </div>
      <div className="ClickPreview__row">
        <div className="ClickPreview__row-control">
          {renderControl('R')}
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
