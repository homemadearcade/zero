/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectExperienceState.scss';

import { experienceStateKeyToDisplayName } from '../../constants';
import RadioGroupColumn from '../RadioGroupColumn/RadioGroupColumn';

const SelectExperienceState = ({ onChange, value, formLabel, disabled }) => {
  const mapControlsToOption = (experience) => {
    return {
      label: experienceStateKeyToDisplayName[experience],
      value: experience
    }
  }

  const options = Object.keys(experienceStateKeyToDisplayName).map(mapControlsToOption)

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
)(SelectExperienceState);
