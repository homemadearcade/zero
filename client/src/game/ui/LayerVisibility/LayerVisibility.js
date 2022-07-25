/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { toggleLayerVisibility } from '../../../store/actions/editorInstanceActions';
import { mapCobrowsingState } from '../../../utils/cobrowsing';
import Icon from '../../../app/ui/Icon/Icon';

const LayerVisibility = ({
  editorInstance: { layerVisibility },
  toggleLayerVisibility,
  layerId
}) => {
  return <div
    onClick={() => {
      toggleLayerVisibility(layerId)
    }}
  >
     {layerVisibility[layerId] && <div><Icon icon="faEye"/></div>}
     {!layerVisibility[layerId] && <div><Icon icon="faEyeSlash"/></div>}
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  editorInstance: state.editorInstance,
});

export default compose(
  connect(mapStateToProps, { toggleLayerVisibility }),
)(LayerVisibility);
