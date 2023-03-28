/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectActivityCategory.scss';

import { activityToInterfaceData } from '../../constants';
import RadioGroupColumn from '../RadioGroupColumn/RadioGroupColumn';

const SelectActivityCategory = ({ onChange, value, formLabel, disabled }) => {
  const mapControlsToOption = (activityCategory) => {
    return {
      label: activityToInterfaceData[activityCategory].displayName,
      value: activityCategory
    }
  }

  const options = Object.keys(activityToInterfaceData).filter((activityCategory) => {
    return activityToInterfaceData[activityCategory].isCreateable
  }).map(mapControlsToOption)

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
)(SelectActivityCategory);
