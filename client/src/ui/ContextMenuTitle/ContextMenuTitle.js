import { Divider, MenuItem } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';

import './ContextMenuTitle.scss'

const ContextMenuTitle = ({ children, onClick }) => { 
  function div({children}) {
    return <div onClick={() => {
      onClick()
    }} className="ContextMenuTitle">{children}</div>
  }

  return <>
    <MenuItem component={div}>{children}</MenuItem>
    <Divider></Divider>
  </>
}

const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {  })(ContextMenuTitle);
