/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectRelationEffect.scss';
import SelectChipsAuto from '../../../app/ui/SelectChipsAuto/SelectChipsAuto';
import { effectDisplayNames, effectSuffix } from '../../../defaultData/relationship';

const SelectRelationEffect = ({ onChange, value, formLabel, game: { gameModel }, classId, agentClassId}) => {
  const objectClass = gameModel.classes[classId]
  const agentClass = gameModel.classes[agentClassId]

  function getSuffix(effect) {
    if(effectSuffix[effect] === 'Both' && agentClassId) {
      return objectClass.name + ' and ' + agentClass.name
    } else if(effectSuffix[effect] === 'Class') {
      return objectClass.name
    }

    return ''
  }

  const mapControlsToOption = (effect) => {

    return {
      label: effectDisplayNames[effect] + ' ' + getSuffix(effect),
      value: effect
    }
  }

  const options = Object.keys(effectDisplayNames).map(mapControlsToOption)

  return <SelectChipsAuto 
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
