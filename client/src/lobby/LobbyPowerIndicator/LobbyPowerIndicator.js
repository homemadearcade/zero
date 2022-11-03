/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Icon from '../../ui/Icon/Icon';
import { editLobby } from '../../store/actions/lobbyActions';

import './LobbyPowerIndicator.scss'
import Switch from '../../ui/Switch/Switch';

const LobbyPowerIndicator = ({
  lobby : { lobby, lobby: { isGamePoweredOn }},
  editLobby
}) => {
  return <div
    className="LobbyPowerIndicator"
    onClick={() => {
      editLobby(lobby.id, {
        isGamePoweredOn: !isGamePoweredOn,
        isGamePaused: false
      })
    }}
  > 
    <Icon icon="faPowerOff"/>
    <Switch
      size="small"
      checked={isGamePoweredOn}
    />
  </div>
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
});

export default compose(
  connect(mapStateToProps, { editLobby }),
)(LobbyPowerIndicator);
