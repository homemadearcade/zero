import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import { openGameMetadataModal, openLiveEditor, openSelectBackgroundColor } from '../../../store/actions/gameEditorActions';
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
  openSelectBackgroundColor,
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
    <Unlockable interfaceId={CONTEXT_MENU_STAGE_COLOR_IID}>
      <MenuItem onClick={() => {
        openSelectBackgroundColor()
        onMenuItemClick()
      }}>Edit Default Background Color</MenuItem>
    </Unlockable>
    <Unlockable interfaceId={CONTEXT_MENU_METADATA_IID}>
      <MenuItem onClick={() => {
        openGameMetadataModal()
        onMenuItemClick()
      }}>Edit Metadata</MenuItem>
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
    <Unlockable interfaceId={CONTEXT_MENU_SNAPSHOT_IID}>
      <MenuItem onClick={() => {
        openSnapshotTaker()
        onMenuItemClick()
      }}>Take Snapshot</MenuItem>
    </Unlockable>
    <Unlockable adminOnly interfaceId={CONTEXT_MENU_PLAYTEST_IID}>
      <MenuItem onClick={() => {
        window.open(window.location.origin + '/play/' + gameModel.id, '_blank');
        onMenuItemClick()
      }}>Playtest Game</MenuItem>
    </Unlockable>
    {<Unlockable adminOnly interfaceId={LAYER_VISIBILITY_IID}>
      <MenuItem onClick={() => {
        toggleLayerVisibility(STAGE_BACKGROUND_CANVAS_ID)
        onMenuItemClick()
      }}>{layerVisibility[STAGE_BACKGROUND_CANVAS_ID] ? 'Hide Default Background Layer' : 'Show Default Background Layer'}</MenuItem>
    </Unlockable>}
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
  openSelectBackgroundColor, 
  openSnapshotTaker, 
  toggleGridView, 
  openGameMetadataModal, 
  openCutscenesMenu,
  openStagesMenu,
  toggleLayerVisibility,
})( StageContextMenu );
