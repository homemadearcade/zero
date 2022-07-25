/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './EraserSelect.scss';
import classNames from 'classnames';
import { clearClass, selectBrush, clearBrush } from '../../../store/actions/editorActions';
import { ERASER_BRUSH_ID } from '../../../constants';
import { mapCobrowsingState } from '../../../utils/cobrowsing';
import { faEraser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const EraserSelect = ({
  editor: { brushSelectedIdBrushList },
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
     <FontAwesomeIcon icon={faEraser}/>
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  editor: state.editor,
})

export default compose(
  connect(mapStateToProps, { selectBrush, clearClass, clearBrush }),
)(EraserSelect);
