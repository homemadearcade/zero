import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

import { openLiveEditor } from '../../store/actions/editorActions';
import { editGameModel } from '../../store/actions/gameActions';
import ClassContextMenu from '../ClassContextMenu/ClassContextMenu';

const CoreObjectContextMenu = ({ editGameModel, onMenuItemClick, editor: { editorState: { objectSelectedIdContextMenu } }}) => {
  return <>
    <MenuItem onClick={() => {
      editGameModel({ objects: { [objectSelectedIdContextMenu]: null } })
      onMenuItemClick()
    }}>Delete</MenuItem>
    <ClassContextMenu/>
  </>
};

const mapStateToProps = (state) => ({
  editor: state.editor,
});

export default connect(mapStateToProps, { openLiveEditor, editGameModel })(CoreObjectContextMenu);
