/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './Eraser.scss';
import classNames from 'classnames';
import { clearClass, selectBrush, clearBrush } from '../../../store/actions/editorActions';
import { ERASER_BRUSH_ID } from '../../../constants';

const Eraser = ({
  editor: { editorState: { brushSelectedIdBrushList }},
  depth,
  selectBrush,
  clearClass,
  clearBrush,
}) => {
  const eraserId = ERASER_BRUSH_ID + depth;

  return <div
    onClick={() => {
      if(eraserId === brushSelectedIdBrushList) {
        clearBrush()
      } else {
        clearClass()
        selectBrush(eraserId)
      }
    }}
    className={classNames("Eraser", { 'Eraser--selected': brushSelectedIdBrushList === eraserId})}
  >
     <i className="fas fa-eraser"/>
  </div>
};

const mapStateToProps = (state) => ({
  editor: state.editor,
});

export default compose(
  connect(mapStateToProps, { selectBrush, clearClass, clearBrush }),
)(Eraser);
