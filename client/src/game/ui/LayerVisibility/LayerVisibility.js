/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { toggleLayerVisibility } from '../../../store/actions/editorInstanceActions';
import { getRemoteCobrowsingState } from '../../../utils/cobrowsing';

const LayerVisibility = ({
  editorInstanceState: { layerVisibility },
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

const mapStateToProps = (state) => getRemoteCobrowsingState(state, {
  editorInstanceState: state.editorInstance.editorInstanceState,
});

export default compose(
  connect(mapStateToProps, { toggleLayerVisibility }),
)(LayerVisibility);
