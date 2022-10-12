/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectRelationEffect.scss';
import SelectChipsAuto from '../../../app/ui/SelectChipsAuto/SelectChipsAuto';
import { collideOnlyEffects, effectDisplayNames, effectSuffix, getEffectLabel } from '../../../defaultData/relationship';
import { ON_COLLIDE } from '../../../constants';

const SelectRelationEffect = ({ event, onChange, value, formLabel, disabled, game: { gameModel }, classId, agentClassId}) => {
  const objectClass = gameModel.classes[classId]
  const agentClass = gameModel.classes[agentClassId]

  const mapControlsToOption = (effect) => {

    return {
      label: getEffectLabel(effect, objectClass, agentClass),
      value: effect
    }
  }

  const options = Object.keys(effectDisplayNames).filter((effectType) => {
    if(event !== ON_COLLIDE && collideOnlyEffects[effectType]) return false
    return true
  }).map(mapControlsToOption)

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
    game: state.game,
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectRelationEffect);
