/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectStage.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';

const SelectStage = ({ onChange, value, formLabel, gameModel: { gameModel }}) => {

  const mapEntityToOption = (stageId) => {
    const stage = gameModel.stages[stageId]

    return {
      title: stage.name,
      value: stageId,
      isRemoved: stage.isRemoved
    }
  }

  const options = Object.keys(gameModel.stages).map(mapEntityToOption)

  return <SelectChipsAuto 
    onChange={(event, stages) => {
      onChange(event,  stages)
    }}
    hideRemoved
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
)(SelectStage);
