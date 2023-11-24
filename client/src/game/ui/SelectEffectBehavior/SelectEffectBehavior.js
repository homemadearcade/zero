/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectEffectBehavior.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { effectInterfaceData, isUseableEffect } from '../../constants';

const SelectEffectBehavior = ({ onChange, value, eventType, formLabel, disabled}) => {
  const mapEffectsToOption = (effectBehavior) => {
    const effectTypeInterfaceData = effectInterfaceData[effectBehavior]

    return {
      title: effectTypeInterfaceData.displayName,
      value: effectBehavior,
      isRemoved: !effectTypeInterfaceData.isCustomizeable
    }
  }

  const options = Object.keys(effectInterfaceData).filter((effectBehavior) => {
    if(eventType && !isUseableEffect(null, effectBehavior, eventType)) return false
    return true
  }).map(mapEffectsToOption)

  const useableValue = value.filter((effectBehavior) => {
    if(eventType && !isUseableEffect(null, effectBehavior, eventType)) return false 
    return true
  })

  return <SelectChipsAuto 
    hideRemoved
    disabled={disabled}
    onChange={onChange}
    formLabel={formLabel}
    value={useableValue}
    options={options}
  />
}

const mapStateToProps = (state) => {
  return {

  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectEffectBehavior);
