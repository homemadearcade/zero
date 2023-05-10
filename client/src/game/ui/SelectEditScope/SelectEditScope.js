/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { editScopeInterfaceData } from '../../constants';

const SelectEditScope = ({ onChange, value, formLabel }) => {
  const mapEntityTypeToOption = (playScopeId) => {

    const interfaceData = editScopeInterfaceData[playScopeId]

    return {
      title: interfaceData.name,
      subTitle: interfaceData.description,
      icon: interfaceData.icon,
      value: playScopeId
    }
  }

  const options = Object.keys(editScopeInterfaceData).map(mapEntityTypeToOption)

  return <SelectChipsAuto 
    onChange={(event, editScopes) => {
      onChange(editScopes[editScopes.length - 1])
    }}
    formLabel={formLabel}
    value={[value]}
    options={options}
  />
}

const mapStateToProps = (state) => {
  return {

  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectEditScope);
