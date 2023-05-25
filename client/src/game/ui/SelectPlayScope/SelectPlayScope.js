/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { playScopeInterfaceData } from '../../constants';
import { APP_ADMIN_ROLE } from '../../../constants';

const SelectPlayScope = ({ onChange, value, formLabel, auth: { me } }) => {
  const mapEntityTypeToOption = (playScopeId) => {

    const interfaceData = playScopeInterfaceData[playScopeId]

    return {
      title: interfaceData.name,
      subTitle: interfaceData.description,
      icon: interfaceData.icon,
      value: playScopeId,
      isRemoved: interfaceData.appAdminOnly && !me.role[APP_ADMIN_ROLE]
    }
  }

  const options = Object.keys(playScopeInterfaceData).map(mapEntityTypeToOption)

  return <SelectChipsAuto 
    onChange={(event, playScopes) => {
      onChange(playScopes[playScopes.length - 1])
    }}
    formLabel={formLabel}
    value={value ? [value] : []}
    hideRemoved
    options={options}
  />
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectPlayScope);
