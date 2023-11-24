/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectInterfaceAction.scss';
import SelectChipsAuto from '../../SelectChipsAuto/SelectChipsAuto';
import { interfaceActionData } from '../../constants/interfaceActionIdData';

const SelectInterfaceAction = ({ onChange, disabled, value, formLabel, interfaceActionGroupId }) => {

  const mapEntityToOption = (interfaceActionId) => {
    const actionData = interfaceActionData[interfaceActionId]
    const name = actionData.name

    if(actionData.interfaceActionGroupId !== interfaceActionGroupId) return false

    return {
      title: name,
      value: interfaceActionId,
    }
  }

  const options = Object.keys(interfaceActionData).map(mapEntityToOption)

  return <SelectChipsAuto 
    disabled={disabled}
    onChange={(event, interfaceActionIds) => {
      onChange(event,  interfaceActionIds)
    }}
    formLabel={formLabel}
    value={value}
    options={options}
  />
}

const mapStateToProps = (state) => {
  return {}
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectInterfaceAction);
