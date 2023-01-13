/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectControls.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import {  WALKER_CONTROLS, VEHICLE_CONTROLS, RUNNER_CONTROLS } from '../../constants';
import { walkerDefaults, vehicleDefaults, runnerDefaults } from '../../defaultData/movement';

const controlsValues = {
  [WALKER_CONTROLS]: walkerDefaults,
  // [CAR_CONTROLS]: carDefaults,
  [RUNNER_CONTROLS]: runnerDefaults,
  [VEHICLE_CONTROLS]: vehicleDefaults,
}

const controlsValueToLabel = {
  [WALKER_CONTROLS]: 'Directional',
  // [CAR_CONTROLS]: 'Car',
  [RUNNER_CONTROLS]: 'Advanced Directional',
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
