/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectMovementPattern.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { followPlayerDefaults, jumpDefaults, noneDefaults, sideToSideDefaults,turnOnCollideDefaults, upAndDownDefaults } from '../../defaultData/movement';
import { MOVEMENT_FOLLOW_PLAYER, MOVEMENT_JUMP, MOVEMENT_NONE, MOVEMENT_SIDE_TO_SIDE, MOVEMENT_TURN_ON_COLLIDE, MOVEMENT_UP_AND_DOWN } from '../../constants';

const movementPatterns = {
  [MOVEMENT_UP_AND_DOWN]: upAndDownDefaults,
  [MOVEMENT_SIDE_TO_SIDE]: sideToSideDefaults,
  [MOVEMENT_TURN_ON_COLLIDE]: turnOnCollideDefaults,
  [MOVEMENT_JUMP]: jumpDefaults,
  [MOVEMENT_FOLLOW_PLAYER]: followPlayerDefaults,
  [MOVEMENT_NONE]: noneDefaults,
}

const movementPatternToLabel = {
  [MOVEMENT_UP_AND_DOWN]: 'Up and Down',
  [MOVEMENT_SIDE_TO_SIDE]: 'Side to Side',
  [MOVEMENT_TURN_ON_COLLIDE]: 'Turn on Collide',
  [MOVEMENT_JUMP]: 'Jumper',
  [MOVEMENT_FOLLOW_PLAYER]: 'Follow Player',
  [MOVEMENT_NONE]: 'None'
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
    // gameModel: state.game.gameModel,
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectMovementPattern);
