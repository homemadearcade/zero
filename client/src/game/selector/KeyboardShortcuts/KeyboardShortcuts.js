import React, { useState } from 'react';
import { connect } from 'react-redux';
import './KeyboardShortcuts.scss'
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Typography from '../../../ui/Typography/Typography';
import Icon from '../../../ui/Icon/Icon';
import { interfaceIdData } from '../../../constants/interfaceIdData';
import { EFFECT_INTERFACE_ACTION, EFFECT_INTERFACE_UNLOCK, entityModelClassToDisplayName, ON_STEP_BEGINS, RUN_GAME_INSTANCE_ACTION } from '../../constants';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { KEYBOARD_ACTIONS_IID } from '../../../constants/interfaceIds';
import { TOOLBAR_MORE_IID } from '../../../constants/interfaceIds/keyboard';
import Button from '../../../ui/Button/Button';
import { EIGHT_KID, FIVE_KID, FOUR_KID, keyIdToInterfaceData, NINE_KID, ONE_KID, SEVEN_KID, SIX_KID, THREE_KID, TWO_KID } from '../../../constants/keyboard/keyIds';
import classNames from 'classnames';
import store from '../../../store';
import { unlockInterfaceId } from '../../../store/actions/game/unlockedInterfaceActions';
import { getCurrentGameScene, getEffectData, runEffect } from '../../../utils';
import { changeKeyboardShortcutActionIdHovering } from '../../../store/actions/game/hoverPreviewActions';
import { useWishTheme } from '../../../hooks/useWishTheme';
import IconButton from '../../../ui/IconButton/IconButton';
import { interfaceActionIdData } from '../../../constants/interfaceActionIdData';
import { openToolBoxDialog } from '../../../store/actions/game/gameSelectorActions';
import { useKeyPress } from '../../../hooks/useKeyPress';
import Texture from '../../textures/Texture/Texture';

const KeyboardShortcuts = ({ 
  cobrowsing: {
    isActivelyCobrowsing,
    isSubscribedCobrowsing,
  },
  gameModel: { 
    currentStageId,
    gameModel,
  },
  gameViewEditor: {
    isDialogOverGameView
  },
  changeKeyboardShortcutActionIdHovering,
  unlockInterfaceId,
  keyToolbar,
  openToolBoxDialog
}) => {
  const theme = useWishTheme()

  const keyIdsToKeyActions = {
    ...gameModel.stages[currentStageId].keyboardShortcuts,
    ...keyToolbar
  }

  const onKeyPress = (keyId) => () => {
    if(isDialogOverGameView) {
      return
    }
    const action = keyIdsToKeyActions[keyId]
    const effect = gameModel.effects[action.effectId]
    runEffect(effect)
  }

  const isOnePressed = useKeyPress('1', onKeyPress(ONE_KID), [keyIdsToKeyActions, isDialogOverGameView])
  const isTwoPressed = useKeyPress('2', onKeyPress(TWO_KID), [keyIdsToKeyActions, isDialogOverGameView])
  const isThreePressed = useKeyPress('3', onKeyPress(THREE_KID), [keyIdsToKeyActions, isDialogOverGameView])
  const isFourPressed = useKeyPress('4', onKeyPress(FOUR_KID), [keyIdsToKeyActions, isDialogOverGameView])
  const isFivePressed = useKeyPress('5', onKeyPress(FIVE_KID), [keyIdsToKeyActions, isDialogOverGameView])
  const isSixPressed = useKeyPress('6', onKeyPress(SIX_KID), [keyIdsToKeyActions, isDialogOverGameView])
  const isSevenPressed = useKeyPress('7', onKeyPress(SEVEN_KID), [keyIdsToKeyActions, isDialogOverGameView])
  const isEightPressed = useKeyPress('8', onKeyPress(EIGHT_KID), [keyIdsToKeyActions, isDialogOverGameView])
  const isNinePressed = useKeyPress('9', onKeyPress(NINE_KID), [keyIdsToKeyActions, isDialogOverGameView])

  const keyIdToIsPressed = {
    [ONE_KID]: isOnePressed,
    [TWO_KID]: isTwoPressed,
    [THREE_KID]: isThreePressed,
    [FOUR_KID]: isFourPressed,
    [FIVE_KID]: isFivePressed,
    [SIX_KID]: isSixPressed,
    [SEVEN_KID]: isSevenPressed,
    [EIGHT_KID]: isEightPressed,
    [NINE_KID]: isNinePressed,
  }

  function renderControl(text) {
    return <Typography sx={{fontSize: '.5em', color: '#aaa'}} variant="subtitle2" font="2P">
      {text}
    </Typography>
  }

  function renderMore() {
    return <Unlockable interfaceId={TOOLBAR_MORE_IID}>
      <div className='KeyboardShortcuts__more'>
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

    let icon, subIcon, textureId, textureTint

    if(effect) {
      const effectData = getEffectData(effect, ON_STEP_BEGINS, gameModel)
      icon = effectData?.icon
      subIcon = effectData?.subIcon
      textureId = effectData?.textureId
      textureTint = effectData?.textureTint
    }

    return <Unlockable passThrough key={effectId + keyId} interfaceId={keyId}>
      <div onClick={() => {
      if(disabled) return

      runEffect(effect)
    }} 
      className={classNames("KeyboardShortcuts__node", {
        "KeyboardShortcuts__node--clickable": !disabled,
      })}
      style={{
        backgroundColor: isActive && theme.primaryColor.hexString
      }}
      onMouseEnter={() => {
        if(disabled) return
        changeKeyboardShortcutActionIdHovering(effectId)
      }}
      onMouseLeave={() => {
        if(disabled) return
        changeKeyboardShortcutActionIdHovering(null)
      }}
    >
      <div className="KeyboardShortcuts__node-control" style={{
        backgroundColor: keyIdToIsPressed[keyId] && theme.primaryColor.hexString,
        color: keyIdToIsPressed[keyId] && 'white',
      }}>
        {renderControl(controlName)}
      </div>
      <div className="KeyboardShortcuts__node-action">
        {/* {renderLeftClickAction()} */}
        {!hidden && <>
          <IconButton 
            disabled={disabled}
            sx={{
              fontSize: '1.2em'
            }}
            size="small" icon={icon}
          ></IconButton>
          {subIcon && <Icon icon={subIcon} />}
          {(textureId || textureTint) && <div className="KeyboardShortcuts__node-sprite">
            <Texture textureId={textureId} textureTint={textureTint} />
           </div>}
        </>}
      </div>
    </div>
    </Unlockable>
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
 
  return <Unlockable interfaceId={KEYBOARD_ACTIONS_IID}>
    <div className="KeyboardShortcuts">
      <div className="KeyboardShortcuts__grid">
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
  gameViewEditor: state.gameViewEditor,
  keyToolbar: state.keyToolbar,
})

export default connect(mapStateToProps, {
  changeKeyboardShortcutActionIdHovering,
  unlockInterfaceId,
  openToolBoxDialog
})(KeyboardShortcuts);
