/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectStepBehavior.scss';

import RadioGroupColumn from '../RadioGroupColumn/RadioGroupColumn';
import { instructionCategoryToStepBehaviors, stepBehaviorToDisplayName } from '../../constants';

const SelectStepBehavior = ({ onChange, value, instructionCategory, formLabel, disabled }) => {
  const mapControlsToOption = (stepBehavior) => {
    return {
      // icon: instructionData.icon,
      label: stepBehaviorToDisplayName[stepBehavior],
      value: stepBehavior
    }
  }

  // .filter((instructionCategory) => {
  //   return instructionCategoryToStepBehaviors[instructionCategory].isCreateable
  // })
  const options = instructionCategoryToStepBehaviors[instructionCategory].map(mapControlsToOption)

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
)(SelectStepBehavior);
