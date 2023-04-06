import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import { openGameMetadataDialog, openLiveEditor } from '../../../store/actions/game/gameSelectorActions';
import { toggleGridView, openSectionEditor, openSnapshotTaker, toggleLayerVisibility } from '../../../store/actions/game/gameViewEditorActions';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { openCutscenesMenu, openStagesMenu } from '../../../store/actions/game/gameFormEditorActions';
import ContextMenuTitle from '../../../ui/ContextMenuTitle/ContextMenuTitle';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { STAGE_EDITOR_IID, PLAYTEST_OPEN_IID, STAGES_OPEN_IID,STAGE_OPEN_GRAVITY_IID, STAGE_OPEN_SECTIONS_IID, GAME_OPEN_METADATA_IID, GAME_OPEN_SNAPSHOT_IID, GRID_VIEW_TOGGLE_IID, STAGE_OPEN_BACKGROUND_COLOR_IID } from '../../../constants/interfaceIds';
import { openSelectStageColorDialog } from '../../../store/actions/game/gameSelectorActions';

const StageContextMenu = ({ 
  openLiveEditor,
  openSectionEditor, 
  onMenuItemClick, 
  openSelectStageColorDialog,
  openGameMetadataDialog, 
  openSnapshotTaker, 
  openStagesMenu,
  gameModel: { gameModel }, 
}) => {
  return <>
    <ContextMenuTitle onClick={() => {
        openGameMetadataDialog()
        onMenuItemClick()
    }}>{gameModel?.metadata.title}</ContextMenuTitle>
    <Unlockable interfaceId={STAGE_OPEN_GRAVITY_IID}>
      <MenuItem onClick={() => {
        openLiveEditor(STAGE_EDITOR_IID)
        onMenuItemClick()
      }}>Edit Gravity</MenuItem>
    </Unlockable>
    <Unlockable interfaceId={STAGE_OPEN_SECTIONS_IID}>
      <MenuItem onClick={() => {
        openSectionEditor()
        onMenuItemClick()
      }}>Edit Boundaries</MenuItem>
    </Unlockable>
    <Unlockable interfaceId={STAGE_OPEN_BACKGROUND_COLOR_IID}>
      <MenuItem onClick={() => {
        openSelectStageColorDialog()
        onMenuItemClick()
      }}>Edit Background Color</MenuItem>
    </Unlockable>
    <Unlockable interfaceId={GAME_OPEN_METADATA_IID}>
      <MenuItem onClick={() => {
        openGameMetadataDialog()
        onMenuItemClick()
      }}>Edit Metadata</MenuItem>
    </Unlockable>
    <Unlockable interfaceId={STAGES_OPEN_IID}>
      <MenuItem onClick={() => {
        openStagesMenu()
        onMenuItemClick()
      }}>Edit Stages</MenuItem>
    </Unlockable>
    <Unlockable interfaceId={GAME_OPEN_SNAPSHOT_IID}>
      <MenuItem onClick={() => {
        openSnapshotTaker()
        onMenuItemClick()
      }}>Take Snapshot</MenuItem>
    </Unlockable>
    <Unlockable interfaceId={PLAYTEST_OPEN_IID}>
      <MenuItem onClick={() => {
        window.open(window.location.origin + '/play/' + gameModel.id, '_blank');
        onMenuItemClick()
      }}>Playtest Game</MenuItem>
    </Unlockable>
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameViewEditor: state.gameViewEditor
});

export default connect(mapStateToProps, { 
  openLiveEditor, 
  openSectionEditor, 
  openSelectStageColorDialog, 
  openSnapshotTaker, 
  toggleGridView, 
  openGameMetadataDialog, 
  openCutscenesMenu,
  openStagesMenu,
  toggleLayerVisibility,
})( StageContextMenu );
