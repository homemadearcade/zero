/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import Button from '../../../ui/Button/Button';
import { Backdrop } from '@mui/material';

import './CobrowsingModal.scss';
import Icon from '../../../ui/Icon/Icon';
import { stopPropagation } from '../../../utils/webPageUtils';
import { getCurrentGameScene } from '../../../utils/editorUtils';
import { compose } from 'redux';
import { connect } from 'react-redux';

const CobrowsingModal = ({ onClose, children, open, zIndexIncrease = 1, width, height, webPage: { gameInstance } }) => {
  useEffect(() => {
    const scene = getCurrentGameScene(gameInstance)
    
    if(scene) {
      console.log('disable key capture')
      if(scene.input.keyboard.manager.enabled) {
        scene.input.keyboard.manager.enabled = false
        return () => {
          console.log('enable key capture')
          getCurrentGameScene(gameInstance).input.keyboard.manager.enabled = true
        }
      }
    }

  }, [])
  
  return <Backdrop
    sx={{ color: '#fff', zIndex: (theme) => {
      return theme.zIndex.drawer + zIndexIncrease
    }}}
    open={open}
    onClick={false && onClose}
  >
    <div className="CobrowsingModal__safe-area">
      <div className="CobrowsingModal__body" style={{width: width, height: height}} onClick={stopPropagation}>
        {children}
        <div className="CobrowsingModal__close" onClick={onClose}>
          <Button><Icon icon="faClose"/></Button>
        </div>
      </div>
    </div>
  </Backdrop>
};

const mapStateToProps = (state) => ({
  webPage: state.webPage
});

export default compose(
  connect(mapStateToProps, {}),
)(CobrowsingModal);
