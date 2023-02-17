/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectActivity.scss';

import { activityKeyToDisplayName } from '../../constants';
import RadioGroupColumn from '../RadioGroupColumn/RadioGroupColumn';

const SelectActivity = ({ onChange, value, formLabel, disabled }) => {
  const mapControlsToOption = (experience) => {
    return {
      label: activityKeyToDisplayName[experience],
      value: experience
    }
  }

  const options = Object.keys(activityKeyToDisplayName).map(mapControlsToOption)

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
)(SelectActivity);
