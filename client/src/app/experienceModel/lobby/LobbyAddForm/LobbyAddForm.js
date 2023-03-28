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

const ExperienceLobbyAddForm = ({ onSubmit, defaultValues = {}}) => {
  const [isLobbyAddOpen, setIsLobbyAddOpen] = useState(false)

  const { handleSubmit, reset, control, formState: { isValid }, register } = useForm({
    defaultValues: {
      name: '',
      lobbyId: LOBBY_ID_PREFIX + generateUniqueId(),
      ...defaultValues
    },
  });

  const submit = async (data) => {
    if(onSubmit) onSubmit(data)
    reset();
    setIsLobbyAddOpen(false)
  }

  return (
    <div className="ExperienceLobbyAddForm">
      <Button onClick={() => {
        setIsLobbyAddOpen(true)
      }} startIcon={<Icon icon="faPlus"/>} type="submit" size="wide" className="btn">New Lobby</Button>
      <Dialog onClose={() => {
        setIsLobbyAddOpen(false)
      }} open={isLobbyAddOpen}>
        <DialogTitle>New Lobby</DialogTitle>
        <DialogContent>
          <form>
            <LobbyForm control={control} register={register} />
          </form>
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

export default connect(mapStateToProps, { })(ExperienceLobbyAddForm);
