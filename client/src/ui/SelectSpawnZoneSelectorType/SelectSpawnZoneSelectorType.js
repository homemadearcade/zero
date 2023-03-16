/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectSpawnZoneSelectorType.scss';

import RadioGroupColumn from '../RadioGroupColumn/RadioGroupColumn';
import { spawnZoneSelectorTypeToDisplayName, SPAWN_ZONE_A_SELECT, SPAWN_ZONE_B_SELECT } from '../../game/constants';

const SelectSpawnZoneSelectorType = ({ useA, useB, onChange, value, formLabel, disabled }) => {
  const mapControlsToOption = (spawnZoneSelectorType) => {
    return {
      label: spawnZoneSelectorTypeToDisplayName[spawnZoneSelectorType],
      value: spawnZoneSelectorType
    }
  }


  console.log(useA, useB)

  const options = Object.keys(spawnZoneSelectorTypeToDisplayName).map(mapControlsToOption).filter((option) => {
    if(!useA && option.value === SPAWN_ZONE_A_SELECT) return false
    if(!useB && option.value === SPAWN_ZONE_B_SELECT) return false

    return true
  })

  return <RadioGroupColumn
    disabled={disabled}
    onChange={onChange}
    formLabel={formLabel}
    value={value}
    options={options}
  />
}

const mapStateToProps = (state) => {
  return {
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectSpawnZoneSelectorType);
