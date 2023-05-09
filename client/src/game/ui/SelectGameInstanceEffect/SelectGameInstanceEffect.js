/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectGameInstanceEffect.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { getEffectData } from '../../../utils';

const SelectGameInstanceEffect = ({ onChange, value, eventType, formLabel, disabled, gameModel}) => {
  const mapControlsToOption = (effectId) => {
    const effect = gameModel.effects[effectId]

    const { 
      title, 
      icon, 
      subTitle,
      group,
      isRemoved,
      textureId,
      textureTint
    } = getEffectData(effect, eventType, gameModel)

    return {
      subTitle: subTitle,
      title: title,
      value: effectId,
      subTitleTextureId: textureId,
      subTitleTextureTint: textureTint,
      icon: icon,
      isRemoved,
      group
    }
  }

  const options = Object.keys(gameModel.effects).map(mapControlsToOption).filter((option) => !!option)

  options.sort((a, b) => {
    return -b.group.localeCompare(a.group)
  })

  console.log(disabled)

  return <SelectChipsAuto 
    disabled={disabled}
    onChange={onChange}
    formLabel={formLabel}
    value={value}
    domId={'SelectGameInstanceEffect'}
    groupBy={option => {
      return option.group
    }}
    hideRemoved
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
)(SelectGameInstanceEffect);
