import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

import { openLiveWorldEditor } from '../../store/actions/editorActions';
import Unlockable from '../../app/cobrowsing/Unlockable/Unlockable';

const WorldContextMenu = ({ openLiveWorldEditor, onMenuItemClick }) => {
  return <>
    <Unlockable interfaceId="contextMenu/world/gravity">
      <MenuItem onClick={() => {
        openLiveWorldEditor()
        onMenuItemClick()
      }}>Edit Gravity</MenuItem>
    </Unlockable>
  </>
};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, { openLiveWorldEditor })( WorldContextMenu );
