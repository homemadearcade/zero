/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectLobbyActivity.scss';

import { activityToInterfaceData } from '../../constants';
import RadioGroupColumn from '../RadioGroupColumn/RadioGroupColumn';

const SelectLobbyActivity = ({ onChange, value, formLabel, disabled, lobbyId, experienceModel: { experienceModel } }) => {
  const mapControlsToOption = (activityId) => {
   const activity = experienceModel.activitys[activityId]
    return {
      label: activity.name,
      icon: activityToInterfaceData[activity.activityCategory].icon,
      value: activity.activityId,
    }
  }

  const lobby = experienceModel.lobbys[lobbyId]
  const options = Object.keys(lobby.activitys).map(mapControlsToOption)

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
    experienceModel: state.experienceModel,
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectLobbyActivity);
