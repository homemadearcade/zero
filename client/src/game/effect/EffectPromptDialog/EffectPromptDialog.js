

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './EffectPromptDialog.scss';
import { closeEffectPromptDialog } from '../../../store/actions/game/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Typography from '../../../ui/Typography/Typography';
import { Fade } from '@mui/material';
import { getCurrentGameScene } from '../../../utils';
import store from '../../../store';
import { interfaceActionsUIData } from '../../../constants';
import Icon from '../../../ui/Icon/Icon';
import { EFFECT_INTERFACE_ACTION, EFFECT_INTERFACE_UNLOCK, RUN_GAME_INSTANCE_ACTION } from '../../constants';
import { unlockInterfaceId } from '../../../store/actions/game/unlockableInterfaceActions';
import SelectGameInstanceEffect from '../../ui/SelectGameInstanceEffect/SelectGameInstanceEffect';

const EffectPromptDialog = ({ 
  closeEffectPromptDialog, 
  webPage: { gameInstance },
  gameModel: { gameModel },
}) => {
  function handleClose() {
    closeEffectPromptDialog()
  }

  useEffect(() => {
    const keyStop = setInterval(() => {
      const scene = getCurrentGameScene(gameInstance)
      if(scene) {
        scene.input.keyboard.disableGlobalCapture()
      }
    }, 1000)

    const keyDownHandler = (e) => {
      if(e.key === "Escape") {
        handleClose()
      }
    }
    window.addEventListener('keydown', keyDownHandler)

    return () => {
      clearInterval(keyStop)
      window.removeEventListener('keydown', keyDownHandler)
      getCurrentGameScene(store.getState().webPage.gameInstance)?.input?.keyboard.enableGlobalCapture();
    }
  }, [])

  useEffect(() => {
    const focusInterval = setInterval(() => {
    const el = document.getElementById("SelectGameInstanceEffect")
    // console.log(el)
    if(el) {
      el.focus();
    }
      clearInterval(focusInterval)
    }, 100)

    return () => {
      clearInterval(focusInterval)
    }
  }, [])

  const [value, setValue] = useState([])

  return<Fade in>
    <div className="EffectPromptDialog">
      <div className="EffectPromptDialog__body">
        <Typography variant="h5" font="2P">
          What would you like to do?
        </Typography>
        <div className="EffectPromptDialog__actions">
        {Object.keys(interfaceActionsUIData).map((key) => {
          const { displayName, icon, description } = interfaceActionsUIData[key]
          return <div className="EffectPromptDialog__action" key={key}>
              <div className="EffectPromptDialog__action-icon">
                <Icon icon={icon}/>
              </div>
              <div className="EffectPromptDialog__action-displayName">
                {displayName}
              </div>
              <div className="EffectPromptDialog__action-description">
                {description}
              </div>
            </div>
          }
        )}
        <div className="EffectPromptDialog__action" key={'unlock'}>
          <div className="EffectPromptDialog__action-icon">
            <Icon icon={'faLockOpen'}/>
          </div>
          <div className="EffectPromptDialog__action-displayName">
            Unlock
          </div>
          <div className="EffectPromptDialog__action-description">
            Unlock a section, button for the current user
          </div>
        </div>
        </div>
        <SelectGameInstanceEffect
          value={value}
          onChange={(event, effectIds) => {
            setValue(effectIds)
            handleClose()
            const effectId = effectIds[effectIds.length-1]
            const effect = gameModel.effects[effectId]
            if(effect.effectBehavior === EFFECT_INTERFACE_ACTION) {
               effect.onClick(store.dispatch, gameModel, store.getState)
            } else if(effect.effectBehavior === EFFECT_INTERFACE_UNLOCK) {
              store.dispatch(unlockInterfaceId(effect.interfaceId))
            } else {
              const gameInstance = getCurrentGameScene(store.getState().webPage.gameInstance)
              gameInstance.callGameInstanceEvent({gameRoomInstanceEventType: RUN_GAME_INSTANCE_ACTION, data: { effectId } , hostOnly: true })
            }
            // updateCreateRelation({
            //   effectIds: effectIds,
            // })
          }}/> 
        {/* <Button variant="contained" onClick={handleClose} disabled={!value.length}>
          Go
        </Button> */}
      </div>
  </div>
  </Fade>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  webPage: state.webPage,
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { closeEffectPromptDialog,  }),
)(EffectPromptDialog);
