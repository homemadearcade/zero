import React from 'react';
import { connect } from 'react-redux';
import { addLobby } from '../../../store/actions/experience/lobbyInstanceActions';
// import { lobbyInstanceFormSchema } from './validation';
import { Controller, useForm } from "react-hook-form";

import './styles.css';
import Button from '../../../ui/Button/Button';
import Typography from '../../../ui/Typography/Typography';
import SelectUsers from '../../../ui/connected/SelectUsers/SelectUsers';
import { TextField } from '@mui/material';
import { addArcadeGame } from '../../../store/actions/game/arcadeGameActions';
import { addGameRoom } from '../../../store/actions/game/gameRoomInstanceActions';
import moment from 'moment';
import { EXPERIENCE_INSTANCE_ID_PREFIX } from '../../../constants/experience/experienceInstance';
import { generateUniqueId } from '../../../utils';

const ExperienceInstanceAddForm = ({ addLobby, onSubmit, addArcadeGame, addGameRoom }) => {
  const { handleSubmit, reset, control } = useForm({
    defaultValues: {
      startTime: '',
      invitedUsers: null,
    },
  });

  const submit = async (data) => {
    const gameResponse = await addArcadeGame({
      userMongoId: data.invitedUsers,
      stages: {},
      entityModels: {},
      cutscenes: {},
      relations: {},
      collisions: {},
      interfacePreset: {},
      relationTags: {},
      events: {},
      effects: {},
      theme: {},
      player: {},
      metadata: {
        title: 'Lobby Game ' + moment(Date.now()).format('MMMM Do YYYY, H:mm:ss')
      }
    });
    
    const game = gameResponse.data.game

    const gameRoomInstanceResponse = await addGameRoom({
      invitedUsers: data.invitedUsers,
      isNetworked: true,
      isEdit: true,
      arcadeGameMongoId: null,
      hostUserMongoId: data.invitedUsers
    });
    const gameRoomInstance = gameRoomInstanceResponse.data.gameRoomInstance
    const participantId = data.invitedUsers
    const experienceInstanceId = EXPERIENCE_INSTANCE_ID_PREFIX + generateUniqueId()
    await addLobby({ 
      editingGameId: game.id,
      invitedUsers: [data.invitedUsers],
      participantId: participantId,
      startTime: data.startTime,
      gameRoomInstanceMongoId: gameRoomInstance.id,
      experienceInstanceId: experienceInstanceId
    });
    reset();
    onSubmit()
  }

  return (
    <div className="ExperienceInstanceAddForm">
      <Typography variant="h5" component="h5">Add an Experience Instance</Typography>
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
        <Button type="submit" onClick={handleSubmit(submit)}>Add Experience Instance</Button>
    </div>
  );
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, { addLobby, addArcadeGame, addGameRoom })(ExperienceInstanceAddForm);
