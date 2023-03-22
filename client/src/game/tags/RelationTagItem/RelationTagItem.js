/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

// import './TagITem.scss';
import { selectBrush, clearBrush } from '../../../store/actions/gameSelectorActions';
import { openContextMenuFromClassId } from '../../../store/actions/contextMenuActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { changeRelationTagIdHovering } from '../../../store/actions/hoverPreviewActions';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { RELATION_TAG_SELECT_IID } from '../../../constants/interfaceIds';
import { NestedListItem } from '../../../ui/NestedList/NestedList';
import { openCreateRelationTag } from '../../../store/actions/gameFormEditorActions';
import Typography from '../../../ui/Typography/Typography';

const RelationTagItem = ({
  gameModel: { gameModel: { relationTags } },
  relationTagId,
  changeRelationTagIdHovering,
  openCreateRelationTag
}) => {
  const relationTag = relationTags[relationTagId]
  return <Unlockable interfaceId={RELATION_TAG_SELECT_IID}>
    <div
    onMouseEnter={() => {
      changeRelationTagIdHovering(relationTagId)
    }}
    onMouseLeave={() => {
      changeRelationTagIdHovering(null)
    }}>
      <NestedListItem
        useColor color={relationTag.textureTint}
        onClick={() => {openCreateRelationTag(relationTag)}}
      >
        <Typography variant="body2">
          {relationTag.name}
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
  connect(mapStateToProps, { openContextMenuFromClassId, openCreateRelationTag, selectBrush, clearBrush, changeRelationTagIdHovering }),
)(RelationTagItem);
