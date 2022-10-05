/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import Button from '../../ui/Button/Button';
import { Backdrop } from '@mui/material';

import './CobrowsingModal.scss';
import Icon from '../../ui/Icon/Icon';
import { stopPropagation } from '../../../utils/browserUtils';
import { getCurrentGameScene } from '../../../utils/editorUtils';
import { compose } from 'redux';
import { connect } from 'react-redux';

const CobrowsingModal = ({ onClose, children, open, zIndexIncrease = 1, width, height, page: { gameInstance } }) => {
  useEffect(() => {
   getCurrentGameScene(gameInstance).input.keyboard.manager.enabled = false

    return () => {
      getCurrentGameScene(gameInstance).input.keyboard.manager.enabled = true
    }
  }, [])
  
  return <Backdrop
    sx={{ color: '#fff', zIndex: (theme) => {
      return theme.zIndex.drawer + zIndexIncrease
    }}}
    open={open}
    onClick={onClose}
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
  page: state.page
});

export default compose(
  connect(mapStateToProps, {}),
)(CobrowsingModal);
