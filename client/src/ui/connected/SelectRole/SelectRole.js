/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectRole.scss';

import SelectChipsAuto from '../../SelectChipsAuto/SelectChipsAuto';
import { roleToInterfaceData } from '../../../constants';

const SelectRole = ({ onSelect, value, formLabel, disabled, experienceModel: { experienceModel } }) => {
  const mapControlsToOption = (roleId) => {
   const role = experienceModel.roles[roleId]
    return {
      label: role.name,
      icon: roleToInterfaceData[role.roleCategory].icon,
      iconColor: role.color,
      value: role.roleId,
      isRemoved: role.isRemoved && !role.isNotRemoveable
    }
  }

  const options = Object.keys(experienceModel.roles).map(mapControlsToOption)

 return <SelectChipsAuto
    onChange={(event, roles) => {
      onSelect(roles)
    }}
    disabled={disabled}
    hideRemoved
    formLabel={formLabel}
    value={value}
    options={options}
  />

}

const mapStateToProps = (state) => {
  return {
    experienceModel: state.experienceModel,
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectRole);
