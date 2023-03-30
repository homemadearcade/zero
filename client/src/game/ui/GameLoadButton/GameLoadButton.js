/* eslint-disable react-hooks/exhaustive-deps */
import { DialogContent, DialogTitle } from '@mui/material';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { editGameRoom } from '../../../store/actions/game/gameRoomInstanceActions';
import Button from '../../../ui/Button/Button';
import SelectArcadeGame from '../../../ui/connected/SelectArcadeGame/SelectArcadeGame';
import Dialog from '../../../ui/Dialog/Dialog';

const GameLoadButton = ({
  userMongoId,
  gameRoomInstance: { gameRoomInstance },
  editGameRoom
}) => {
  const [isLoadGameModelOpen, setIsLoadGameModelOpen] = useState()

  return <>
    {isLoadGameModelOpen && <Dialog open onClose={() => {
      setIsLoadGameModelOpen(false)
    }}>
      <DialogTitle>Load Game</DialogTitle>
      <DialogContent sx={{width: '200px', height: '200px'}}>
        <SelectArcadeGame userMongoId={userMongoId} onSelect={(games) => {
          setIsLoadGameModelOpen(false)
          editGameRoom(gameRoomInstance.id, {
            arcadeGameMongoId: games[games.length-1]
          })
        }}>
        </SelectArcadeGame>
      </DialogContent>
    </Dialog>}
    <Button onClick={() => {
      setIsLoadGameModelOpen(true)
    }}>Load Game</Button>
  </>
};

const mapStateToProps = (state) => ({
  gameRoomInstance: state.gameRoomInstance
});

export default compose(
  connect(mapStateToProps, { editGameRoom }),
)(GameLoadButton);
