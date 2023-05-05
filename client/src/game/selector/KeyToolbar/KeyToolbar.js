import React, { useState } from 'react';
import { connect } from 'react-redux';
import './KeyToolbar.scss'
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Typography from '../../../ui/Typography/Typography';
import Icon from '../../../ui/Icon/Icon';
import { interfaceIdData } from '../../../constants/interfaceIdData';
import { EFFECT_INTERFACE_ACTION, EFFECT_INTERFACE_UNLOCK, entityModelClassToDisplayName, ON_STEP_BEGINS, RUN_GAME_INSTANCE_ACTION } from '../../constants';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { KEY_TOOLBAR_ACTIONS_IID } from '../../../constants/interfaceIds';
import { TOOLBAR_MORE_IID } from '../../../constants/interfaceIds/keyToolbarInterfaceIds';
import Button from '../../../ui/Button/Button';
import { EIGHT_KID, FIVE_KID, FOUR_KID, keyIdToInterfaceData, NINE_KID, ONE_KID, SEVEN_KID, SIX_KID, THREE_KID, TWO_KID } from '../../../constants/keyboard/keyIds';
import classNames from 'classnames';
import store from '../../../store';
import { unlockInterfaceId } from '../../../store/actions/game/unlockedInterfaceActions';
import { getCurrentGameScene, getEffectData } from '../../../utils';
import { changeKeyToolbarActionIdHovering } from '../../../store/actions/game/hoverPreviewActions';
import { useWishTheme } from '../../../hooks/useWishTheme';
import IconButton from '../../../ui/IconButton/IconButton';
import { interfaceActionIdData } from '../../../constants/interfaceActionIdData';
import { openToolBoxDialog } from '../../../store/actions/game/gameSelectorActions';

const KeyToolbar = ({ 
  cobrowsing: {
    isActivelyCobrowsing,
    isSubscribedCobrowsing,
  },
  gameModel: { 
    currentStageId,
    gameModel,
  },
  changeKeyToolbarActionIdHovering,
  unlockInterfaceId,
  keyToolbar,
  openToolBoxDialog
}) => {
  const theme = useWishTheme()

  const keyIdsToKeyActions = {
    ...gameModel.keyToolbar,
    ...keyToolbar
  }

  function renderControl(text) {
    return <Typography sx={{fontSize: '.5em', color: '#aaa'}} variant="subtitle2" font="2P">
      {text}
    </Typography>
  }

  function renderMore() {
    return <Unlockable interfaceId={TOOLBAR_MORE_IID}>
      <div className='KeyToolbar__more'>
        <Button size="fit" startIcon={<Icon icon='faToolbox'/>} className="Toolbox__more" onClick={() => {
          // openEntityBoxDialog(PLACE_ENTITY_AID, entityModelClass)
          openToolBoxDialog()
        }}>
          More
        </Button>
      </div>
    </Unlockable>
  }

  function renderNumberKey(keyId) {
    const controlName = keyIdToInterfaceData[keyId].name
    const keyActionData = keyIdsToKeyActions[keyId]
    const effectId = keyActionData?.effectId
    const effect = gameModel.effects[effectId]

    let isActive;

    if(effect?.isActive) {
      isActive = effect.isActive(store.getState())
    }

    let disabled = false 
    let hidden = false

    if(effect?.interfaceActionId) {
      const interfaceActionData = interfaceActionIdData[effect.interfaceActionId]
      if(interfaceActionData?.activeCobrowsingRequired) {
        hidden = !isSubscribedCobrowsing
        disabled = hidden || !isActivelyCobrowsing
      }
    }

    if(!effect) {
      disabled = true
      hidden = true
    }

    let icon, subIcon 

    if(effect) {
      const effectData = getEffectData(effect, ON_STEP_BEGINS, gameModel)
      icon = effectData?.icon
    }

    return <div key={effectId + keyId} onClick={() => {
      if(disabled) return

      if(effect.effectBehavior === EFFECT_INTERFACE_ACTION) {
        effect.onClick(store.dispatch, gameModel, store.getState)
      } else if(effect.effectBehavior === EFFECT_INTERFACE_UNLOCK) {
        store.dispatch(unlockInterfaceId(effect.interfaceId))
      } else {
        const gameInstance = getCurrentGameScene(store.getState().webPage.gameInstance)
        gameInstance.callGameInstanceEvent({gameRoomInstanceEventType: RUN_GAME_INSTANCE_ACTION, data: { effectId } , hostOnly: true })
      }
    }} 
      className={classNames("KeyToolbar__node", {
        "KeyToolbar__node--clickable": !disabled,
      })} 
      style={{
        backgroundColor: isActive && theme.primaryColor.hexString
      }}
      onMouseEnter={() => {
        if(disabled) return
        changeKeyToolbarActionIdHovering(effectId)
      }}
      onMouseLeave={() => {
        if(disabled) return
        changeKeyToolbarActionIdHovering(null)
      }}
    >
      <div className="KeyToolbar__node-control">
        {renderControl(controlName)}
      </div>
      <div className="KeyToolbar__node-action">
        {/* {renderLeftClickAction()} */}
        {!hidden && <IconButton 
          disabled={disabled}
          size="small" icon={icon}
        ></IconButton>}
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

export default connect(mapStateToProps, {
  changeKeyToolbarActionIdHovering,
  unlockInterfaceId,
  openToolBoxDialog
})(KeyToolbar);
