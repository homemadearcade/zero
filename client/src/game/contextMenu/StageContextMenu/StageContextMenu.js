import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import { openGameEditDialog  } from '../../../store/actions/game/gameSelectorActions';
import { openBoundaryEditor } from '../../../store/actions/game/gameViewEditorActions';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import ContextMenuTitle from '../../../ui/ContextMenuTitle/ContextMenuTitle';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import {
  PLAYTEST_OPEN_IID, STAGE_OPEN_SECTIONS_IID, 
 } from '../../../constants/interfaceIds';

const StageContextMenu = ({ 
  onMenuItemClick, 
  openGameEditDialog, 
  openStagesMenu,
  gameModel: { gameModel }, 
}) => {
  return <>
    <ContextMenuTitle onClick={() => {
        openGameEditDialog()
        onMenuItemClick()
    }}>{gameModel?.metadata.title}</ContextMenuTitle>
    <Unlockable interfaceId={STAGE_OPEN_SECTIONS_IID}>
      <MenuItem onClick={() => {
        openBoundaryEditor()
        onMenuItemClick()
      }}>Edit Boundaries</MenuItem>
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
  openBoundaryEditor, 
  openGameEditDialog, 
})( StageContextMenu );
