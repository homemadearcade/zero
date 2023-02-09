/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './EraserSelect.scss';
import classNames from 'classnames';
import { clearClass, selectBrush, clearBrush } from '../../../store/actions/gameEditorActions';
import { ERASER_BRUSH_ID } from '../../constants';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Icon from '../../../ui/Icon/Icon';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { ERASER_IID } from '../../../constants/interfaceIds';

const EraserSelect = ({
  gameEditor: { brushIdSelectedBrushList },
  canvasId,
  selectBrush,
  clearClass,
  clearBrush,
  width,
  height
}) => {
  const eraserId = ERASER_BRUSH_ID + '/' +  canvasId;

  return <Unlockable isTiny interfaceId={ERASER_IID}><div
    onClick={() => {
      if(eraserId === brushIdSelectedBrushList) {
        clearBrush()
      } else {
        clearClass()
        selectBrush(eraserId, canvasId)
      }
    }}
    className={classNames("EraserSelect", { 'EraserSelect--selected': brushIdSelectedBrushList === eraserId})}
  >
     <Icon sx={{width, height}} icon="faEraser"/>
  </div></Unlockable>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameEditor: state.gameEditor,
})

export default compose(
  connect(mapStateToProps, { selectBrush, clearClass, clearBrush }),
)(EraserSelect);
