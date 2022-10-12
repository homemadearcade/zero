/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectColliders.scss';
import SelectChipsAuto from '../../../app/ui/SelectChipsAuto/SelectChipsAuto';
import { EFFECT_COLLIDE, ON_COLLIDE } from '../../../constants';

const SelectColliders = ({ onChange, classId, formLabel, gameModel, classType }) => {
  const objectClass = gameModel.classes[classId]

  const mapClassToOption = (collidingClassId) => {
    const objectClass = gameModel.classes[collidingClassId]

    return {
      label: objectClass.name,
      value: collidingClassId,
      textureId: objectClass.graphics.textureId,
      tint: objectClass.graphics.tint
    }
  }

  const value = Object.keys(objectClass.relations).map((relationId) => {
    const relation = objectClass.relations[relationId]
    return relation
  }).filter(({event, effect}) => {
    if(event.type === ON_COLLIDE && effect.type === EFFECT_COLLIDE) return true
    else return false
  }).map((relation) => {
    return relation.event.classId
  })

  console.log(value)

  const options = Object.keys(gameModel.classes).map(mapClassToOption)

  return <SelectChipsAuto 
    onChange={(event, classIds) => {
      onChange(event,  classIds)
    }}
    formLabel={formLabel}
    value={value}
    options={options}
  />
}

const mapStateToProps = (state) => {
  return {
    gameModel: state.game.gameModel,
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectColliders);
