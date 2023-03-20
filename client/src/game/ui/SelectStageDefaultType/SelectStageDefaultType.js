/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectStageDefaultType.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { stageDefaultTypeLabels, stageDefaultTypeProperties } from '../../constants';

const SelectStageDefaultType = ({ onChange, value, formLabel }) => {
  const mapControlsToOption = (stageDefaultType) => {
    return {
      label: stageDefaultTypeLabels[stageDefaultType],
      value: stageDefaultType
    }
  }

  const options = Object.keys(stageDefaultTypeLabels).map(mapControlsToOption)

  return <SelectChipsAuto 
    onChange={(event, descriptors) => {
      onChange(event, descriptors.map((stageDefaultType) => {
        return stageDefaultTypeProperties[stageDefaultType]
      }))
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
