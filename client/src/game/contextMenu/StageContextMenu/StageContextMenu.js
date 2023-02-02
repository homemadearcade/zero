import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import { openGameMetadataModal, openLiveEditor, openSelectBackgroundColor } from '../../../store/actions/gameEditorActions';
import { toggleGridView, openSectionEditor, openSnapshotTaker } from '../../../store/actions/gameViewEditorActions';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { SNAPSHOT_ID_PREFIX, STAGE_EDITOR } from '../../constants';
import { generateUniqueId } from '../../../utils/webPageUtils';
import { openCutscenesMenu, openStagesMenu } from '../../../store/actions/gameFormEditorActions';
import ContextMenuTitle from '../../../ui/ContextMenuTitle/ContextMenuTitle';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';

const StageContextMenu = ({ 
  openLiveEditor,
  openSectionEditor, 
  onMenuItemClick, 
  openSelectBackgroundColor,
  openGameMetadataModal, 
  openSnapshotTaker, 
  openCutscenesMenu, 
  openStagesMenu,
  toggleGridView, 
  gameModel: { gameModel }, 
  gameViewEditor: { isGridViewOn }
}) => {

  return <>
    <ContextMenuTitle onClick={() => {
        openGameMetadataModal()
        onMenuItemClick()
    }}>{gameModel.metadata.title}</ContextMenuTitle>
    <Unlockable interfaceId="contextMenu/stage/gravity">
      <MenuItem onClick={() => {
        openLiveEditor(STAGE_EDITOR)
        onMenuItemClick()
      }}>Edit Gravity</MenuItem>
    </Unlockable>
    <Unlockable interfaceId="contextMenu/stage/sections">
      <MenuItem onClick={() => {
        openSectionEditor()
        onMenuItemClick()
      }}>Edit Boundaries</MenuItem>
    </Unlockable>
    <Unlockable interfaceId="contextMenu/stage/backgroundColor">
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
    <Unlockable interfaceId="contextMenu/cutscenes">
      <MenuItem onClick={() => {
        openCutscenesMenu()
        onMenuItemClick()
      }}>Edit Cutscenes</MenuItem>
    </Unlockable>
    <Unlockable interfaceId="contextMenu/stages">
      <MenuItem onClick={() => {
        openStagesMenu()
        onMenuItemClick()
      }}>Edit Stages</MenuItem>
    </Unlockable>
    <Unlockable interfaceId="contextMenu/takeSnapshot">
      <MenuItem onClick={() => {
        openSnapshotTaker(SNAPSHOT_ID_PREFIX+generateUniqueId())
        onMenuItemClick()
      }}>Take Snapshot</MenuItem>
    </Unlockable>
    <Unlockable adminOnly interfaceId="contextMenu/playtest">
      <MenuItem onClick={() => {
        window.open(window.location.origin + '/play/' + gameModel.id, '_blank');
        onMenuItemClick()
      }}>Playtest Game</MenuItem>
    </Unlockable>
    {false && <Unlockable interfaceId="contextMenu/toggleGrid">
      <MenuItem onClick={() => {
        toggleGridView()
        onMenuItemClick()
      }}>{isGridViewOn ? 'Turn Off Grid View' : 'Turn On Grid View'}</MenuItem>
    </Unlockable>}
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
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
  openCutscenesMenu,
  openStagesMenu,
})( StageContextMenu );
