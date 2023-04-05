/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectStageDefaultType.scss';
import { stageDefaultTypeLabels, stageDefaultTypeProperties } from '../../constants';
import RadioGroupColumn from '../../../ui/RadioGroupColumn/RadioGroupColumn';

const SelectStageDefaultType = ({ onChange, value, formLabel }) => {
  const mapControlsToOption = (stageDefaultType) => {
    return {
      label: stageDefaultTypeLabels[stageDefaultType],
      value: stageDefaultType
    }
  }

  const options = Object.keys(stageDefaultTypeLabels).map(mapControlsToOption)

  return <RadioGroupColumn
    onChange={(event) => {
      onChange(stageDefaultTypeProperties[event.target.value])
    }}
    formLabel={formLabel}
    value={value}
    options={options}
  />
}

const mapStateToProps = (state) => {
  return {
    // gameModel: state.gameModel.gameModel,
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectStageDefaultType);
