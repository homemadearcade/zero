import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

const CoreObjectContextMenu = ({ onMenuItemClick, editor: { editorState: { objectSelectedI } }}) => {
  
  return <div>
    <MenuItem onClick={() => {

      onMenuItemClick()
    }}>Edit Physics</MenuItem>
  </div>
};

const mapStateToProps = (state) => ({
  editor: state.editor
});

export default connect(mapStateToProps, { })(CoreObjectContextMenu);
