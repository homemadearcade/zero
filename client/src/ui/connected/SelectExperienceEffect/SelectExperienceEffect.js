/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import SelectChipsAuto from '../../SelectChipsAuto/SelectChipsAuto';
import { experienceEffectInterfaceIdData, EXPERIENCE_EFFECT_GAME_ACTION, instructionCategoryToExperienceEffects } from '../../../constants/experience';
import { effectInterfaceDatas, EFFECT_INTERFACE_ACTION, EFFECT_INTERFACE_UNLOCK, getEffectShorthand, isUseableEffect, ON_STEP_BEGINS } from '../../../game/constants';

const SelectExperienceEffect = ({ arcadeGameMongoId, instructionCategory, onChange, disabled, value, formLabel, experienceModel: { experienceModel }, gameModel }) => {

  const mapEffectToOption = (experienceEffectId) => {
    const experienceEffect = experienceModel.experienceEffects[experienceEffectId]
    const experienceEffectInterfaceData = experienceEffectInterfaceIdData[experienceEffect.experienceEffectBehavior]
    let title = experienceEffect.title || experienceEffectInterfaceData.displayName
    const subTitle = experienceEffect.subTitle || experienceEffectInterfaceData.subTitle
    let group = experienceEffect.customSelectorCategory || experienceEffectInterfaceData.displayName
    let icon = experienceEffect.icon || experienceEffectInterfaceData.icon
    let isRemoved = experienceEffect.isRemoved
    
    // if(instructionCategoryToExperienceEffects[instructionCategory].indexOf(experienceEffect.experienceEffectBehavior) === -1) return null

    console.log('SelectExperienceEffect', experienceEffect.arcadeGameMongoId, arcadeGameMongoId, experienceEffect.arcadeGameMongoId !== arcadeGameMongoId)
    if(experienceEffect.experienceEffectBehavior === EXPERIENCE_EFFECT_GAME_ACTION && (!arcadeGameMongoId ||  experienceEffect.arcadeGameMongoId !== arcadeGameMongoId)) {
      return null
    } else {
      if(experienceEffect.experienceEffectBehavior === EXPERIENCE_EFFECT_GAME_ACTION) {
        const effect = gameModel.gameModel.effects[experienceEffect.effectId]
        if(effect.effectBehavior !== EFFECT_INTERFACE_ACTION && effect.effectBehavior !== EFFECT_INTERFACE_UNLOCK) {
          title = getEffectShorthand(effect)
          const effectInterfaceData = effectInterfaceDatas[effect.effectBehavior]
          icon = effect.icon || effectInterfaceData.icon
          group = effect.customSelectorCategory || effectInterfaceData.displayName
          isRemoved = effect.isRemoved || !isUseableEffect(effect, effect.effectBehavior, ON_STEP_BEGINS)
        }
      }
    }

    return {
      labelTitle: title,
      label: subTitle,
      icon: icon,
      value: experienceEffectId,
      group: group,
      isRemoved: isRemoved
    }
  }

  console.log('SelectExperienceEffect', experienceModel.experienceEffects, value)

  const options = Object.keys(experienceModel.experienceEffects).map(mapEffectToOption).filter((o) => {
    return !!o
  })

  options.sort((a, b) => {
    return -b.group.localeCompare(a.group)
  })

  return <SelectChipsAuto 
    disabled={disabled}
    onChange={(event, experienceEffectIds) => {
      onChange(experienceEffectIds)
    }}
    groupBy={(option) => option.group}
    formLabel={formLabel}
    value={value}
    hideRemoved
    options={options}
  />
}

const mapStateToProps = (state) => {
  return {
    experienceModel: state.experienceModel,
    gameModel: state.gameModel
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectExperienceEffect);