/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectViewCategory.scss';

import { activityToInterfaceData, activityViewToInterfaceData } from '../../constants';
import RadioGroupColumn from '../RadioGroupColumn/RadioGroupColumn';

const SelectViewCategory = ({ onChange, value, formLabel, disabled, activityCategory }) => {
  const mapControlsToOption = (viewCategory) => {
    const viewData = activityViewToInterfaceData[viewCategory]
    if(activityToInterfaceData[activityCategory].viewOptions.indexOf(viewCategory) === -1) return null

    return {
      icon: viewData.icon,
      label: viewData.displayName,
      value: viewCategory
    }
  }

  const options = Object.keys(activityViewToInterfaceData).map(mapControlsToOption).filter((option) => option)

  // .filter((viewCategory) => {
  //   return activityViewToInterfaceData[viewCategory].isCreateable
  // })

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
)(SelectViewCategory);
