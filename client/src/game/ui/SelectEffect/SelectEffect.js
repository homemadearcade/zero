/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectEffect.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { isUseableEffect} from '../../constants'

const SelectEffect = ({ eventType, onChange, value, formLabel, disabled, gameModel}) => {
  const mapControlsToOption = (effect) => {
    return {
      label: effect,
      value: effect
    }
  }

  const options = Object.keys(gameModel.effects).filter((effectId) => {
    const effect = gameModel.effects[effectId]
    if(isUseableEffect(effect.type, eventType)) return true
    return false
  }).map(mapControlsToOption)

  const useableValue = value.filter((effectId) => {
    const effect = gameModel.effects[effectId]
    return isUseableEffect(effect.type, eventType)
  })

  return <SelectChipsAuto 
    disabled={disabled}
    onChange={onChange}
    formLabel={formLabel}
    value={useableValue}
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
