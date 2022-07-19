import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

import { openLivePhysicsEditor } from '../../store/actions/editorActions';
import { editGameModel } from '../../store/actions/gameActions';
import ClassContextMenu from '../ClassContextMenu/ClassContextMenu';

const ObjectInstanceContextMenu = ({ editGameModel, onMenuItemClick, editor: { editorState: { objectSelectedIdContextMenu } }}) => {
  return <>
    <MenuItem onClick={() => {
      editGameModel({ objects: { [objectSelectedIdContextMenu]: null } })
      onMenuItemClick()
    }}>Delete</MenuItem>
    <ClassContextMenu onMenuItemClick={onMenuItemClick}/>
  </>
};

const mapStateToProps = (state) => ({
  editor: state.editor,
});

export default connect(mapStateToProps, { openLivePhysicsEditor, editGameModel })(ObjectInstanceContextMenu);
