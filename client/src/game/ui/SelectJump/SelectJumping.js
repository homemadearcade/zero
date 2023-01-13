/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectJumping.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { JUMP_GROUND,  JUMP_COMBO, JUMP_CONSTANT, JUMP_NONE, JUMP_AIR } from '../../constants';
import { floaterDefaults, jetpackDefaults, jumperDefaults } from '../../defaultData/jumping';
import { airJumpDefaults, noJumpDefaults } from '../../defaultData/jumping';

const controlsValues = {
  [JUMP_NONE]: noJumpDefaults,
  [JUMP_GROUND]: jumperDefaults,
  [JUMP_AIR]: airJumpDefaults,
  [JUMP_COMBO]: floaterDefaults,
  [JUMP_CONSTANT]: jetpackDefaults,
}

const controlsValueToLabel = {
  [JUMP_NONE]: 'None',
  [JUMP_GROUND]: 'Ground Jump',
  [JUMP_AIR]: 'Air Jump',
  [JUMP_COMBO]: 'Ground + Air Jump',
  [JUMP_CONSTANT]: 'Jetpack',
}

const SelectJumping = ({ onChange, value, formLabel }) => {
  const mapControlsToOption = (controls) => {

    return {
      label: controlsValueToLabel[controls],
      value: controls
    }
  }


  const options = Object.keys(controlsValues).map(mapControlsToOption)
  console.log(options, controlsValues, controlsValueToLabel)

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
)(SelectJumping);
