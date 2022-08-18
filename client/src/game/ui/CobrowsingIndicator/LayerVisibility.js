/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { toggleLayerVisibility } from '../../../store/actions/editorInstanceActions';
import { mapCobrowsingState } from '../../../utils/cobrowsing';
import Icon from '../../ui/Icon/Icon';

const LayerVisibility = ({
  editorInstance: { layerVisibility },
  toggleLayerVisibility,
  canvasId
}) => {
  return <div
    onClick={() => {
      toggleLayerVisibility(canvasId)
    }}
  >
     {layerVisibility[canvasId] && <div><Icon icon="faEye"/></div>}
     {!layerVisibility[canvasId] && <div><Icon icon="faEyeSlash"/></div>}
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  editorInstance: state.editorInstance,
});

export default compose(
  connect(mapStateToProps, { toggleLayerVisibility }),
)(LayerVisibility);
