/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import Button from '../../ui/Button/Button';
import { Backdrop } from '@mui/material';

import './CobrowsingModal.scss';
import { stopPropagation } from '../../../utils/utils';

const CobrowsingModal = ({ onClose, children, open }) => {
  return <Backdrop
    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={open}
    onClick={onClose}
  >
    <div className="CobrowsingModal__safe-area">
      <div className="CobrowsingModal__body" onClick={stopPropagation}>
        <div className="CobrowsingModal__close" onClick={onClose}>
          <Button><i className="fas fa-close"/></Button>
        </div>
        {children}
      </div>
    </div>
  </Backdrop>
};

export default CobrowsingModal
