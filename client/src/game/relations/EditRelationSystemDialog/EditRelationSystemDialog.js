/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './EditRelationSystemDialog.scss';
import CobrowsingDialog from '../../cobrowsing/CobrowsingDialog/CobrowsingDialog';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import { openEditEntityGraphics, openCreateCutscene, openCreateEffect, openCreateEvent, openCreateRelation, openCreateRelationTag, closeEditRelationSystemDialog } from '../../../store/actions/game/gameFormEditorActions';
import { openEntityBoxDialog } from '../../../store/actions/game/gameSelectorActions';
import RelationSystemList from '../RelationSystemList/RelationSystemList';

const EditRelationSystemDialog = ({ 
  closeEditRelationSystemDialog, 
  // openCreateRelationTag,
  // openCreateCutscene,
  // openCreateEffect,
  // openCreateEvent,
  // openCreateRelation,
  // openEntityBehaviorLiveEditor,
  // gameModel: { gameModel } 
}) => {
  function handleClose() {
    closeEditRelationSystemDialog()
  }

  return <CobrowsingDialog open onClose={handleClose}>
    <div className="EditRelationSystemDialog">
      <RelationSystemList/>
    </div>
  </CobrowsingDialog>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  // gameModel: state.gameModel,
  // gameFormEditor: state.gameFormEditor
})

export default compose(
  connect(mapStateToProps, { closeEditRelationSystemDialog, editGameModel, openEditEntityGraphics, openCreateEvent, openCreateEffect, openCreateRelationTag, openCreateCutscene, openCreateRelation, openEntityBoxDialog }),
)(EditRelationSystemDialog);
