/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

// import { gameRoomToInterfaceData } from '../../../constants';
import SelectChipsAuto from '../../SelectChipsAuto/SelectChipsAuto';

const SelectGameRoom = ({ onSelect, value, formLabel, disabled, experienceModel: { experienceModel } }) => {
  const mapControlsToOption = (gameRoomId) => {
   const gameRoom = experienceModel.gameRooms[gameRoomId]
    return {
      label: gameRoom.name,
      // icon: 'faDoorOpen',
      value: gameRoom.gameRoomId,
      isRemoved: gameRoom.isRemoved && !gameRoom.isNotRemoveable
    }
  }

  const options = Object.keys(experienceModel.gameRooms).map(mapControlsToOption)

 return <SelectChipsAuto
    onChange={(event, gameRooms) => {
      onSelect(gameRooms)
    }}
    disabled={disabled}
    hideRemoved
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
)(SelectGameRoom);
