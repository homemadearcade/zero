/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectClass.scss';
import SelectChipsAuto from '../../../app/ui/SelectChipsAuto/SelectChipsAuto';
import { getClassDisplayName } from '../../../utils/gameUtils';

const SelectClass = ({ onChange, value, formLabel, gameModel}) => {

  const mapClassToOption = (classId) => {
    const objectClass = gameModel.classes[classId]

    return {
      label: getClassDisplayName(objectClass, classId),
      value: classId
    }
  }

  const options = Object.keys(gameModel.classes).map(mapClassToOption)

  return <SelectChipsAuto 
    onChange={(event, descriptors) => {
      onChange(event,  descriptors)
    }}
    formLabel={formLabel}
    value={value}
    options={options}
  />
}

const mapStateToProps = (state) => {
  return {
    gameModel: state.game.gameModel,
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectClass);
