/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectSides.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { SIDE_DOWN, SIDE_LEFT, SIDE_RIGHT, SIDE_UP } from '../../constants';

const sideToDisplayName = {
  [SIDE_UP]: 'Top',
  [SIDE_RIGHT]: 'Right',
  [SIDE_DOWN]: 'Bottom',
  [SIDE_LEFT]: 'Left',
}

const SelectSides = ({ formLabel, onChange, value, disabled}) => {
  const mapControlsToOption = (sideId) => {
    return {
      label: sideToDisplayName[sideId],
      value: sideId
    }
  }

  const options = [SIDE_UP, SIDE_RIGHT, SIDE_DOWN, SIDE_LEFT].map(mapControlsToOption)

  return <SelectChipsAuto 
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
)(SelectSides);
