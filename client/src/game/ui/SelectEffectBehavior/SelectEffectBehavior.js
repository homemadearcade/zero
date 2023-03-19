/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectEffectBehavior.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { effectBehaviorToDisplayNames, isUseableEffect } from '../../constants';

const SelectEffectBehavior = ({ onChange, value, eventType, formLabel, disabled, gameModel}) => {
  const mapEffectsToOption = (effect) => {
    return {
      label: effectBehaviorToDisplayNames[effect],
      value: effect
    }
  }

  const options = Object.keys(effectBehaviorToDisplayNames).filter((effectBehavior) => {
    if(isUseableEffect(effectBehavior, eventType)) return true
    return false
  }).map(mapEffectsToOption)

  const useableValue = value.filter((effectBehavior) => {
    return isUseableEffect(effectBehavior, eventType)
  })

  return <SelectChipsAuto 
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
