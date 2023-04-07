

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './EffectPromptDialog.scss';
import { closeEffectPromptDialog } from '../../../store/actions/game/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Typography from '../../../ui/Typography/Typography';
import Button from '../../../ui/Button/Button';
import SelectInterfaceAction from '../../ui/SelectInterfaceAction/SelectInterfaceAction';
import { Fade } from '@mui/material';
import { getCurrentGameScene } from '../../../utils';
import store from '../../../store';

const EffectPromptDialog = ({ 
  closeEffectPromptDialog, 
  webPage: { gameInstance }
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

    return () => {
      clearInterval(keyStop)
      getCurrentGameScene(store.getState().webPage.gameInstance)?.input?.keyboard.enableGlobalCapture();
    }
  }, [])

  useEffect(() => {
    const focusInterval = setInterval(() => {
    const el = document.getElementById("SelectInterfaceAction")
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
        <SelectInterfaceAction
          value={value}
          onChange={(event, effectIds) => {
            setValue(effectIds)
            handleClose()
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
  webPage: state.webPage
})

export default compose(
  connect(mapStateToProps, { closeEffectPromptDialog,  }),
)(EffectPromptDialog);
