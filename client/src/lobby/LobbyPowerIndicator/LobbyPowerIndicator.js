/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Icon from '../../ui/Icon/Icon';
import { editGameSession } from '../../store/actions/gameSessionActions';

import './LobbyPowerIndicator.scss'
import Switch from '../../ui/Switch/Switch';

const LobbyPowerIndicator = ({
  gameSession : { gameSession, gameSession: { isPoweredOn, gameId }},
  editGameSession
}) => {
  return <div
    className="LobbyPowerIndicator"
    onClick={() => {
      if(!gameSession.gameId) return
      editGameSession(gameSession.id, {
        isPoweredOn: !isPoweredOn,
      })
    }}
  > 
    <Icon icon="faPowerOff"/>
    <Switch
      disabled={!gameId}
      size="small"
      checked={isPoweredOn}
    />
  </div>
};

const mapStateToProps = (state) => ({
  gameSession: state.gameSession,
});

export default compose(
  connect(mapStateToProps, { editGameSession }),
)(LobbyPowerIndicator);
