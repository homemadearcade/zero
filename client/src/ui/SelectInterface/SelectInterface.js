/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectInterface.scss';
import SelectChipsAuto from '../SelectChipsAuto/SelectChipsAuto';
import { interfaceIdData } from '../../constants/interfaceIdData';
import { ACTION_UNLOCK } from '../../constants';

const SelectInterface = ({ onChange, disabled, value, formLabel, actionType }) => {

  const mapEntityToOption = (interfaceId) => {
    const interfaceData = interfaceIdData[interfaceId]
    const name = interfaceData.name || interfaceData.previewText

    if(!name) return false

    if(actionType === ACTION_UNLOCK && interfaceData.isDefaultUnlocked) return false

    return {
      label: name,
      value: interfaceId,
      isRemoved: !name
    }
  }

  const options = Object.keys(interfaceIdData).map(mapEntityToOption)

  return <SelectChipsAuto 
    disabled={disabled}
    onChange={(event, interfaceIds) => {
      onChange(event,  interfaceIds)
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
)(SelectInterface);
