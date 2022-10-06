/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectControls.scss';
import SelectChipsAuto from '../../../app/ui/SelectChipsAuto/SelectChipsAuto';
import { PLATFORMER_CONTROLS, ADVENTURER_CONTROLS, SPACESHIP_CONTROLS, CAR_CONTROLS, FLOATER_CONTROLS } from '../../../constants';
import { adventurerDefaults, carDefaults, floaterDefaults, platformerDefaults, spaceshipDefaults } from '../../../defaultData/movement';

const controlsValues = {
  [PLATFORMER_CONTROLS]: platformerDefaults,
  [ADVENTURER_CONTROLS]: adventurerDefaults,
  [SPACESHIP_CONTROLS]: spaceshipDefaults,
  // [CAR_CONTROLS]: carDefaults,
  [FLOATER_CONTROLS]: floaterDefaults,
}

const controlsValueToLabel = {
  [PLATFORMER_CONTROLS]: 'Platformer',
  [ADVENTURER_CONTROLS]: 'Adventurer',
  [SPACESHIP_CONTROLS]: 'Spaceship',
  [FLOATER_CONTROLS]: 'Floater',
  [CAR_CONTROLS]: 'Car'
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
    // gameModel: state.game.gameModel,
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectControls);
