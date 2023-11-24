/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectEventType.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { eventInterfaceData } from '../../constants';

const SelectEventType = ({ onChange, value, formLabel, disabled}) => {
  const mapControlsToOption = (event) => {
    return {
      title: eventInterfaceData[event].name,
      subTitle: eventInterfaceData[event].description.general,
      value: event
    }
  }

  const options = Object.keys(eventInterfaceData).filter((eventType) => {
    // if(entityModelIdB !== entityModelIdA) {
    //   if(singleEntityEvents[eventType]) return false
    // } else if(entityModelIdA === entityModelIdB && eventType === ON_INTERACT) {
    //   return false
    // }

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
)(SelectEventType);
