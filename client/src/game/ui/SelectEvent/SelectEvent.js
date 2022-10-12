/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectEvent.scss';
import SelectChipsAuto from '../../../app/ui/SelectChipsAuto/SelectChipsAuto';
import { eventDisplayNames, eventPrefix, getEventLabel } from '../../../defaultData/relationship';
import { capitalize } from '../../../utils/utils';

const SelectEvent = ({ onChange, value, formLabel, agentClassId, disabled, classId, game: { gameModel } }) => {
  const objectClass = gameModel.classes[classId]
  const agentClass = gameModel.classes[agentClassId]

  const mapControlsToOption = (event) => {
    return {
      label: capitalize(getEventLabel(event, objectClass, agentClass)),
      value: event
    }
  }

  const options = Object.keys(eventDisplayNames).map(mapControlsToOption)

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
