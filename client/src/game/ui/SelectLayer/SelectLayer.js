/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectLayer.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { BACKGROUND_LAYER_CANVAS_ID, FOREGROUND_LAYER_CANVAS_ID, layerToDisplayName, PLAYGROUND_LAYER_CANVAS_ID } from '../../constants';

const SelectLayer = ({ formLabel, onChange, value, disabled}) => {
  const mapControlsToOption = (layerId) => {
    return {
      label: layerToDisplayName[layerId],
      value: layerId
    }
  }

  const options = [BACKGROUND_LAYER_CANVAS_ID, PLAYGROUND_LAYER_CANVAS_ID, FOREGROUND_LAYER_CANVAS_ID].map(mapControlsToOption)

  return <SelectChipsAuto 
    disabled={disabled}
    onChange={onChange}
    formLabel={formLabel}
    value={value}
    options={options}
  />
}

const mapStateToProps = (state) => {
  return {
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectLayer);
