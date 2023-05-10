/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './EditRelationSystemDialog.scss';
import CobrowsingDialog from '../../cobrowsing/CobrowsingDialog/CobrowsingDialog';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import { openEditEntityGraphics, openCreateCutscene, openCreateEffect, openCreateEvent, openCreateRelation, openCreateRelationTag, closeEditRelationSystemDialog } from '../../../store/actions/game/gameFormEditorActions';
// import Button from '../../../ui/Button/Button';
// import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
// import {  SCRIPT_ADD_IID, SCRIPT_CONTAINER_IID, SCRIPT_SELECT_IID, EFFECT_IID, EFFECT_ADD_IID, EFFECT_CONTAINER_IID, EVENT_IID, EVENT_ADD_IID, EVENT_CONTAINER_IID, EVENT_SELECT_IID, IS_DATA_REMOVED_IID, RELATION_IID, RELATION_ADD_IID, RELATION_CONTAINER_IID, RELATION_TAG_IID, RELATION_TAG_ADD_IID, RELATION_TAG_CONTAINER_IID } from '../../../constants/interfaceIds';
import { openEntityBoxDialog } from '../../../store/actions/game/gameSelectorActions';
// import { NestedListContainer, NestedListItem, NestedListItemButton } from '../../../ui/NestedList/NestedList';
// import CobrowsingNestedList from '../../cobrowsing/CobrowsingNestedList/CobrowsingNestedList';
// import RelationItem from '../../relations/RelationItem/RelationItem';
// import { CUTSCENE_ADD_IID, CUTSCENE_CONTAINER_IID, CUTSCENE_SELECT_IID } from '../../../constants/interfaceIds/cutsceneInterfaceIds';
// import EventShorthand from '../../event/EventShorthand/EventShorthand';
// import RelationTagItem from '../../tags/RelationTagItem/RelationTagItem';
// import EffectItem from '../../effect/EffectItem/EffectItem';
// import SelectorMoreMenu from '../SelectorMoreMenu/SelectorMoreMenu'
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
