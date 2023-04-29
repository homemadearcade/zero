import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import { openGameEditDialog, openStageLiveEditor  } from '../../../store/actions/game/gameSelectorActions';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import ContextMenuTitle from '../../../ui/ContextMenuTitle/ContextMenuTitle';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { CONTENT_OPEN_EDIT_IID, GAME_OPEN_EDIT_IID, RELATION_SYSTEM_OPEN_EDIT_IID, STAGE_OPEN_EDIT_IID } from '../../../constants/interfaceIds';
import { ListItemIcon } from '@mui/material';
import Icon from '../../../ui/Icon/Icon';
import { openEditContentDialog, openEditRelationSystemDialog } from '../../../store/actions/game/gameFormEditorActions';

    // <Unlockable interfaceId={PLAYTEST_OPEN_IID}>
    //   <MenuItem onClick={() => {
    //     window.open(window.location.origin + '/play/' + gameModel.id, '_blank');
    //     onMenuItemClick()
    //   }}>Playtest Game</MenuItem>
    // </Unlockable>

    //     <Unlockable interfaceId={STAGE_OPEN_SECTIONS_IID}>
    //   <MenuItem onClick={() => {
    //     openBoundaryEditor()
    //     onMenuItemClick()
    //   }}>Edit Boundaries</MenuItem>
    // </Unlockable>
const StageContextMenu = ({ 
  onMenuItemClick, 
  openGameEditDialog,
  openEditRelationSystemDialog,
  openEditContentDialog,
  openStageLiveEditor,
  gameModel: { gameModel }, 
}) => {
  return <>
    <ContextMenuTitle onClick={() => {
      openGameEditDialog()
      onMenuItemClick()
    }}>{gameModel?.metadata.title}</ContextMenuTitle>
      <Unlockable interfaceId={GAME_OPEN_EDIT_IID}>
        <MenuItem onClick={() => {
          onMenuItemClick()
          openGameEditDialog()
        }}>
          <ListItemIcon>
            <Icon icon="faGamepad"/>
          </ListItemIcon>
          Edit Game
        </MenuItem>
      </Unlockable>
      <Unlockable interfaceId={RELATION_SYSTEM_OPEN_EDIT_IID}>
        <MenuItem onClick={() => {
          onMenuItemClick()
          openEditRelationSystemDialog()
        }}>
          <ListItemIcon>
            <Icon icon="faLink"/>
            </ListItemIcon>
          Edit Relationships
        </MenuItem>
      </Unlockable>
      <Unlockable interfaceId={CONTENT_OPEN_EDIT_IID}>
        <MenuItem onClick={() => {
          onMenuItemClick()
          openEditContentDialog()
        }}>
          <ListItemIcon>
            <Icon icon="faIcons"/>
          </ListItemIcon>
          Edit Content
          </MenuItem>
      </Unlockable>
      <Unlockable interfaceId={STAGE_OPEN_EDIT_IID}>
        <MenuItem onClick={() => {
          onMenuItemClick()
          openStageLiveEditor()
        }}>
          <ListItemIcon>
            <Icon icon="faMap"/>
          </ListItemIcon>
            Edit Stage
          </MenuItem>
      </Unlockable>
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameViewEditor: state.gameViewEditor
});

export default connect(mapStateToProps, { 
  openGameEditDialog, 
  openStageLiveEditor,
  openEditContentDialog,
  openEditRelationSystemDialog,
})( StageContextMenu );
