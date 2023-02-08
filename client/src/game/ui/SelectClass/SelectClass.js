/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectClass.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { PLAYER_CLASS, PLAYER_INSTANCE_ID_PREFIX } from '../../constants';

const SelectClass = ({ onChange, disabled, value, formLabel, gameModel, classType, includePlayerInstance }) => {

  const mapClassToOption = (classId) => {
    const objectClass = gameModel.classes[classId]

    return {
      label: objectClass.name,
      value: classId,
      textureId: objectClass.graphics.textureId,
      tint: objectClass.graphics.tint,
      isRemoved: objectClass.isRemoved
    }
  }

  const options = Object.keys(gameModel.classes).filter((classId) => {
    const objectClass = gameModel.classes[classId]
    // if(objectClass.isRemoved) return false
    if(!classType) return true
    if(classType === objectClass.type) return true
    return false
  }).map(mapClassToOption)

  if(includePlayerInstance) {
    options.push({
      label: 'Player',
      value: PLAYER_INSTANCE_ID_PREFIX
    })
  }

  return <SelectChipsAuto 
    disabled={disabled}
    onChange={(event, descriptors) => {
      onChange(event,  descriptors)
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
