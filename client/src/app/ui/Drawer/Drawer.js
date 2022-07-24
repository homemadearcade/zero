import React from 'react';
import Drawer from '@mui/material/Drawer';

// eslint-disable-next-line import/no-anonymous-default-export
export default function ({anchor, isOpen, onClose, children}) {
  return (
    <Drawer
      anchor={anchor}
      open={isOpen}
      onClose={onClose}
    >
      {children}
    </Drawer>
  );
}
