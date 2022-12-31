/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectClass.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { HERO_CLASS } from '../../constants';

const SelectClass = ({ onChange, value, formLabel, gameModel, classType, includePlayerClass }) => {

  const mapClassToOption = (classId) => {
    const objectClass = gameModel.classes[classId]

    return {
      label: objectClass.name,
      value: classId,
      textureId: objectClass.graphics.textureId,
      tint: objectClass.graphics.tint
    }
  }

  const options = Object.keys(gameModel.classes).filter((classId) => {
    const objectClass = gameModel.classes[classId]
    if(!classType) return true
    if(classType === objectClass.type) return true
    return false
  }).map(mapClassToOption)

  if(includePlayerClass) {
    console.log('xx')
    options.push({
      label: 'Player',
      value: HERO_CLASS
    })
  }

  return <SelectChipsAuto 
    onChange={(event, descriptors) => {
      onChange(event,  descriptors)
    }}
    formLabel={formLabel}
    value={value}
    options={options}
  />
}

const mapStateToProps = (state) => {
  return {
    gameModel: state.gameModel.gameModel,
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectClass);
