/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Button from '../../../ui/Button/Button';
import { Backdrop } from '@mui/material';

import './CobrowsingDialog.scss';
import Icon from '../../../ui/Icon/Icon';
import { stopPropagation } from '../../../utils/webPageUtils';
import { getCurrentGameScene } from '../../../utils/editorUtils';
import { compose } from 'redux';
import { connect } from 'react-redux';
import store from '../../../store';
import useGameEditorSize from '../../../hooks/useGameEditorSize';
import { createPortal } from 'react-dom';
import { setIsDialogOverGameView } from '../../../store/actions/game/gameViewEditorActions';

const CobrowsingDialog = ({ 
  widthModifier, onClose, children, 
  setIsDialogOverGameView,
  open, zIndexIncrease = 1, width, height, 
  webPage: { gameInstance },
  gameViewEditor: {
    isSnapshotTakerOpen
  }
}) => {
  useEffect(() => {
    setIsDialogOverGameView(true)

    const keyStop = setInterval(() => {
      const scene = getCurrentGameScene(gameInstance)
      if(scene) {
        scene.input.keyboard.disableGlobalCapture()
      }
    }, 1000)

    return () => {
      clearInterval(keyStop)
      setIsDialogOverGameView(false)
      getCurrentGameScene(store.getState().webPage.gameInstance)?.input?.keyboard.enableGlobalCapture();
    }
  }, [])
  

  function isOpen() {
    if(isSnapshotTakerOpen) {
      return false
    }

    return open
  }

  const { gameEditorHeight, gameEditorWidth } = useGameEditorSize()
  if(gameEditorHeight) {
    //z-index
    return createPortal(<Backdrop
      sx={{ color: '#fff', zIndex: 1000 + zIndexIncrease}}
      open={isOpen()}
    >
      <div className="CobrowsingDialog__safe-area" style={{width: gameEditorHeight * (widthModifier ? widthModifier : .7) }}>
        <div className="CobrowsingDialog__body" style={{width: width, height: height}} onClick={stopPropagation}>
          {children}
          {onClose && <div className="CobrowsingDialog__close" onClick={onClose}>
            <Button><Icon icon="faClose"/></Button>
          </div>}
        </div>
      </div>
    </Backdrop>, document.getElementById('CobrowsingDialog'))
  }
};

const mapStateToProps = (state) => ({
  webPage: state.webPage,
  gameViewEditor: state.gameViewEditor,
});

export default compose(
  connect(mapStateToProps, { setIsDialogOverGameView }),
)(CobrowsingDialog);
