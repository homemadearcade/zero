/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectLayer.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { BACKGROUND_LAYER_GROUP_IID, FOREGROUND_LAYER_GROUP_IID, PLAYGROUND_LAYER_GROUP_IID } from '../../../constants/interfaceIds';

const layerGroupIIDtoName = {
  [BACKGROUND_LAYER_GROUP_IID]: 'Background',
  [FOREGROUND_LAYER_GROUP_IID]: 'Foreground',
  [PLAYGROUND_LAYER_GROUP_IID]: 'Playground'
}

const SelectLayer = ({ formLabel, onChange, value, disabled}) => {
  const mapControlsToOption = (layerGroupId) => {

    return {
      label: layerGroupIIDtoName[layerGroupId],
      value: layerGroupId
    }
  }

  const options = [BACKGROUND_LAYER_GROUP_IID, PLAYGROUND_LAYER_GROUP_IID, FOREGROUND_LAYER_GROUP_IID].map(mapControlsToOption)

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
    gameModel: state.gameModel
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectLayer);
