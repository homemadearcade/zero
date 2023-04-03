import React, { useState } from 'react';
import { connect } from 'react-redux';

import Button from '../../../../ui/Button/Button';
import Icon from '../../../../ui/Icon/Icon';
import Dialog from '../../../../ui/Dialog/Dialog';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import { generateUniqueId } from '../../../../utils';
import { LOBBY_ID_PREFIX } from '../../../../constants';
import LobbyForm from '../LobbyForm/LobbyForm';

const LobbyAddForm = ({ onSubmit, defaultValues = {}}) => {
  const [isLobbyAddOpen, setIsLobbyAddOpen] = useState(false)

  const { handleSubmit, reset, control, formState: { isValid }, register, setValue } = useForm({
    defaultValues: {
      name: '',
      ...defaultValues
    },
  });

  const submit = async (data) => {
    if(onSubmit) onSubmit(data)
    reset();
    setIsLobbyAddOpen(false)
  }

  return (
    <div className="LobbyAddForm">
      <Button onClick={() => {
        setIsLobbyAddOpen(true)
        setValue('lobbyId', LOBBY_ID_PREFIX + generateUniqueId())
      }} startIcon={<Icon icon="faPlus"/>} type="submit" size="wide" className="btn">New Lobby</Button>
      <Dialog onClose={() => {
        setIsLobbyAddOpen(false)
      }} open={isLobbyAddOpen}>
        <DialogTitle>New Lobby</DialogTitle>
        <DialogContent>
          <LobbyForm control={control} register={register} />
        </DialogContent>
        <DialogActions>
          <Button type="submit" disabled={!isValid} onClick={handleSubmit(submit)}>Add Lobby</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, { })(LobbyAddForm);
