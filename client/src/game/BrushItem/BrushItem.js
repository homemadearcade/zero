/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './BrushItem.scss';
import classNames from 'classnames';
import { selectBrush, clearBrush } from '../../store/actions/editorActions';
import { openContextMenuFromClassId } from '../../store/actions/contextMenuActions';
import Sprite from '../ui/Sprite/Sprite';
import { mapCobrowsingState } from '../../utils/cobrowsing';

const BrushItem = ({
  game: { gameModel: { brushes } },
  brushId,
  editor: { brushIdSelectedBrushList },
  selectBrush,
  clearBrush,
}) => {
  const brush = brushes[brushId]
  
  return <div
    onClick={() => {
      if(brushId === brushIdSelectedBrushList) {
        clearBrush()
      } else {
        selectBrush(brushId)
      }
    }}
    className={classNames("BrushItem", { 'BrushItem--selected': brushIdSelectedBrushList === brushId})}
  >
    {brush.textureId && <Sprite tint={brush.tint} textureId={brush.textureId} width={50} height={50}/>}
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  game: state.game,
  editor: state.editor,
})

export default compose(
  connect(mapStateToProps, { openContextMenuFromClassId, selectBrush, clearBrush }),
)(BrushItem);
