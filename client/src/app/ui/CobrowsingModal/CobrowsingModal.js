/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { Backdrop } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import './CobrowsingModal.scss';

const CobrowsingModal = ({ onClose, children, open }) => {
  return <Backdrop
    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={open}
  >
    <div className="CobrowsingModal__safe-area">
      {children}
      <div className="CobrowsingModal__close" onClick={onClose}>
        <CloseIcon/>
      </div>
    </div>
  </Backdrop>
};

export default CobrowsingModal
