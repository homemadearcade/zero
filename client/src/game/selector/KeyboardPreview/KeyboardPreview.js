import React, { useState } from 'react';
import { connect } from 'react-redux';
import './KeyboardPreview.scss'
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Typography from '../../../ui/Typography/Typography';
import Texture from '../../textures/Texture/Texture';
import { getLayerIdFromColorId, getLayerIdFromEraserId, getHexFromColorId, isBrushIdColor, isBrushIdEraser } from '../../../utils/editorUtils';
import { dataSourceIIDToIcon, effectInterfaceDatas, layerGroupIIDtoShortName, PAUSED_STATE } from '../../constants';
import Icon from '../../../ui/Icon/Icon';
import { interfaceIdData } from '../../../constants/interfaceIdData';
import { entityModelTypeToDisplayName } from '../../constants';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { KEYBOARD_PREVIEW_IID } from '../../../constants/interfaceIds';

const KeyboardPreview = ({ 
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

  function getEntityClassName() {
    const entityModelId = entityModelIdHovering || entityModelIdSelectedEntityList
    const entityModel = gameModel.entityModels[entityModelId]
    if(!entityModel) return
    return entityModelTypeToDisplayName[entityModel.entityIID]
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
    return <Typography sx={{fontSize: '.5em', color: '#aaa'}} variant="subtitle2" font="2P">
      {text}
    </Typography>
  }

  // function renderActions() {
  //   <Unlockable interfaceId={ENTITY_BOX_OPEN_IID}>
  //     <Button size="fit" startIcon={<Icon icon='faArrowPointer'/>} className="EntityList__more" onClick={() => {
  //       openEntityBoxDialog(PLACE_ENTITY_AID, entityModelType)
  //     }}>
  //       More
  //     </Button>
  //   </Unlockable>
  //   <Unlockable interfaceId={ENTITY_BOX_OPEN_IID}>
  //     <Button size="fit" startIcon={<Icon icon='faBoxArchive'/>} className="EntityList__more" onClick={() => {
  //       openEntityBoxDialog(IMPORT_DATA_SOURCE_AID, entityModelType)
  //     }}>
  //       Import
  //     </Button>
  //   </Unlockable>
  // }

  const keyActions = [1, 2, 3, 4, 5, 6, 7, 8, 9] 
 
  return <Unlockable interfaceId={KEYBOARD_PREVIEW_IID}>
    <div className="KeyboardPreview">
      <div className="KeyboardPreview__core">

      </div>
      <div className="KeyboardPreview__grid">
        {keyActions.map((keyActionId) => {
          return <div className="KeyboardPreview__node">
            <div className="KeyboardPreview__node-control">
              {renderControl(keyActionId)}
            </div>
            <div className="KeyboardPreview__node-action">
              {renderLeftClickAction()}
            </div>
          </div>
        })}
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

export default connect(mapStateToProps, {})(KeyboardPreview);
