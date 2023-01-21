/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectStage.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';

const SelectStage = ({ onChange, value, formLabel, gameModel}) => {

  const mapClassToOption = (stageId) => {
    const stage = gameModel.stages[stageId]

    return {
      label: stage.name,
      value: stageId,
    }
  }

  const options = Object.keys(gameModel.stages).map(mapClassToOption)

  return <SelectChipsAuto 
    onChange={(event, stages) => {
      onChange(event,  stages)
    }}
    formLabel={formLabel}
    value={value}
    options={options}
  />
}

const mapStateToProps = (state) => {
  return {
    gameModel: state.gameModel.gameModel,
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectStage);
