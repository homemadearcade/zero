/* eslint-disable react-hooks/exhaustive-deps */
import { DialogContent, DialogTitle } from '@mui/material';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { editGameRoom } from '../../../store/actions/gameRoomActions';
import Button from '../../../ui/Button/Button';
import SelectGame from '../../../ui/connected/SelectGame/SelectGame';
import Dialog from '../../../ui/Dialog/Dialog';

const GameLoadButton = ({
  userId,
  gameRoom: { gameRoom },
  editGameRoom
}) => {
  const [isLoadGameModelOpen, setIsLoadGameModelOpen] = useState()

  return <>
    {isLoadGameModelOpen && <Dialog open onClose={() => {
      setIsLoadGameModelOpen(false)
    }}>
      <DialogTitle>Load Game</DialogTitle>
      <DialogContent sx={{width: '200px', height: '200px'}}>
        <SelectGame userId={userId} onSelect={(games) => {
          setIsLoadGameModelOpen(false)
          editGameRoom(gameRoom.id, {
            gameId: games[games.length-1]
          })
        }}>
        </SelectGame>
      </DialogContent>
    </Dialog>}
    <Button onClick={() => {
      setIsLoadGameModelOpen(true)
    }}>Load Game</Button>
  </>
};

const mapStateToProps = (state) => ({
  gameRoom: state.gameRoom
});

export default compose(
  connect(mapStateToProps, { editGameRoom }),
)(GameLoadButton);
