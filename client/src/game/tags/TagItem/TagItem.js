/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

// import './TagITem.scss';
import { selectBrush, clearBrush } from '../../../store/actions/gameSelectorActions';
import { openContextMenuFromClassId } from '../../../store/actions/contextMenuActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { changeTagIdHovering } from '../../../store/actions/hoverPreviewActions';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { TAG_SELECT_IID } from '../../../constants/interfaceIds';
import { NestedListItem } from '../../../ui/NestedList/NestedList';
import { openCreateTag } from '../../../store/actions/gameFormEditorActions';
import Typography from '../../../ui/Typography/Typography';

const TagItem = ({
  gameModel: { gameModel: { tags } },
  tagId,
  changeTagIdHovering,
  openCreateTag
}) => {
  const tag = tags[tagId]
  return <Unlockable interfaceId={TAG_SELECT_IID}>
    <div
    onMouseEnter={() => {
      changeTagIdHovering(tagId)
    }}
    onMouseLeave={() => {
      changeTagIdHovering(null)
    }}>
      <NestedListItem
        useColor color={tag.textureTint}
        onClick={() => {openCreateTag(tag)}}
      >
        <Typography variant="body2">
          {tag.name}
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
  connect(mapStateToProps, { openContextMenuFromClassId, openCreateTag, selectBrush, clearBrush, changeTagIdHovering }),
)(TagItem);
