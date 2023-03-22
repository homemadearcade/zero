/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectMovementBehavior.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { followClassDefaults, followPlayerDefaults, jumpDefaults, mirrorPlayerDefaults, MOVEMENT_MIRROR_PLAYER, noneDefaults, sideToSideDefaults,turnOnCollideDefaults, turnRandomlyDefaults, upAndDownDefaults } from '../../constants';
import { MOVEMENT_FOLLOW_RELATION_TAG, MOVEMENT_FOLLOW_PLAYER, MOVEMENT_JUMP, MOVEMENT_NONE, MOVEMENT_SIDE_TO_SIDE, MOVEMENT_TURN_ON_COLLIDE, MOVEMENT_TURN_RANDOMLY, MOVEMENT_UP_AND_DOWN } from '../../constants';

const movementBehaviorDefaults = {
  [MOVEMENT_MIRROR_PLAYER]: mirrorPlayerDefaults,
  [MOVEMENT_UP_AND_DOWN]: upAndDownDefaults,
  [MOVEMENT_SIDE_TO_SIDE]: sideToSideDefaults,
  [MOVEMENT_TURN_ON_COLLIDE]: turnOnCollideDefaults,
  [MOVEMENT_TURN_RANDOMLY]: turnRandomlyDefaults,
  [MOVEMENT_JUMP]: jumpDefaults,
  [MOVEMENT_FOLLOW_PLAYER]: followPlayerDefaults,
  [MOVEMENT_FOLLOW_RELATION_TAG]: followClassDefaults,
  [MOVEMENT_NONE]: noneDefaults,
}

const movementBehaviorToLabel = {
  [MOVEMENT_MIRROR_PLAYER]: 'Mirror Player',
  [MOVEMENT_UP_AND_DOWN]: 'Up and Down',
  [MOVEMENT_SIDE_TO_SIDE]: 'Side to Side',
  [MOVEMENT_TURN_ON_COLLIDE]: 'Turn on Collide',
  [MOVEMENT_TURN_RANDOMLY]: 'Turn Randomly',
  [MOVEMENT_JUMP]: 'Jumper',
  [MOVEMENT_FOLLOW_PLAYER]: 'Follow Player',
  [MOVEMENT_FOLLOW_RELATION_TAG]: 'Follow Tag',
  [MOVEMENT_NONE]: 'Doesnt move by itself'
}

const SelectMovementBehavior = ({ onChange, value, formLabel }) => {
  const mapMovementToOption = (movementBehavior) => {
    return {
      label: movementBehaviorToLabel[movementBehavior],
      value: movementBehavior
    }
  }

  const options = Object.keys(movementBehaviorDefaults).map(mapMovementToOption)

  return <SelectChipsAuto 
    onChange={(event, visualTags) => {
      onChange(event,  visualTags.map((movementBehavior) => {
        return movementBehaviorDefaults[movementBehavior]
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
)(SelectMovementBehavior);
