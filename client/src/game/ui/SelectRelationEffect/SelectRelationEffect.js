/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectRelationEffect.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { persistentEffects, effectDisplayNames, getEffectLabel, nonRemoteEffects } from '../../defaultData/relationship';
import { EFFECT_COLLIDE, ON_COLLIDE_ACTIVE } from '../../constants';
import { getClassAandB } from '../../../utils/gameUtils';

const SelectRelationEffect = ({ event, effect, onChange, value, formLabel, disabled, classIdA, classIdB}) => {
  const { classA, classB } = getClassAandB(classIdA, classIdB)

  const mapControlsToOption = (effect) => {
    return {
      label: getEffectLabel(effect, classA, classB),
      value: effect
    }
  }

  function isUsuableEffect(effectType) {
    if(effectType === EFFECT_COLLIDE) return false
    if(event.type !== ON_COLLIDE_ACTIVE && persistentEffects[effectType]) return false
    if(!persistentEffects[effectType] && (event.type === ON_COLLIDE_ACTIVE)) return false
    if(effect?.remoteEffectedClassId && nonRemoteEffects[effectType]) {
      return false
    }

    return true
  }

  const options = Object.keys(effectDisplayNames).filter((effectType) => {
    if(isUsuableEffect(effectType)) return true
    return false
  }).map(mapControlsToOption)

  const useableValue = isUsuableEffect(value) ? value : []

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
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectRelationEffect);
