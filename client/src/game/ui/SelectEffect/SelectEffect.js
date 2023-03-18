/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectEffect.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { effectDisplayNames, getEffectShorthand, isUseableEffect} from '../../constants'

const SelectEffect = ({ eventType, onChange, value, formLabel, disabled, gameModel}) => {
  const mapControlsToOption = (effectId) => {
    const effect = gameModel.effects[effectId]

    return {
      label: getEffectShorthand(effect),
      value: effectId,
      isRemoved: effect.isRemoved,
      type: effectDisplayNames[effect.type]
    }
  }

  const options = Object.keys(gameModel.effects).filter((effectId) => {
    // const effect = gameModel.effects[effectId]
    // if(isUseableEffect(effect.type, eventType)) return true
    // return false
    return true
  }).map(mapControlsToOption)

  // const useableValue = value.filter((effectId) => {
  //   const effect = gameModel.effects[effectId]
  //   return isUseableEffect(effect.type, eventType)
  // })

  options.sort((a, b) => -b.type.localeCompare(a.type))

  return <SelectChipsAuto 
    disabled={disabled}
    onChange={onChange}
    formLabel={formLabel}
    value={value}
    groupBy={option => {
      return option.type
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
