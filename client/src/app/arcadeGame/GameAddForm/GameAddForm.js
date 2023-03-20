import React, { useState } from 'react';
import { connect } from 'react-redux';

import { addArcadeGame } from '../../../store/actions/arcadeGameActions';

import './styles.css';
import Button from '../../../ui/Button/Button';
import Icon from '../../../ui/Icon/Icon';
import Dialog from '../../../ui/Dialog/Dialog';
import { DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import SelectUsers from '../../../ui/connected/SelectUsers/SelectUsers';

const GameAddForm = ({ addArcadeGame, onSubmit, auth: { me }, defaultValues = {} }) => {
  const [isAddGameFormOpen, setIsAddGameFormOpen] = useState(false)

  const { handleSubmit, reset, control } = useForm({
    defaultValues: {
      player: {},
      stages: {},
      defaults: {},
      metadata: {},
      tags: {},
      entityClasses: {},
      brushes: {},
      colors: {},
      canvasImages: {},
      userId: me.id,
      ...defaultValues
    },
  });

  const submit = async (data) => {
    const gameResponse = await addArcadeGame(data);

    const game = gameResponse.data.game

    reset();
    if(onSubmit) onSubmit(game)
    setIsAddGameFormOpen(false)
  }

  return (
    <div className="GameAddForm">
      <Button onClick={() => {
        setIsAddGameFormOpen(true)
      }} startIcon={<Icon icon="faPlus"/>} type="submit" className="btn">New Game</Button>
      <Dialog onClose={() => {
        setIsAddGameFormOpen(false)
      }} open={isAddGameFormOpen}>
        <DialogTitle>New Game</DialogTitle>
        <DialogContent>
          <form>
          <Controller
            name={"metadata.title"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField onChange={onChange} value={value} label={"Title"} />
            )}
          />
          <br></br><br/>
          <Controller
            name={"userId"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectUsers onSelect={(users) => {
                onChange(users[users.length-1])
              }} usersSelected={value ? [value] : []} label={"User ( game owner )"} />
            )}
          />
          </form>
        </DialogContent>
        <DialogActions>
          <Button type="submit" onClick={handleSubmit(submit)}>Add Game</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { addArcadeGame })(GameAddForm);
