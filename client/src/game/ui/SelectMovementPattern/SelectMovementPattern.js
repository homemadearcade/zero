/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectMovementPattern.scss';
import SelectChipsAuto from '../../../app/ui/SelectChipsAuto/SelectChipsAuto';
import { downToUp, leftToRight, rightToLeft, turnOnCollide, upToDown } from '../../../defaultData/movement';
import { MOVEMENT_DOWN_TO_UP, MOVEMENT_LEFT_TO_RIGHT, MOVEMENT_RIGHT_TO_LEFT, MOVEMENT_TURN_ON_COLLIDE, MOVEMENT_UP_TO_DOWN } from '../../../constants';

const movementPatterns = {
  [MOVEMENT_UP_TO_DOWN]: upToDown,
  [MOVEMENT_DOWN_TO_UP]: downToUp,
  [MOVEMENT_LEFT_TO_RIGHT]: leftToRight,
  [MOVEMENT_RIGHT_TO_LEFT]: rightToLeft,
  [MOVEMENT_TURN_ON_COLLIDE]: turnOnCollide
}

const movementPatternToLabel = {
  [MOVEMENT_UP_TO_DOWN]: 'Up to Down',
  [MOVEMENT_DOWN_TO_UP]: 'Down to Up',
  [MOVEMENT_LEFT_TO_RIGHT]: 'Left to Right',
  [MOVEMENT_RIGHT_TO_LEFT]: 'Right to Left',
  [MOVEMENT_TURN_ON_COLLIDE]: 'Turn on Collide'
}

const SelectMovementPattern = ({ onChange, value, formLabel }) => {
  const mapMovementToOption = (movement) => {
    console.log(movement, movementPatternToLabel[movement])
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
