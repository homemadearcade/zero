/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectClass.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { PLAYER_CLASS, PLAYER_INSTANCE_ID_PREFIX } from '../../constants';
import { classTypeToDisplayName } from '../../constants';

const SelectClass = ({ onChange, disabled, value, formLabel, gameModel, classType, includePlayerInstance }) => {

  const mapClassToOption = (entityClassId) => {
    const entityClass = gameModel.entityClasses[entityClassId]
    return {
      label: entityClass.name,
      value: entityClassId,
      textureId: entityClass.graphics.textureId,
      textureTint: entityClass.graphics.textureTint,
      isRemoved: entityClass.isRemoved,
      classInterfaceCategory: entityClass.classInterfaceCategory
    }
  }

  const options = Object.keys(gameModel.entityClasses).filter((entityClassId) => {
    const entityClass = gameModel.entityClasses[entityClassId]
    // if(entityClass.isRemoved) return false
    if(!classType) return true
    if(classType === entityClass.classInterfaceCategory) return true
    return false
  }).map(mapClassToOption)


  options.sort((a, b) => -b.classInterfaceCategory.localeCompare(a.classInterfaceCategory))

  return <SelectChipsAuto 
    disabled={disabled}
    onChange={(event, descriptors) => {
      onChange(event,  descriptors)
    }}
    groupBy={option => {
      return classTypeToDisplayName[option.classInterfaceCategory]
    }}
    hideRemoved
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
