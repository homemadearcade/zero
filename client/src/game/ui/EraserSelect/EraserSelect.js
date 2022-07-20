/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './EraserSelect.scss';
import classNames from 'classnames';
import { clearClass, selectBrush, clearBrush } from '../../../store/actions/editorActions';
import { ERASER_BRUSH_ID } from '../../../constants';
import { withCobrowsingState } from '../../../utils/cobrowsing';

const EraserSelect = ({
  editorState: { brushSelectedIdBrushList },
  layerId,
  selectBrush,
  clearClass,
  clearBrush,
}) => {
  const eraserId = ERASER_BRUSH_ID + layerId;

  return <div
    onClick={() => {
      if(eraserId === brushSelectedIdBrushList) {
        clearBrush()
      } else {
        clearClass()
        selectBrush(eraserId)
      }
    }}
    className={classNames("EraserSelect", { 'EraserSelect--selected': brushSelectedIdBrushList === eraserId})}
  >
     <i className="fas fa-eraser"/>
  </div>
};

const mapStateToProps = (state) => withCobrowsingState(state, {
  editorState: state.editor.editorState,
})

export default compose(
  connect(mapStateToProps, { selectBrush, clearClass, clearBrush }),
)(EraserSelect);
