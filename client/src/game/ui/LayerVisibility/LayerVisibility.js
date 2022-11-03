/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { toggleLayerVisibility } from '../../../store/actions/gameViewEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Icon from '../../../components/ui/Icon/Icon';
import {  stopPropagation } from '../../../utils/webPageUtils';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';

const LayerVisibility = ({
  gameViewEditor: { layerVisibility },
  toggleLayerVisibility,
  canvasId
}) => {
  return <Unlockable isTiny interfaceId="layerVisibility"><div
    onClick={(e) => {
      stopPropagation(e)
      toggleLayerVisibility(canvasId)
    }}
  >
     {layerVisibility[canvasId] && <div><Icon icon="faEye"/></div>}
     {!layerVisibility[canvasId] && <div><Icon icon="faEyeSlash"/></div>}
  </div></Unlockable>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameViewEditor: state.gameViewEditor,
});

export default compose(
  connect(mapStateToProps, { toggleLayerVisibility }),
)(LayerVisibility);
