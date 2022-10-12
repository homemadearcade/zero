/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectEvent.scss';
import SelectChipsAuto from '../../../app/ui/SelectChipsAuto/SelectChipsAuto';
import { eventDisplayNames, eventPrefix } from '../../../defaultData/relationship';

const SelectEvent = ({ onChange, value, formLabel, agentClassId, classId, game: { gameModel } }) => {
  const objectClass = gameModel.classes[classId]
  const agentClass = gameModel.classes[agentClassId]

  function getPrefix(event) {
    if(eventPrefix[event] === 'Both' && agentClassId) {
      return objectClass.name + ' and ' + agentClass.name
    } else if(eventPrefix[event] === 'Class') {
      return objectClass.name + ' is'
    } else if(eventPrefix[event] === 'Agent') {
      return agentClass.name + ' is'
    }

    return ''
  }


  const mapControlsToOption = (event) => {
    return {
      label: 'When ' + getPrefix(event) + ' ' + eventDisplayNames[event],
      value: event
    }
  }

  const options = Object.keys(eventDisplayNames).map(mapControlsToOption)

  return <SelectChipsAuto 
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
