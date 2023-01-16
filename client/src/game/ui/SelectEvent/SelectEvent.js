/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectEvent.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { eventDisplayNames, getEventLabel, singleClassEvents } from '../../defaultData/relationship';
import { capitalize } from '../../../utils/utils';
import { getClassAandB } from '../../../utils/gameUtils';
import { ON_INTERACT } from '../../constants';

const SelectEvent = ({ onChange, value, formLabel, classIdB, disabled, classIdA }) => {
  const { classA, classB } = getClassAandB(classIdA, classIdB)

  const mapControlsToOption = (event) => {
    return {
      label: capitalize(getEventLabel(event, classA, classB)),
      value: event
    }
  }

  const options = Object.keys(eventDisplayNames).filter((eventType) => {
    if(classIdB !== classIdA) {
      if(singleClassEvents[eventType]) return false
    } else if(classIdA === classIdB && eventType === ON_INTERACT) {
      return false
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
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectEvent);
