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

const CobrowsingDialog = ({ widthModifier, onClose, children, open, zIndexIncrease = 1, width, height, webPage: { gameInstance } }) => {
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

  const { gameEditorHeight, gameEditorWidth } = useGameEditorSize()
  if(gameEditorHeight) {
    //z-index
    return createPortal(<Backdrop
      sx={{ color: '#fff', zIndex: 1000 + zIndexIncrease}}
      open={open}
    >
      <div className="CobrowsingDialog__safe-area" style={{width: gameEditorHeight * (widthModifier ? widthModifier : .7) }}>
        <div className="CobrowsingDialog__body" style={{width: width, height: height}} onClick={stopPropagation}>
          {children}
          <div className="CobrowsingDialog__close" onClick={onClose}>
            <Button><Icon icon="faClose"/></Button>
          </div>
        </div>
      </div>
    </Backdrop>, document.getElementById('CobrowsingDialog'))
  }
};

const mapStateToProps = (state) => ({
  webPage: state.webPage
});

export default compose(
  connect(mapStateToProps, {}),
)(CobrowsingDialog);
