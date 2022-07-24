import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

import { openLivePhysicsEditor } from '../../store/actions/editorActions';
import { mapCobrowsingState } from '../../utils/cobrowsing';

const ClassContextMenu = ({ openLivePhysicsEditor, onMenuItemClick,  editor: { classSelectedIdContextMenu }}) => {
  return <>
    <MenuItem onClick={() => {
      openLivePhysicsEditor(classSelectedIdContextMenu)
      onMenuItemClick()
    }}>Edit Physics</MenuItem>
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  editor: state.editor,
})

export default connect(mapStateToProps, {openLivePhysicsEditor })(ClassContextMenu);
