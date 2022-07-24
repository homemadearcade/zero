/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { toggleLayerVisibility } from '../../../store/actions/editorInstanceActions';
import { mapCobrowsingState } from '../../../utils/cobrowsing';

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
     {layerVisibility[layerId] && <div><i className="fas fa-eye"/></div>}
     {!layerVisibility[layerId] && <div><i className="fas fa-eye-slash"/></div>}
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  editorInstance: state.editorInstance,
});

export default compose(
  connect(mapStateToProps, { toggleLayerVisibility }),
)(LayerVisibility);
