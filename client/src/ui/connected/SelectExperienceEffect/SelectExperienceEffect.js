/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import SelectChipsAuto from '../../SelectChipsAuto/SelectChipsAuto';
import { experienceEffectInterfaceIdData, EXPERIENCE_EFFECT_GAME_EFFECT, instructionCategoryToExperienceEffects } from '../../../constants/experience/experienceEffect';

const SelectExperienceEffect = ({ arcadeGameMongoId, instructionCategory, onChange, disabled, value, formLabel, experienceModel: { experienceModel } }) => {

  const mapEffectToOption = (experienceEffectId) => {
    const experienceEffect = experienceModel.experienceEffects[experienceEffectId]
    const experienceEffectInterfaceData = experienceEffectInterfaceIdData[experienceEffect.experienceEffectBehavior]
    const title = experienceEffect.title || experienceEffectInterfaceData.displayName
    const subTitle = experienceEffect.subTitle || experienceEffectInterfaceData.subTitle

    if(instructionCategoryToExperienceEffects[instructionCategory].indexOf(experienceEffect.experienceEffectBehavior) === -1) return null

    if(experienceEffect.experienceEffectBehavior === EXPERIENCE_EFFECT_GAME_EFFECT && (!arcadeGameMongoId ||  experienceEffect.arcadeGameMongoId !== arcadeGameMongoId)) {
      return null
    }

    return {
      labelTitle: title,
      label: subTitle,
      icon: experienceEffectInterfaceData.icon || experienceEffectInterfaceData.icon,
      value: experienceEffectId,
      group: experienceEffect.customSelectorCategory || experienceEffectInterfaceData.displayName
    }
  }

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
    options={options}
  />
}

const mapStateToProps = (state) => {
  return {
    experienceModel: state.experienceModel,
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectExperienceEffect);