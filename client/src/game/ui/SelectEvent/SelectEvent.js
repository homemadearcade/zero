/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectRelationTag.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';

const SelectEvent = ({ onChange, disabled, value, formLabel, gameModel }) => {

  const mapTagToOption = (eventId) => {
    const event = gameModel.events[eventId]
    return {
      title: event.name,
      value: eventId,
    }
  }

  const options = Object.keys(gameModel.events).filter((eventId) => {
    const event = gameModel.events[eventId]
    if(event.isRemoved) return false
    return true
  }).map(mapTagToOption)

  return <SelectChipsAuto 
    disabled={disabled}
    onChange={(event, visualTags) => {
      onChange(event,  visualTags)
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
)(SelectEvent);
