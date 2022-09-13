/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectMovementPattern.scss';
import SelectChipsAuto from '../../../app/ui/SelectChipsAuto/SelectChipsAuto';
import { MOVEMENT_SIDE_TO_SIDE, MOVEMENT_UP_AND_DOWN, MOVEMENT_WANDER } from '../../../constants';

const movementValues = [
  MOVEMENT_SIDE_TO_SIDE,
  MOVEMENT_UP_AND_DOWN,
  MOVEMENT_WANDER
]

const movementValueToLabel = {
  [MOVEMENT_SIDE_TO_SIDE]: 'Side to side',
  [MOVEMENT_UP_AND_DOWN]: 'Up and down',
  [MOVEMENT_WANDER]: 'Wander'
}

const SelectMovementPattern = ({ onChange, value, formLabel }) => {
  const mapMovementToOption = (movement) => {

    return {
      label: movementValueToLabel[movement],
      value: movement
    }
  }

  const options = movementValues.map(mapMovementToOption)

  return <SelectChipsAuto 
    onChange={(event, descriptors) => {
      onChange(event,  descriptors)
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
