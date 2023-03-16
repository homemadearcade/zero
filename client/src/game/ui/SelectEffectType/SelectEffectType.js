/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectEffectType.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { effectDisplayNames } from '../../constants';

const SelectEffectType = ({ onChange, value, formLabel, disabled}) => {
  const mapEffectsToOption = (effect) => {
    return {
      label: effectDisplayNames[effect],
      value: effect
    }
  }

  const options = Object.keys(effectDisplayNames).map(mapEffectsToOption)

  return <SelectChipsAuto 
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
)(SelectEffectType);
