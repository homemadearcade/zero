import React, { useState } from 'react';
import { connect } from 'react-redux';
import './KeyToolbar.scss'
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Typography from '../../../ui/Typography/Typography';
import Icon from '../../../ui/Icon/Icon';
import { interfaceIdData } from '../../../constants/interfaceIdData';
import { entityModelClassToDisplayName } from '../../constants';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { KEY_TOOLBAR_ACTIONS_IID } from '../../../constants/interfaceIds';
import { TOOLBAR_MORE_IID } from '../../../constants/interfaceIds/keyToolbarInterfaceIds';
import Button from '../../../ui/Button/Button';
import { EIGHT_KID, FIVE_KID, FOUR_KID, keyIdToKeyName, NINE_KID, ONE_KID, SEVEN_KID, SIX_KID, THREE_KID, TWO_KID } from '../../../constants/keyboard/keyIds';
import { interfaceActionIdData } from '../../../constants/interfaceActionIdData';
import { interfaceActionGroupData } from '../../../constants';
import classNames from 'classnames';
import store from '../../../store';

const KeyToolbar = ({ 
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
  keyToolbar
}) => {

  const keyIdsToKeyActions = {
    ...gameModel.keyToolbar,
    ...keyToolbar
  }

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

  function renderCoreKey(text) {
    return <>
      <Typography sx={{fontSize: '.5em', color: '#aaa'}} variant="subtitle2" font="2P">
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

  function renderMore() {
    return <Unlockable interfaceId={TOOLBAR_MORE_IID}>
      <Button size="fit" startIcon={<Icon icon='faToolbox'/>} className="Toolbox__more" onClick={() => {
        // openEntityBoxDialog(PLACE_ENTITY_AID, entityModelClass)
      }}>
        More
      </Button>
    </Unlockable>
  }

  function renderNumberKey(keyId) {
    const controlName = keyIdToKeyName[keyId]
    const interfaceActionId = keyIdsToKeyActions[keyId]?.interfaceActionId
    const interfaceAction = interfaceActionIdData[interfaceActionId]
    const keyActionGroup = interfaceActionGroupData[interfaceAction?.interfaceActionGroupId]

    return <div key={interfaceActionId + keyId} onClick={() => {
      console.log('click', interfaceActionId, interfaceAction, interfaceAction?.onClick)
      if(interfaceActionId) {
        interfaceAction.onClick()(store.dispatch, gameModel)
      }
    }} className={classNames("KeyToolbar__node")}>
      <div className="KeyToolbar__node-control">
        {renderControl(controlName)}
      </div>
      <div className="KeyToolbar__node-action">
        {/* {renderLeftClickAction()} */}
        {keyActionGroup && <Icon icon={keyActionGroup.icon}></Icon>}
      </div>
    </div>
  }

  // function renderActions() {

  //   <Unlockable interfaceId={ENTITY_BOX_OPEN_IID}>
  //     <Button size="fit" startIcon={<Icon icon='faBoxArchive'/>} className="EntityList__more" onClick={() => {
  //       openEntityBoxDialog(IMPORT_DATA_SOURCE_AID, entityModelClass)
  //     }}>
  //       Import
  //     </Button>
  //   </Unlockable>
  // }

  
  const keyActions = [
    ONE_KID,
    TWO_KID,
    THREE_KID,
    FOUR_KID,
    FIVE_KID,
    SIX_KID,
    SEVEN_KID,
    EIGHT_KID,
    NINE_KID
  ]
 
  return <Unlockable interfaceId={KEY_TOOLBAR_ACTIONS_IID}>
    <div className="KeyToolbar">
      <div className="KeyToolbar__header">
        <Icon icon="faKeyboard" color="#aaa" size="xs"/>
      </div>
      <div className="KeyToolbar__core-row">
        <div className="KeyToolbar__core-key">
          {renderCoreKey('ESC')}
        </div>
        <div className="KeyToolbar__core-action">

        </div>
      </div>
      <div className="KeyToolbar__core-row">
        <div className="KeyToolbar__core-key">
          {renderCoreKey('SHIFT')}
        </div>
        <div className="KeyToolbar__core-action">
          
        </div>
      </div>
      <div className="KeyToolbar__core-row">
        <div className="KeyToolbar__core-key">
          {renderCoreKey('X')}
        </div>
        <div className="KeyToolbar__core-action">
          
        </div>
      </div>
      <div className="KeyToolbar__grid">
        {keyActions.map(renderNumberKey)}
      </div>
      {renderMore()}
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

export default connect(mapStateToProps, {})(KeyToolbar);
