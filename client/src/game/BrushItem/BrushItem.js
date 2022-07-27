/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './BrushItem.scss';
import classNames from 'classnames';
import { selectBrush, clearBrush } from '../../store/actions/editorActions';
import { openContextMenuFromClassId } from '../../store/actions/contextMenuActions';
import { mapCobrowsingState } from '../../utils/cobrowsing';
import Sprite from '../ui/Sprite/Sprite';

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
    <div className="BrushItem__sprite">
      <Sprite tint={brush.tint} textureId={brush.textureId}/>
    </div>
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  game: state.game,
  editor: state.editor,
})

export default compose(
  connect(mapStateToProps, { openContextMenuFromClassId, selectBrush, clearBrush }),
)(BrushItem);
