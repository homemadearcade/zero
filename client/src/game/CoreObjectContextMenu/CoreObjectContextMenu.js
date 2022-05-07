import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

const CoreObjectContextMenu = ({ onMenuItemClick, interface: { interfaceState: { contextMenuObjectSelected } }}) => {
  
  return <div>
    <MenuItem onClick={() => {
      onMenuItemClick()
    }}>Edit Physics</MenuItem>
  </div>
};

const mapStateToProps = (state) => ({
  interface: state.interface
});

export default connect(mapStateToProps, { })(CoreObjectContextMenu);
