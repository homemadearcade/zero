/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { toggleLayerVisibility } from '../../../store/actions/editorInstanceActions';
import { mapCobrowsingState } from '../../../utils/cobrowsing';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
     {layerVisibility[layerId] && <div><FontAwesomeIcon icon={faEye}/></div>}
     {!layerVisibility[layerId] && <div><FontAwesomeIcon icon={faEyeSlash}/></div>}
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  editorInstance: state.editorInstance,
});

export default compose(
  connect(mapStateToProps, { toggleLayerVisibility }),
)(LayerVisibility);
