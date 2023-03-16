/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectEffect.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { persistentEffects } from '../../constants';
import { EFFECT_COLLIDE, ON_COLLIDE_ACTIVE } from '../../constants';

const SelectEffect = ({ event, onChange, value, formLabel, disabled, gameModel}) => {
  const mapControlsToOption = (effect) => {
    return {
      label: effect,
      value: effect
    }
  }

  function isUsuableEffect(effectId) {
    const effectType = gameModel.effects[effectId]
    if(effectType === EFFECT_COLLIDE) return false
    if(event.type !== ON_COLLIDE_ACTIVE && persistentEffects[effectType]) return false
    if(!persistentEffects[effectType] && (event.type === ON_COLLIDE_ACTIVE)) return false
    return true
  }

  const options = Object.keys(gameModel.effects).filter((effectId) => {
    const effect = gameModel.effects[effectId]
    if(isUsuableEffect(effect.type)) return true
    return false
  }).map(mapControlsToOption)

  const useableValue = value.filter(isUsuableEffect)

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
)(SelectEffect);
