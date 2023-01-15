import { Divider, MenuItem } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';

import './ContextMenuTitle.scss'

const ContextMenuTitle = ({ children, onClick }) => { 

  return <>
    <MenuItem><div onClick={() => {
      onClick()
    }} className="ContextMenuTitle">{children}</div></MenuItem>
    <Divider></Divider>
  </>
}

const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {  })(ContextMenuTitle);
