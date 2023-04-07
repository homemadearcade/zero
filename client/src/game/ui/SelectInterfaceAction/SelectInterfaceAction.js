/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectInterfaceAction.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { effectInterfaceDatas, EFFECT_INTERFACE_ACTION, EFFECT_INTERFACE_UNLOCK, getEffectShorthand, isUseableEffect } from '../../constants'

const SelectInterfaceAction = ({ onChange, value, eventType, formLabel, disabled, gameModel}) => {
  const mapControlsToOption = (effectId) => {
    const effect = gameModel.effects[effectId]
    const effectInterfaceData = effectInterfaceDatas[effect.effectBehavior]

    if(effect.effectBehavior !== EFFECT_INTERFACE_ACTION && effect.effectBehavior !== EFFECT_INTERFACE_UNLOCK) return null

    return {
      label: effect.subTitle || getEffectShorthand(effect),
      value: effectId,
      labelTitle: effect.title,
      subTextureId: effect.textureId,
      subTextureTint: effect.textureTint,
      icon: effect.icon || effectInterfaceData.icon,
      isRemoved: effect.isRemoved || !isUseableEffect(effect, effect.effectBehavior, eventType),
      group: effect.customSelectorCategory || effectInterfaceData.displayName
    }
  }

  const options = Object.keys(gameModel.effects).map(mapControlsToOption).filter((option) => !!option)

  options.sort((a, b) => {
    const value =  -b.group.localeCompare(a.group)
    if(value === 0) {
      if (a.label < b.label) {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }
    }
    return value
  })

  return <SelectChipsAuto 
    disabled={disabled}
    onChange={onChange}
    formLabel={formLabel}
    value={value}
    groupBy={option => {
      return option.group
    }}
    domId="SelectInterfaceAction"
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
)(SelectInterfaceAction);
