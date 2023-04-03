/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectEffectBehavior.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { effectBehaviorInterfaces, effectBehaviorToDisplayNames, isUseableEffect } from '../../constants';

const SelectEffectBehavior = ({ onChange, value, eventType, formLabel, disabled, gameModel}) => {
  const mapEffectsToOption = (effectBehavior) => {
    const effectBehaviorInterface = effectBehaviorInterfaces[effectBehavior]

    return {
      label: effectBehaviorToDisplayNames[effectBehavior],
      value: effectBehavior,
      isRemoved: !effectBehaviorInterface.isCustomizeable
    }
  }

  const options = Object.keys(effectBehaviorToDisplayNames).filter((effectBehavior) => {
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
    gameModel: state.gameModel.gameModel
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectEffectBehavior);
