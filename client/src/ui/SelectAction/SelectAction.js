/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectAction.scss';
import SelectChipsAuto from '../SelectChipsAuto/SelectChipsAuto';
import { actionIdData } from '../../constants';

const SelectAction = ({ onChange, disabled, value, formLabel, actionType }) => {

  const mapEntityToOption = (actionId) => {
    const actionData = actionIdData[actionId]
    const name = actionData.name

    if(actionData.actionType !== actionType) return false

    return {
      label: name,
      value: actionId,
    }
  }

  const options = Object.keys(actionIdData).map(mapEntityToOption)

  return <SelectChipsAuto 
    disabled={disabled}
    onChange={(event, actionIds) => {
      onChange(event,  actionIds)
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
)(SelectAction);
