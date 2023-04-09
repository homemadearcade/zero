/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectActivity.scss';

import { activityToInterfaceData } from '../../../constants';
import RadioGroupColumn from '../../RadioGroupColumn/RadioGroupColumn';

const SelectActivity = ({ onChange, value, formLabel, disabled, lobbyInstance: { lobbyInstance } }) => {
  const mapActivitysToOption = (activityId) => {
    const activity = lobbyInstance.activitys[activityId]
    const activityData = activityToInterfaceData[activity.activityCategory]
    return {
      icon: activityData.icon,
      label: activity.name,
      value: activityId
    }
  }

  const options = Object.keys(lobbyInstance.activitys).map(mapActivitysToOption)

  return <RadioGroupColumn
    disabled={disabled}
    onChange={onChange}
    formLabel={formLabel}
    value={value}
    options={options}
  />
}

const mapStateToProps = (state) => {
  return {
    lobbyInstance: state.lobbyInstance,
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectActivity);
