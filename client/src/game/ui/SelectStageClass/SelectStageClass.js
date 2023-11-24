/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectStageClass.scss';
import RadioGroupColumn from '../../../ui/RadioGroupColumn/RadioGroupColumn';
import { stageClassIIDLabels, stageClassIIDProperties } from '../../constants';

const SelectStageClass = ({ onChange, value, formLabel, gameModel: { gameModel } }) => {

  const stageClasses = gameModel?.stageClasses

  const mapControlsToOption = (stageClassIID) => {
    return {
      label: stageClassIIDLabels[stageClassIID],
      value: stageClassIID
    }
  }

  const options = Object.keys(stageClasses).map(mapControlsToOption)

  return <RadioGroupColumn
    onChange={(event) => {
      onChange(stageClassIIDProperties[event.target.value])
    }}
    formLabel={formLabel}
    value={value}
    options={options}
  />
}

const mapStateToProps = (state) => {
  return {
    gameModel: state.gameModel,
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectStageClass);
