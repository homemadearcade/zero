/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

// import './TagITem.scss';
import { selectBrush, clearBrush } from '../../../store/actions/gameSelectorActions';
import { openContextMenuFromClassId } from '../../../store/actions/contextMenuActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { changeRelationIdHovering } from '../../../store/actions/hoverPreviewActions';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { RELATION_SELECT_IID, TAG_SELECT_IID } from '../../../constants/interfaceIds';
import { NestedListItem } from '../../../ui/NestedList/NestedList';
import { openCreateRelation } from '../../../store/actions/gameFormEditorActions';
import Typography from '../../../ui/Typography/Typography';
import { effectBehaviorToDisplayNames, eventTypeToDisplayNames, eventShortNames } from '../../constants';
import RelationShorthand from '../RelationShorthand/RelationShorthand';

const RelationItem = ({
  gameModel: { gameModel: { relations, effects, events } },
  relationId,
  changeRelationIdHovering,
  openCreateRelation
}) => {
  const relation= relations[relationId]
  // const relationEvent = events[relation.event]
  // const relationEffects = Object.keys(relation.effects).map((effectId) => {
  //   return effects[effectId]
  // })

  return <Unlockable interfaceId={RELATION_SELECT_IID}>
    <div
    onMouseEnter={() => {
      changeRelationIdHovering(relationId)
    }}
    onMouseLeave={() => {
      changeRelationIdHovering(null)
    }}>
      <NestedListItem
        onClick={() => {
          openCreateRelation(relation)
          console.log('???', relation)
        }}
      >
        <Typography variant="body2">
          <RelationShorthand relation={relation}/>
        </Typography>
      </NestedListItem>
    </div>
  </Unlockable>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameSelector: state.gameSelector,
})

export default compose(
  connect(mapStateToProps, { openContextMenuFromClassId, openCreateRelation, selectBrush, clearBrush, changeRelationIdHovering }),
)(RelationItem);
