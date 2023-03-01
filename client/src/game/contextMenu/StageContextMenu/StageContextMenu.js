import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import { openGameMetadataModal, openLiveEditor, openSelectBackgroundColorModal } from '../../../store/actions/gameSelectorActions';
import { toggleGridView, openSectionEditor, openSnapshotTaker, toggleLayerVisibility } from '../../../store/actions/gameViewEditorActions';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { STAGE_BACKGROUND_CANVAS_ID, STAGE_EDITOR } from '../../constants';
import { openCutscenesMenu, openStagesMenu } from '../../../store/actions/gameFormEditorActions';
import ContextMenuTitle from '../../../ui/ContextMenuTitle/ContextMenuTitle';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { CONTEXT_MENU_CUTSCENES_IID, CONTEXT_MENU_METADATA_IID, CONTEXT_MENU_PLAYTEST_IID, CONTEXT_MENU_SNAPSHOT_IID, CONTEXT_MENU_STAGES_IID, CONTEXT_MENU_STAGE_COLOR_IID, CONTEXT_MENU_STAGE_GRAVITY_IID, CONTEXT_MENU_STAGE_SECTIONS_IID, GRID_VIEW_TOGGLE_IID, LAYER_VISIBILITY_IID } from '../../../constants/interfaceIds';

const StageContextMenu = ({ 
  openLiveEditor,
  openSectionEditor, 
  onMenuItemClick, 
  openSelectBackgroundColorModal,
  openGameMetadataModal, 
  openSnapshotTaker, 
  openCutscenesMenu, 
  openStagesMenu,
  toggleGridView, 
  toggleLayerVisibility,
  gameModel: { gameModel }, 
  gameViewEditor: { isGridViewOn, layerVisibility }
}) => {
  return <>
    <ContextMenuTitle onClick={() => {
        openGameMetadataModal()
        onMenuItemClick()
    }}>{gameModel.metadata.title}</ContextMenuTitle>
    <Unlockable interfaceId={CONTEXT_MENU_STAGE_GRAVITY_IID}>
      <MenuItem onClick={() => {
        openLiveEditor(STAGE_EDITOR)
        onMenuItemClick()
      }}>Edit Gravity</MenuItem>
    </Unlockable>
    <Unlockable interfaceId={CONTEXT_MENU_STAGE_SECTIONS_IID}>
      <MenuItem onClick={() => {
        openSectionEditor()
        onMenuItemClick()
      }}>Edit Boundaries</MenuItem>
    </Unlockable>
    <Unlockable interfaceId={CONTEXT_MENU_CUTSCENES_IID}>
      <MenuItem onClick={() => {
        openCutscenesMenu()
        onMenuItemClick()
      }}>Edit Cutscenes</MenuItem>
    </Unlockable>
    <Unlockable interfaceId={CONTEXT_MENU_STAGES_IID}>
      <MenuItem onClick={() => {
        openStagesMenu()
        onMenuItemClick()
      }}>Edit Stages</MenuItem>
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
  openSelectBackgroundColorModal, 
  openSnapshotTaker, 
  toggleGridView, 
  openGameMetadataModal, 
  openCutscenesMenu,
  openStagesMenu,
  toggleLayerVisibility,
})( StageContextMenu );
