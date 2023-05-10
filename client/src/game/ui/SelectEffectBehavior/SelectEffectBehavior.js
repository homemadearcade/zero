/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectEffectBehavior.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { effectEditInterfaces, effectInterfaceDatas, isUseableEffect } from '../../constants';

const SelectEffectBehavior = ({ onChange, value, eventType, formLabel, disabled}) => {
  const mapEffectsToOption = (effectBehavior) => {
    const effectEditInterface = effectEditInterfaces[effectBehavior]

    return {
      title: effectInterfaceDatas[effectBehavior].displayName,
      value: effectBehavior,
      isRemoved: !effectEditInterface.isCustomizeable
    }
  }

  const options = Object.keys(effectInterfaceDatas).filter((effectBehavior) => {
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
