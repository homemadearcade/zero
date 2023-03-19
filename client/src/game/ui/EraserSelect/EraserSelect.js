/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './EraserSelect.scss';
import classNames from 'classnames';
import { clearClass, selectBrush, clearBrush } from '../../../store/actions/gameSelectorActions';
import { ERASER_BRUSH_ID } from '../../constants';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Icon from '../../../ui/Icon/Icon';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { ERASER_IID } from '../../../constants/interfaceIds';
import { getThemePrimaryColor } from '../../../utils/webPageUtils';
import { useWishTheme } from '../../../hooks/useWishTheme';

const EraserSelect = ({
  gameSelector: { brushIdSelectedBrushList },
  layerCanvasId,
  selectBrush,
  clearClass,
  clearBrush,
  width,
  height
}) => {
  const eraserId = ERASER_BRUSH_ID + '/' +  layerCanvasId;

  const isSelected = brushIdSelectedBrushList === eraserId
  const border = '1px solid ' + useWishTheme().primaryColor.hexString
  
  return <Unlockable isTiny interfaceId={ERASER_IID}><div
    onClick={() => {
      if(eraserId === brushIdSelectedBrushList) {
        clearBrush()
      } else {
        clearClass()
        selectBrush(eraserId, layerCanvasId)
      }
    }}
    style={isSelected ? { border }  : {}}
    className={classNames("EraserSelect")}
  >
     <Icon sx={{width, height}} icon="faEraser"/>
  </div></Unlockable>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameSelector: state.gameSelector,
})

export default compose(
  connect(mapStateToProps, { selectBrush, clearClass, clearBrush }),
)(EraserSelect);
