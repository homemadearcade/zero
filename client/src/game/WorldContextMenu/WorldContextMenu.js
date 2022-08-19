import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

import { openLiveWorldEditor, openSectionEditor } from '../../store/actions/editorActions';
import Unlockable from '../../app/cobrowsing/Unlockable/Unlockable';

const WorldContextMenu = ({ openLiveWorldEditor, openSectionEditor, onMenuItemClick }) => {
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
  </>
};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, { openLiveWorldEditor, openSectionEditor })( WorldContextMenu );
