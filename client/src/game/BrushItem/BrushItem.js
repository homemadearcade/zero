/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './BrushItem.scss';
import classNames from 'classnames';
import { clearClass, selectBrush, openContextMenuFromClassId, clearBrush } from '../../store/actions/editorActions';
import Sprite from '../ui/Sprite/Sprite';

const BrushItem = ({
  game: { gameModel: { brushes } },
  brushId,
  editorState: { brushSelectedIdBrushList },
  selectBrush,
  clearClass,
  clearBrush,
}) => {
  const brush = brushes[brushId]
  
  return <div
    onClick={() => {
      if(brushId === brushSelectedIdBrushList) {
        clearBrush()
      } else {
        clearClass()
        selectBrush(brushId)
      }
    }}
    className={classNames("BrushItem", { 'BrushItem--selected': brushSelectedIdBrushList === brushId})}
  >
    {brush.textureId && <Sprite textureId={brush.textureId} width={50} height={50}/>}
    {brush.name || brush.descriptors ? brush.descriptors[0] : brushId}
  </div>
};

const mapStateToProps = (state) => {
  const isCobrowsing = state.cobrowsing.isSubscribedCobrowsing

  // console.log(isCobrowsing, isCobrowsing ? state.cobrowsing.remoteState.editor : state.editor.editorState)
  return {
    game: state.game,
    editorState: isCobrowsing ? state.cobrowsing.remoteState.editor : state.editor.editorState,
  }
};

export default compose(
  connect(mapStateToProps, { openContextMenuFromClassId, selectBrush, clearClass, clearBrush }),
)(BrushItem);
