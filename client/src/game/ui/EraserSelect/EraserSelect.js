/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './EraserSelect.scss';
import classNames from 'classnames';
import { clearClass, selectBrush, clearBrush } from '../../../store/actions/editorActions';
import { ERASER_BRUSH_ID } from '../../../constants';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Icon from '../../../app/ui/Icon/Icon';

const EraserSelect = ({
  editor: { brushIdSelectedBrushList },
  canvasId,
  selectBrush,
  clearClass,
  clearBrush,
}) => {
  const eraserId = ERASER_BRUSH_ID + '/' +  canvasId;

  return <div
    onClick={() => {
      if(eraserId === brushIdSelectedBrushList) {
        clearBrush()
      } else {
        clearClass()
        selectBrush(eraserId)
      }
    }}
    className={classNames("EraserSelect", { 'EraserSelect--selected': brushIdSelectedBrushList === eraserId})}
  >
     <Icon icon="faEraser"/>
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  editor: state.editor,
})

export default compose(
  connect(mapStateToProps, { selectBrush, clearClass, clearBrush }),
)(EraserSelect);
