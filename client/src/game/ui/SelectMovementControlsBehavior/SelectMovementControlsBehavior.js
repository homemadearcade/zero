/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectMovementControlsBehavior.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import {  DIRECTIONAL_CONTROLS, VEHICLE_CONTROLS, ADVANCED_DIRECTIONAL_CONTROLS } from '../../constants';
import { directionalDefaults, vehicleDefaults, advancedDirectionalDefaults } from '../../constants';

const controlBehaviorToDefaults = {
  [DIRECTIONAL_CONTROLS]: directionalDefaults,
  // [CAR_CONTROLS]: carDefaults,
  [ADVANCED_DIRECTIONAL_CONTROLS]: advancedDirectionalDefaults,
  [VEHICLE_CONTROLS]: vehicleDefaults,
}

const controlBehaviorToLabel = {
  [DIRECTIONAL_CONTROLS]: 'Directional',
  // [CAR_CONTROLS]: 'Car',
  [ADVANCED_DIRECTIONAL_CONTROLS]: 'Advanced Directional',
  [VEHICLE_CONTROLS]: 'Rotational',

}

const SelectMovementControlsBehavior = ({ onChange, value, formLabel }) => {
  const mapControlsToOption = (controlBehavior) => {

    return {
      title: controlBehaviorToLabel[controlBehavior],
      value: controlBehavior
    }
  }

  const options = Object.keys(controlBehaviorToDefaults).map(mapControlsToOption)

  return <SelectChipsAuto 
    onChange={(event, visualTags) => {
      onChange(event, visualTags.map((controlBehavior) => {
        return controlBehaviorToDefaults[controlBehavior]
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
)(SelectMovementControlsBehavior);
