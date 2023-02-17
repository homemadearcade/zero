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
import { addGameRoom } from '../../../store/actions/gameRoomActions';
import moment from 'moment';

const LobbyForm = ({ addLobby, onSubmit, addArcadeGame, addGameRoom }) => {
  const { handleSubmit, reset, control } = useForm({
    defaultValues: {
      startTime: '',
      invitedUsers: null,
    },
  });

  const submit = async (data) => {
    const gameResponse = await addArcadeGame({
      userId: data.invitedUsers,
      stages: {},
      classes: {},
      cutscenes: {},
      relations: {},
      metadata: {
        title: 'Lobby Game ' + moment(Date.now()).format('MMMM Do YYYY, H:mm:ss')
      }
    });
    
    const game = gameResponse.data.game

    const gameRoomResponse = await addGameRoom({
      invitedUsers: data.invitedUsers,
      isNetworked: true,
      isEdit: true,
      gameId: null,
      hostUserId: data.invitedUsers
    });
    const gameRoom = gameRoomResponse.data.gameRoom
    const participantId = data.invitedUsers
    await addLobby({ editingGameId: game.id, invitedUsers: [data.invitedUsers], participantId: participantId, startTime: data.startTime, gameRoomId: gameRoom.id });
    reset();
    onSubmit()
  }

  return (
    <div className="LobbyForm">
      <Typography variant="h5" component="h5">Add a lobby</Typography>
      <form>
        <Controller
          name={"invitedUsers"}
          control={control}
          render={({ field: { onChange, value } }) => {
            return <SelectUsers 
              usersSelected={value ? [value] : []} 
              onSelect={(invitedUsers) => {
                onChange(invitedUsers[invitedUsers.length-1])
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

export default connect(mapStateToProps, { addLobby, addArcadeGame, addGameRoom })(LobbyForm);
