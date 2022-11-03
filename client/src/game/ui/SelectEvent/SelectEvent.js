/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectEvent.scss';
import SelectChipsAuto from '../../../components/ui/SelectChipsAuto/SelectChipsAuto';
import { eventDisplayNames, getEventLabel, singleClassEvents } from '../../../defaultData/relationship';
import { capitalize } from '../../../utils/utils';

const SelectEvent = ({ onChange, value, formLabel, classIdB, disabled, classIdA, game: { gameModel } }) => {
  const classA = gameModel.classes[classIdA]
  const classB = gameModel.classes[classIdB]

  const mapControlsToOption = (event) => {
    return {
      label: capitalize(getEventLabel(event, classA, classB)),
      value: event
    }
  }

  const options = Object.keys(eventDisplayNames).filter((eventType) => {
    if(classIdB !== classIdA) {
      if(singleClassEvents[eventType]) return false
    }

    return true
  }).map(mapControlsToOption)

  return <SelectChipsAuto 
    disabled={disabled}
    onChange={onChange}
    formLabel={formLabel}
    value={value}
    options={options}
  />
}

const mapStateToProps = (state) => {
  return {
    game: state.game,
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectEvent);
