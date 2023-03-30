/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Icon from '../../../ui/Icon/Icon';
import { editGameRoom } from '../../../store/actions/game/gameRoomInstanceActions';

import './GameRoomPowerIndicator.scss'
import Switch from '../../../ui/Switch/Switch';

const GameRoomPowerIndicator = ({
  gameRoomInstance : { gameRoomInstance, gameRoomInstance: { isPoweredOn, gameId }},
  editGameRoom
}) => {
  return <div
    className="GameRoomPowerIndicator"
  > 
    <Icon icon="faPowerOff"/>
    <Switch
      disabled={!gameId}
      size="small"
      checked={isPoweredOn}
      onChange={() => {
        if(!gameRoomInstance.gameId) return
        editGameRoom(gameRoomInstance.id, {
          isPoweredOn: !isPoweredOn,
        })
      }}
    />
  </div>
};

const mapStateToProps = (state) => ({
  gameRoomInstance: state.gameRoomInstance,
});

export default compose(
  connect(mapStateToProps, { editGameRoom }),
)(GameRoomPowerIndicator);
