/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './BrushItem.scss';
import classNames from 'classnames';
import { clearClass, selectBrush, openContextMenuFromClassId, clearBrush } from '../../store/actions/editorActions';

const BrushItem = ({
  game: { gameModel: brushes },
  brushId,
  editor: { editorState: { brushSelectedIdBrushList }},
  selectBrush,
  clearClass,
  clearBrush,
}) => {
  const brush = brushes[brushId]
  return <div
    key={brushId} 
    onClick={() => {
      if(brushId === brushSelectedIdBrushList) {
        clearBrush()
      } else {
        clearClass()
        selectBrush(brushId)
      }
    }}
    className={classNames("GameBrushList__brush", { 'GameBrushList__brush--selected': brushSelectedIdBrushList === brushId})}
  >
    {brushId}
  </div>
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  game: state.game,
});

export default compose(
  connect(mapStateToProps, { openContextMenuFromClassId, selectBrush, clearClass, clearBrush }),
)(BrushItem);
