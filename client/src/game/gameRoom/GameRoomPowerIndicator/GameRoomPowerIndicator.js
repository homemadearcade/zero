/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Icon from '../../../ui/Icon/Icon';
import { editGameRoom } from '../../../store/actions/gameRoomActions';

import './GameRoomPowerIndicator.scss'
import Switch from '../../../ui/Switch/Switch';

const GameRoomPowerIndicator = ({
  gameRoom : { gameRoom, gameRoom: { isPoweredOn, gameId }},
  editGameRoom
}) => {
  return <div
    className="GameRoomPowerIndicator"
    onClick={() => {
      if(!gameRoom.gameId) return
      editGameRoom(gameRoom.id, {
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
  gameRoom: state.gameRoom,
});

export default compose(
  connect(mapStateToProps, { editGameRoom }),
)(GameRoomPowerIndicator);
