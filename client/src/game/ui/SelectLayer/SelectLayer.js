/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectLayer.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';

const SelectLayer = ({ formLabel, onChange, value, disabled, gameModel: { gameModel, currentStageId }}) => {
  const currentStage = gameModel.stages[currentStageId]
  const mapControlsToOption = (layerId) => {
    const layer = currentStage.layers[layerId]
    return {
      label: layer.name,
      value: layerId
    }
  }

  const options = Object.keys(currentStage.layers).map(mapControlsToOption)

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
