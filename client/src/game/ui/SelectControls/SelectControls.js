/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectControls.scss';
import SelectChipsAuto from '../../../app/ui/SelectChipsAuto/SelectChipsAuto';
import { PLATFORMER_CONTROLS, ADVENTURER_CONTROLS, SPACESHIP_CONTROLS } from '../../../constants';

const controlsValues = [
  PLATFORMER_CONTROLS,
  ADVENTURER_CONTROLS,
  SPACESHIP_CONTROLS
]

const controlsValueToLabel = {
  [PLATFORMER_CONTROLS]: 'Platformer',
  [ADVENTURER_CONTROLS]: 'Adventurer',
  [SPACESHIP_CONTROLS]: 'Spaceship'
}

const SelectControls = ({ onChange, value, formLabel }) => {
  const mapControlsToOption = (controls) => {

    return {
      label: controlsValueToLabel[controls],
      value: controls
    }
  }

  const options = controlsValues.map(mapControlsToOption)

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
)(SelectControls);
