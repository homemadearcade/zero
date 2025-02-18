/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { toggleLayerVisibility } from '../../../store/actions/game/gameViewEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Icon from '../../../ui/Icon/Icon';
import {  stopPropagation } from '../../../utils/webPageUtils';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { GAME_VIEW_INSTANCE_VISIBILITY_IID } from '../../../constants/interfaceIds';
import Button from '../../../ui/Button/Button';

const LayerVisibility = ({
  gameViewEditor: { layerInvisibility },
  toggleLayerVisibility,
  layerId
}) => {
  return <Unlockable isTiny interfaceId={GAME_VIEW_INSTANCE_VISIBILITY_IID}><div
    onClick={(e) => {
      // stopPropagation(e)
      toggleLayerVisibility(layerId)
    }}
  > 
    <Button startIcon={<Icon icon="faEye"></Icon>} size="tiny">
      {!layerInvisibility[layerId] && 'Hide'}
      {layerInvisibility[layerId] && 'Show'}
    </Button>
  </div></Unlockable>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameViewEditor: state.gameViewEditor,
});

export default compose(
  connect(mapStateToProps, { toggleLayerVisibility }),
)(LayerVisibility);
