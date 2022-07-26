import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

import { openLivePhysicsEditor } from '../../store/actions/editorActions';
import { editGameModel } from '../../store/actions/gameActions';
import ClassContextMenu from '../ClassContextMenu/ClassContextMenu';

const ObjectInstanceContextMenu = ({ editGameModel, onMenuItemClick, objectId }) => {
  return <>
    <MenuItem onClick={() => {
      editGameModel({ objects: { [objectId]: null } })
      onMenuItemClick()
    }}>Delete</MenuItem>
    <ClassContextMenu onMenuItemClick={onMenuItemClick}/>
  </>
};

const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps, { openLivePhysicsEditor, editGameModel })(ObjectInstanceContextMenu);
