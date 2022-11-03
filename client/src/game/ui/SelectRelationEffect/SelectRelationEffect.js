/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectRelationEffect.scss';
import SelectChipsAuto from '../../../components/ui/SelectChipsAuto/SelectChipsAuto';
import { collideOnlyEffects, effectDisplayNames, getEffectLabel, nonRemoteEffects } from '../../../defaultData/relationship';
import { EFFECT_COLLIDE, ON_COLLIDE } from '../../../constants';

const SelectRelationEffect = ({ event, effect, onChange, value, formLabel, disabled, game: { gameModel }, classIdA, classIdB}) => {
  const classA = gameModel.classes[classIdA]
  const classB = gameModel.classes[classIdB]

  const mapControlsToOption = (effect) => {

    return {
      label: getEffectLabel(effect, classA, classB),
      value: effect
    }
  }

  function isUsuableEffect(effectType) {
    if(effectType === EFFECT_COLLIDE) return false
    if(event.type !== ON_COLLIDE && collideOnlyEffects[effectType]) return false
    if(effect?.effectedClassId && nonRemoteEffects[effectType]) return false

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
    game: state.game,
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectRelationEffect);
