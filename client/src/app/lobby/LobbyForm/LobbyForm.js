import React from 'react';
import { connect } from 'react-redux';
import { addLobby } from '../../../store/actions/lobbyActions';
// import { lobbyFormSchema } from './validation';
import { Controller, useForm } from "react-hook-form";

import './styles.css';
import Button from '../../ui/Button/Button';
import Typography from '../../ui/Typography/Typography';
import UserSelect from '../../UserSelect/UserSelect';
import { TextField } from '@mui/material';
import { addGame } from '../../../store/actions/gameActions';

const LobbyForm = ({ addLobby, onSubmit, addGame }) => {
  const { handleSubmit, reset, control } = useForm({
    defaultValues: {
      startTime: '',
      participants: null,
    },
  });
  const submit = async (data) => {
    const gameResponse = await addGame({
      userId: data.participants
    });
    const game = gameResponse.data.game
    await addLobby({ game: game.id, participants: [data.participants], startTime: data.startTime });
    reset();
    onSubmit()
  }

  return (
    <div className="LobbyForm">
      <Typography variant="h2" component="h2">Add a lobby</Typography>
      <form>
        <Controller
          name={"participants"}
          control={control}
          render={({ field: { onChange, value } }) => {
            return <UserSelect 
              usersSelected={value ? [value] : []} 
              onSelect={(participants) => {
                onChange(participants[participants.length-1])
              }}
            />
          }}
        />
        <div>
          <Controller
            name={"startTime"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField onChange={onChange} value={value} label={"Start Time"} />
            )}
          />
        </div>
        <Button type="submit" onClick={handleSubmit(submit)}>Add Lobby</Button>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
});

export default connect(mapStateToProps, { addLobby, addGame })(LobbyForm);
