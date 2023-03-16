/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectEffectType.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { effectDisplayNames, isUseableEffect } from '../../constants';

const SelectEffectType = ({ onChange, value, eventType, formLabel, disabled, gameModel}) => {
  const mapEffectsToOption = (effect) => {
    return {
      label: effectDisplayNames[effect],
      value: effect
    }
  }

  const options = Object.keys(effectDisplayNames).filter((effectType) => {
    if(isUseableEffect(effectType, eventType)) return true
    return false
  }).map(mapEffectsToOption)

  // const useableValue = value.filter((effectId) => {
  //   const effect = gameModel.effects[effectId]
  //   return isUseableEffect(effect.type, event.type)
  // })

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
    gameModel: state.gameModel.gameModel
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectEffectType);
