/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectCutscene.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';

const SelectCutscene = ({ onChange, value, formLabel, gameModel}) => {

  const mapEntityToOption = (cutsceneId) => {
    const cutscene = gameModel.cutscenes[cutsceneId]

    return {
      title: cutscene.name,
      value: cutsceneId,
      isRemoved: cutscene.isRemoved
    }
  }

  const options = Object.keys(gameModel.cutscenes).map(mapEntityToOption)

  return <SelectChipsAuto 
    onChange={(event, cutscenes) => {
      onChange(event,  cutscenes)
    }}
    hideRemoved
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
)(SelectCutscene);
