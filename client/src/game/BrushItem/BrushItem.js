/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './BrushItem.scss';
import classNames from 'classnames';
import { selectBrush, openContextMenuFromClassId, clearBrush } from '../../store/actions/editorActions';
import Sprite from '../ui/Sprite/Sprite';
import { mapCobrowsingState } from '../../utils/cobrowsing';

const BrushItem = ({
  game: { gameModel: { brushes } },
  brushId,
  editor: { brushSelectedIdBrushList },
  selectBrush,
  clearBrush,
}) => {
  const brush = brushes[brushId]
  
  return <div
    onClick={() => {
      if(brushId === brushSelectedIdBrushList) {
        clearBrush()
      } else {
        selectBrush(brushId)
      }
    }}
    className={classNames("BrushItem", { 'BrushItem--selected': brushSelectedIdBrushList === brushId})}
  >
    {brush.textureId && <Sprite textureId={brush.textureId} width={50} height={50}/>}
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  game: state.game,
  editor: state.editor,
})

export default compose(
  connect(mapStateToProps, { openContextMenuFromClassId, selectBrush, clearBrush }),
)(BrushItem);
