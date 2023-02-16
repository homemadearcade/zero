import React from 'react';
import { connect } from 'react-redux';
import { addLobby } from '../../../store/actions/lobbyActions';
// import { lobbyFormSchema } from './validation';
import { Controller, useForm } from "react-hook-form";

import './styles.css';
import Button from '../../../ui/Button/Button';
import Typography from '../../../ui/Typography/Typography';
import SelectUsers from '../../../ui/connected/SelectUsers/SelectUsers';
import { TextField } from '@mui/material';
import { addArcadeGame } from '../../../store/actions/arcadeGameActions';
import { addGameSession } from '../../../store/actions/gameSessionActions';
import moment from 'moment';

const LobbyForm = ({ addLobby, onSubmit, addArcadeGame, addGameSession }) => {
  const { handleSubmit, reset, control } = useForm({
    defaultValues: {
      startTime: '',
      participants: null,
    },
  });
  const submit = async (data) => {
    const gameResponse = await addArcadeGame({
      userId: data.participants,
      stages: {},
      classes: {},
      cutscenes: {},
      relations: {},
      metadata: {
        title: 'Lobby Game ' + moment(Date.now()).format('MMMM Do YYYY, H:mm:ss')
      }
    });
    
    const game = gameResponse.data.game

    const gameSessionResponse = await addGameSession({
      players: data.participants,
      isNetworked: true,
      isEdit: true,
      gameId: game.id,
      hostUserId: data.participants
    });
    const gameSession = gameSessionResponse.data.gameSession
    const participantId = data.participants
    await addLobby({ editingGameId: game.id, participants: [data.participants], participantId: participantId, startTime: data.startTime, gameSessionId: gameSession.id });
    reset();
    onSubmit()
  }

  return (
    <div className="LobbyForm">
      <Typography variant="h5" component="h5">Add a lobby</Typography>
      <form>
        <Controller
          name={"participants"}
          control={control}
          render={({ field: { onChange, value } }) => {
            return <SelectUsers 
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

export default connect(mapStateToProps, { addLobby, addArcadeGame, addGameSession })(LobbyForm);
