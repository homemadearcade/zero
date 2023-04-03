import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import { openGameMetadataModal, openLiveEditor } from '../../../store/actions/game/gameSelectorActions';
import { toggleGridView, openSectionEditor, openSnapshotTaker, toggleLayerVisibility } from '../../../store/actions/game/gameViewEditorActions';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { openCutscenesMenu, openStagesMenu } from '../../../store/actions/game/gameFormEditorActions';
import ContextMenuTitle from '../../../ui/ContextMenuTitle/ContextMenuTitle';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { STAGE_EDITOR_IID, CONTEXT_MENU_PLAYTEST_IID, CONTEXT_MENU_STAGES_IID,CONTEXT_MENU_STAGE_GRAVITY_IID, CONTEXT_MENU_STAGE_SECTIONS_IID, GAME_METADATA_IID, GAME_SNAPSHOT_IID, GRID_VIEW_TOGGLE_IID, STAGE_COLOR_IID } from '../../../constants/interfaceIds';
import { openSelectStageColorModal } from '../../../store/actions/game/gameSelectorActions';

const StageContextMenu = ({ 
  openLiveEditor,
  openSectionEditor, 
  onMenuItemClick, 
  openSelectStageColorModal,
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
    }}>{gameModel?.metadata.title}</ContextMenuTitle>
    <Unlockable interfaceId={CONTEXT_MENU_STAGE_GRAVITY_IID}>
      <MenuItem onClick={() => {
        openLiveEditor(STAGE_EDITOR_IID)
        onMenuItemClick()
      }}>Edit Gravity</MenuItem>
    </Unlockable>
    <Unlockable interfaceId={CONTEXT_MENU_STAGE_SECTIONS_IID}>
      <MenuItem onClick={() => {
        openSectionEditor()
        onMenuItemClick()
      }}>Edit Boundaries</MenuItem>
    </Unlockable>
    <Unlockable interfaceId={STAGE_COLOR_IID}>
      <MenuItem onClick={() => {
        openSelectStageColorModal()
        onMenuItemClick()
      }}>Edit Default Background Color</MenuItem>
    </Unlockable>
    <Unlockable interfaceId={GAME_METADATA_IID}>
      <MenuItem onClick={() => {
        openGameMetadataModal()
        onMenuItemClick()
      }}>Edit Metadata</MenuItem>
    </Unlockable>
    <Unlockable interfaceId={CONTEXT_MENU_STAGES_IID}>
      <MenuItem onClick={() => {
        openStagesMenu()
        onMenuItemClick()
      }}>Edit Stages</MenuItem>
    </Unlockable>
    <Unlockable interfaceId={GAME_SNAPSHOT_IID}>
      <MenuItem onClick={() => {
        openSnapshotTaker()
        onMenuItemClick()
      }}>Take Snapshot</MenuItem>
    </Unlockable>
    <Unlockable interfaceId={CONTEXT_MENU_PLAYTEST_IID}>
      <MenuItem onClick={() => {
        window.open(window.location.origin + '/play/' + gameModel.id, '_blank');
        onMenuItemClick()
      }}>Playtest Game</MenuItem>
    </Unlockable>
    {false && <Unlockable interfaceId={GRID_VIEW_TOGGLE_IID}>
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
  openSelectStageColorModal, 
  openSnapshotTaker, 
  toggleGridView, 
  openGameMetadataModal, 
  openCutscenesMenu,
  openStagesMenu,
  toggleLayerVisibility,
})( StageContextMenu );
