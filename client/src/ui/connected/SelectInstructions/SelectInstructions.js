/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectInstructions.scss';

import { instructionToInterfaceData } from '../../../constants';
import SelectChipsAuto from '../../SelectChipsAuto/SelectChipsAuto';

const SelectInstructions = ({ onSelect, arcadeGameMongoId,  value, formLabel, disabled, instructionCategory, experienceModel: { experienceModel } }) => {
  const mapControlsToOption = (instructionId) => {
   const instruction = experienceModel.instructions[instructionId]
    return {
      label: instruction.name,
      icon: instructionToInterfaceData[instruction.instructionCategory].icon,
      value: instruction.instructionId,
      isRemoved: instruction.isRemoved && !instruction.isNotRemoveable
    }
  }

  const options = Object.keys(experienceModel.instructions).filter((instructionId) => {
    const instruction = experienceModel.instructions[instructionId]
    if(instructionCategory !== undefined && instructionCategory !== instruction.instructionCategory) return false
    if(arcadeGameMongoId !== undefined && arcadeGameMongoId !== instruction.arcadeGameMongoId) return false
    return true
  }).map(mapControlsToOption)

 return <SelectChipsAuto
    onChange={(event, instructions) => {
      onSelect(instructions)
    }}
    disabled={disabled}
    hideRemoved
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
)(SelectInstructions);
