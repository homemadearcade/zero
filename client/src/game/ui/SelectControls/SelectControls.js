/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectControls.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import {  DIRECTIONAL_CONTROLS, VEHICLE_CONTROLS, ADVANCED_DIRECTIONAL_CONTROLS } from '../../constants';
import { directionalDefaults, vehicleDefaults, advancedDirectionalDefaults } from '../../constants';

const controlsValues = {
  [DIRECTIONAL_CONTROLS]: directionalDefaults,
  // [CAR_CONTROLS]: carDefaults,
  [ADVANCED_DIRECTIONAL_CONTROLS]: advancedDirectionalDefaults,
  [VEHICLE_CONTROLS]: vehicleDefaults,
}

const controlsValueToLabel = {
  [DIRECTIONAL_CONTROLS]: 'Directional',
  // [CAR_CONTROLS]: 'Car',
  [ADVANCED_DIRECTIONAL_CONTROLS]: 'Advanced Directional',
  [VEHICLE_CONTROLS]: 'Rotational',

}

const SelectControls = ({ onChange, value, formLabel }) => {
  const mapControlsToOption = (controls) => {

    return {
      label: controlsValueToLabel[controls],
      value: controls
    }
  }

  const options = Object.keys(controlsValues).map(mapControlsToOption)

  return <SelectChipsAuto 
    onChange={(event, descriptors) => {
      onChange(event, descriptors.map((pattern) => {
        return controlsValues[pattern]
      }))
    }}
    formLabel={formLabel}
    value={value}
    options={options}
  />
}

const mapStateToProps = (state) => {
  return {
    // gameModel: state.gameModel.gameModel,
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectControls);
