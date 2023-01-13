import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import { openGameMetadataModal, openLiveEditor, openSelectBackgroundColor } from '../../../store/actions/gameEditorActions';
import { toggleGridView, openSectionEditor, openSnapshotTaker } from '../../../store/actions/gameViewEditorActions';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { WORLD_EDITOR } from '../../constants';
import { generateUniqueId } from '../../../utils/webPageUtils';
import { openCutscenesMenu } from '../../../store/actions/gameFormEditorActions';
import { Divider } from '@mui/material';
import ContextMenuTitle from '../../../ui/ContextMenuTitle/ContextMenuTitle';

const WorldContextMenu = ({ 
  openLiveEditor,
  openSectionEditor, 
  onMenuItemClick, 
  openSelectBackgroundColor,
  openGameMetadataModal, 
  openSnapshotTaker, 
  openCutscenesMenu, 
  toggleGridView, 
  gameModel: { gameModel }, 
  gameViewEditor: { isGridViewOn }
}) => {

  return <>
    <ContextMenuTitle onClick={() => {
        openGameMetadataModal()
        onMenuItemClick()
    }}>{gameModel.metadata.title}</ContextMenuTitle>
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
      }}>Edit Boundaries</MenuItem>
    </Unlockable>
    <Unlockable interfaceId="contextMenu/world/backgroundColor">
      <MenuItem onClick={() => {
        openSelectBackgroundColor()
        onMenuItemClick()
      }}>Edit Background Color</MenuItem>
    </Unlockable>
    <Unlockable interfaceId="contextMenu/metadata">
      <MenuItem onClick={() => {
        openGameMetadataModal()
        onMenuItemClick()
      }}>Edit Metadata</MenuItem>
    </Unlockable>
    <Unlockable interfaceId="contextMenu/toggleGrid">
      <MenuItem onClick={() => {
        toggleGridView()
        onMenuItemClick()
      }}>{isGridViewOn ? 'Turn Off Grid View' : 'Turn On Grid View'}</MenuItem>
    </Unlockable>
    <Unlockable interfaceId="contextMenu/takeSnapshot">
      <MenuItem onClick={() => {
        openSnapshotTaker(generateUniqueId())
        onMenuItemClick()
      }}>Take Snapshot</MenuItem>
    </Unlockable>
    <Unlockable interfaceId="contextMenu/cutscenes">
      <MenuItem onClick={() => {
        openCutscenesMenu()
        onMenuItemClick()
      }}>View Cutscenes</MenuItem>
    </Unlockable>
  </>
};

const mapStateToProps = (state) => ({
  gameModel: state.gameModel,
  gameViewEditor: state.gameViewEditor
});

export default connect(mapStateToProps, { 
  openLiveEditor, 
  openSectionEditor, 
  openSelectBackgroundColor, 
  openSnapshotTaker, 
  toggleGridView, 
  openGameMetadataModal, 
  openCutscenesMenu
})( WorldContextMenu );
