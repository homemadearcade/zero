/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectCutscene.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';

const SelectCutscene = ({ onChange, value, formLabel, gameModel}) => {

  const mapClassToOption = (cutsceneId) => {
    const cutscene = gameModel.cutscenes[cutsceneId]

    return {
      label: cutscene.name,
      value: cutsceneId,
    }
  }

  const options = Object.keys(gameModel.cutscenes).map(mapClassToOption)

  return <SelectChipsAuto 
    onChange={(event, cutscenes) => {
      onChange(event,  cutscenes)
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
)(SelectCutscene);
