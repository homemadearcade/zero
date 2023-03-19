/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectJumpBehavior.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { JUMP_GROUND,  JUMP_COMBO, JUMP_CONSTANT, JUMP_NONE, JUMP_AIR } from '../../constants';
import { comboJumpDefaults, jetpackDefaults, groundJumpDefaults } from '../../constants';
import { airJumpDefaults, noJumpDefaults } from '../../constants';

const jumpBehaviorDefaults = {
  [JUMP_NONE]: noJumpDefaults,
  [JUMP_GROUND]: groundJumpDefaults,
  [JUMP_AIR]: airJumpDefaults,
  [JUMP_COMBO]: comboJumpDefaults,
  [JUMP_CONSTANT]: jetpackDefaults,
}

const jumpBehaviorToLabel = {
  [JUMP_NONE]: 'None',
  [JUMP_GROUND]: 'Ground Jump',
  [JUMP_AIR]: 'Air Jump',
  [JUMP_COMBO]: 'Ground + Air Jump',
  [JUMP_CONSTANT]: 'Jetpack',
}

const SelectJumpBehavior = ({ onChange, value, formLabel }) => {
  const mapControlsToOption = (jumpBehavior) => {

    return {
      label: jumpBehaviorToLabel[jumpBehavior],
      value: jumpBehavior
    }
  }


  const options = Object.keys(jumpBehaviorDefaults).map(mapControlsToOption)

  return <SelectChipsAuto 
    onChange={(event, descriptors) => {
      onChange(event, descriptors.map((jumpBehavior) => {
        return jumpBehaviorDefaults[jumpBehavior]
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
)(SelectJumpBehavior);
