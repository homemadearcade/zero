/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectInstructionCategory.scss';

import { instructionToInterfaceData } from '../../constants';
import RadioGroupColumn from '../RadioGroupColumn/RadioGroupColumn';

const SelectInstructionCategory = ({ onChange, value, formLabel, disabled }) => {
  const mapControlsToOption = (instructionCategory) => {
    const instructionData = instructionToInterfaceData[instructionCategory]
    return {
      icon: instructionData.icon,
      label: instructionData.displayName,
      value: instructionCategory
    }
  }

  // .filter((instructionCategory) => {
  //   return instructionToInterfaceData[instructionCategory].isCreateable
  // })
  const options = Object.keys(instructionToInterfaceData).map(mapControlsToOption)

  return <RadioGroupColumn
    disabled={disabled}
    onChange={onChange}
    formLabel={formLabel}
    value={value}
    options={options}
  />
}

const mapStateToProps = (state) => {
  return {
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectInstructionCategory);
