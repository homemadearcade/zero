import React, { useState } from 'react';
import { connect } from 'react-redux';

import Button from '../../../../ui/Button/Button';
import Icon from '../../../../ui/Icon/Icon';
import Dialog from '../../../../ui/Dialog/Dialog';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import { generateUniqueId } from '../../../../utils';
import GameRoomForm from '../GameRoomForm/GameRoomForm';
import { GAME_ROOM_ID_PREFIX } from '../../../../constants/experience/gameRoom';

const GameRoomAddForm = ({ onSubmit, defaultValues = {}}) => {
  const [isGameRoomAddOpen, setIsGameRoomAddOpen] = useState(false)

  const { handleSubmit, reset, trigger, control, formState: { isValid }, register, setValue } = useForm({
    defaultValues: {
      name: '',
      isAutosaveDisabled: true,
      ...defaultValues
    },
  });

  const submit = async (data) => {
    if(onSubmit) onSubmit(data)
    reset();
    setIsGameRoomAddOpen(false)
  }
  return (
    <div className="GameRoomAddForm">
      <Button onClick={() => {
        setIsGameRoomAddOpen(true)
        setValue('gameRoomId', GAME_ROOM_ID_PREFIX + generateUniqueId())
      }} startIcon={<Icon icon="faPlus"/>} type="submit" size="wide" className="btn">New GameRoom</Button>
      <Dialog onClose={() => {
        setIsGameRoomAddOpen(false)
      }} open={isGameRoomAddOpen}>
        <DialogTitle>New GameRoom</DialogTitle>
        <DialogContent>
          <GameRoomForm trigger={trigger} setValue={setValue} control={control} register={register} />
        </DialogContent>
        <DialogActions>
          <Button type="submit" disabled={!isValid} onClick={handleSubmit(submit)}>Add GameRoom</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, { })(GameRoomAddForm);
