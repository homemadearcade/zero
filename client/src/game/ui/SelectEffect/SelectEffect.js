/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectEffect.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { effectInterfaceDatas, getEffectShorthand, isUseableEffect } from '../../constants'

const SelectEffect = ({ onChange, value, eventType, formLabel, disabled, gameModel}) => {
  const mapControlsToOption = (effectId) => {
    const effect = gameModel.effects[effectId]
    const effectInterfaceData = effectInterfaceDatas[effect.effectBehavior]

    return {
      label: effect.subTitle,
      value: effectId,
      labelTitle: effect.title || getEffectShorthand(effect),
      icon: effect.icon || effectInterfaceData.icon,
      isRemoved: effect.isRemoved || !isUseableEffect(effect, effect.effectBehavior, eventType),
      group: effect.customSelectorCategory || effectInterfaceData.displayName
    }
  }

  const options = Object.keys(gameModel.effects).map(mapControlsToOption)

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
)(SelectEffect);
