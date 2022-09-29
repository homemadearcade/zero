import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

import { openLiveWorldEditor, openSectionEditor, openSelectBackgroundColor } from '../../store/actions/editorActions';
import Unlockable from '../../app/cobrowsing/Unlockable/Unlockable';

const WorldContextMenu = ({ openLiveWorldEditor, openSectionEditor, onMenuItemClick, openSelectBackgroundColor }) => {
  return <>
    <Unlockable interfaceId="contextMenu/world/gravity">
      <MenuItem onClick={() => {
        openLiveWorldEditor()
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

export default connect(mapStateToProps, { openLiveWorldEditor, openSectionEditor, openSelectBackgroundColor })( WorldContextMenu );
