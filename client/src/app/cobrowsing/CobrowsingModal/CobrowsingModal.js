/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import Button from '../../ui/Button/Button';
import { Backdrop } from '@mui/material';

import './CobrowsingModal.scss';
import Icon from '../../ui/Icon/Icon';
import { stopPropagation } from '../../../utils/browserUtils';

const CobrowsingModal = ({ onClose, children, open, zIndexIncrease = 1, width, height}) => {
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

export default CobrowsingModal
