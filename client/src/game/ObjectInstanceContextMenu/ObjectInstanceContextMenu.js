import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

import { openLivePhysicsEditor } from '../../store/actions/editorActions';
import { editGameModel } from '../../store/actions/gameActions';
import ClassContextMenu from '../ClassContextMenu/ClassContextMenu';
import { mapCobrowsingState } from '../../utils/cobrowsing';

const ObjectInstanceContextMenu = ({ editGameModel, onMenuItemClick, editor: { objectIdSelectedContextMenu }}) => {
  return <>
    <MenuItem onClick={() => {
      editGameModel({ objects: { [objectIdSelectedContextMenu]: null } })
      onMenuItemClick()
    }}>Delete</MenuItem>
    <ClassContextMenu onMenuItemClick={onMenuItemClick}/>
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  editor: state.editor,
})

export default connect(mapStateToProps, { openLivePhysicsEditor, editGameModel })(ObjectInstanceContextMenu);
