/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectMovementPattern.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { followClassDefaults, followPlayerDefaults, jumpDefaults, noneDefaults, sideToSideDefaults,turnOnCollideDefaults, turnRandomlyDefaults, upAndDownDefaults } from '../../defaultData/movement';
import { MOVEMENT_FOLLOW_CLASS, MOVEMENT_FOLLOW_PLAYER, MOVEMENT_JUMP, MOVEMENT_NONE, MOVEMENT_SIDE_TO_SIDE, MOVEMENT_TURN_ON_COLLIDE, MOVEMENT_TURN_RANDOMLY, MOVEMENT_UP_AND_DOWN } from '../../constants';

const movementPatterns = {
  [MOVEMENT_UP_AND_DOWN]: upAndDownDefaults,
  [MOVEMENT_SIDE_TO_SIDE]: sideToSideDefaults,
  [MOVEMENT_TURN_ON_COLLIDE]: turnOnCollideDefaults,
  [MOVEMENT_TURN_RANDOMLY]: turnRandomlyDefaults,
  [MOVEMENT_JUMP]: jumpDefaults,
  [MOVEMENT_FOLLOW_PLAYER]: followPlayerDefaults,
  [MOVEMENT_FOLLOW_CLASS]: followClassDefaults,
  [MOVEMENT_NONE]: noneDefaults,
}

const movementPatternToLabel = {
  [MOVEMENT_UP_AND_DOWN]: 'Up and Down',
  [MOVEMENT_SIDE_TO_SIDE]: 'Side to Side',
  [MOVEMENT_TURN_ON_COLLIDE]: 'Turn on Collide',
  [MOVEMENT_TURN_RANDOMLY]: 'Turn Randomly',
  [MOVEMENT_JUMP]: 'Jumper',
  [MOVEMENT_FOLLOW_PLAYER]: 'Follow Player',
  [MOVEMENT_FOLLOW_CLASS]: 'Follow Class',
  [MOVEMENT_NONE]: 'Doesnt move by itself'
}

const SelectMovementPattern = ({ onChange, value, formLabel }) => {
  const mapMovementToOption = (movement) => {
    return {
      label: movementPatternToLabel[movement],
      value: movement
    }
  }

  const options = Object.keys(movementPatterns).map(mapMovementToOption)

  return <SelectChipsAuto 
    onChange={(event, descriptors) => {
      onChange(event,  descriptors.map((pattern) => {
        return movementPatterns[pattern]
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
)(SelectMovementPattern);
