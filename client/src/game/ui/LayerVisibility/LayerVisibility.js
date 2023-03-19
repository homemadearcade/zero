/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { toggleLayerVisibility } from '../../../store/actions/gameViewEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Icon from '../../../ui/Icon/Icon';
import {  stopPropagation } from '../../../utils/webPageUtils';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { LAYER_VISIBILITY_IID } from '../../../constants/interfaceIds';
import Button from '../../../ui/Button/Button';

const LayerVisibility = ({
  gameViewEditor: { layerVisibility },
  toggleLayerVisibility,
  layerCanvasId
}) => {
  return <Unlockable isTiny interfaceId={LAYER_VISIBILITY_IID}><div
    onClick={(e) => {
      stopPropagation(e)
      toggleLayerVisibility(layerCanvasId)
    }}
  > 
    <Button size="tiny">
     {layerVisibility[layerCanvasId] && 'Hide'}
     {!layerVisibility[layerCanvasId] && 'Show'}
    </Button>
  </div></Unlockable>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameViewEditor: state.gameViewEditor,
});

export default compose(
  connect(mapStateToProps, { toggleLayerVisibility }),
)(LayerVisibility);
