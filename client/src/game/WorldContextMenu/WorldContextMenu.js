import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

import { openLiveEditor, openSectionEditor, openSelectBackgroundColor } from '../../store/actions/editorActions';
import Unlockable from '../../app/cobrowsing/Unlockable/Unlockable';
import { WORLD_EDITOR } from '../../constants';

const WorldContextMenu = ({ openLiveEditor, openSectionEditor, onMenuItemClick, openSelectBackgroundColor }) => {
  return <>
    <Unlockable interfaceId="contextMenu/world/gravity">
      <MenuItem onClick={() => {
        openLiveEditor(WORLD_EDITOR)
        onMenuItemClick()
      }}>Edit Gravity</MenuItem>
    </Unlockable>
    <Unlockable interfaceId="contextMenu/world/sections">
      <MenuItem onClick={() => {
        openSectionEditor()
        onMenuItemClick()
      }}>Edit Sections</MenuItem>
    </Unlockable>
    <Unlockable interfaceId="contextMenu/world/backgroundColor">
      <MenuItem onClick={() => {
        openSelectBackgroundColor()
        onMenuItemClick()
      }}>Edit Background Color</MenuItem>
    </Unlockable>
  </>
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, { openLiveEditor, openSectionEditor, openSelectBackgroundColor })( WorldContextMenu );
