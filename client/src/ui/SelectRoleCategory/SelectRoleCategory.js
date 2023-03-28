/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectRoleCategory.scss';

import { roleToInterfaceData } from '../../constants';
import RadioGroupColumn from '../RadioGroupColumn/RadioGroupColumn';

const SelectRoleCategory = ({ onChange, value, formLabel, disabled }) => {
  const mapControlsToOption = (roleCategory) => {
    const roleData = roleToInterfaceData[roleCategory]
    return {
      icon: roleData.icon,
      label: roleData.displayName,
      value: roleCategory
    }
  }

  const options = Object.keys(roleToInterfaceData).map(mapControlsToOption)

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
)(SelectRoleCategory);
