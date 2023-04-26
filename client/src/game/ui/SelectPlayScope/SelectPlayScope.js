/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { playScopeInterfaceData } from '../../constants';
import { ADMIN_ROLE } from '../../../constants';

const SelectPlayScope = ({ onChange, value, formLabel, auth: { me } }) => {
  const mapEntityTypeToOption = (playScopeId) => {

    const interfaceData = playScopeInterfaceData[playScopeId]

    return {
      label: interfaceData.name,
      subLabel: interfaceData.description,
      icon: interfaceData.icon,
      value: playScopeId,
      isRemoved: interfaceData.adminOnly && me.role !== ADMIN_ROLE
    }
  }

  const options = Object.keys(playScopeInterfaceData).map(mapEntityTypeToOption)

  return <SelectChipsAuto 
    onChange={(event, playScopes) => {
      onChange(playScopes[playScopes.length - 1])
    }}
    formLabel={formLabel}
    value={[value]}
    hideRemoved
    options={options}
  />
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    // gameModel: state.gameModel.gameModel,
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectPlayScope);
