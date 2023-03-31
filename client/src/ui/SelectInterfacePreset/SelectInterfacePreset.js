/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectInterfacePreset.scss';
import SelectChipsAuto from '../SelectChipsAuto/SelectChipsAuto';

const SelectInterfacePreset = ({ onChange, disabled, value, formLabel, interfacePresetLibrary }) => {

  const mapEntityToOption = (interfacePreset) => {
    return {
      label: interfacePreset.name,
      value: interfacePreset.id,
    }
  }

  const options = interfacePresetLibrary.map(mapEntityToOption)

  return <SelectChipsAuto 
    disabled={disabled}
    onChange={(event, visualTags) => {
      onChange(event,  visualTags)
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
)(SelectInterfacePreset);
