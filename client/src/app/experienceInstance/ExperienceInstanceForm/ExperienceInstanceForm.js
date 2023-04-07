import React, { useState } from 'react';
import { connect } from 'react-redux';
import { addLobby } from '../../../store/actions/experience/lobbyInstanceActions';
// import { lobbyInstanceFormSchema } from './validation';
import { Controller, useForm } from "react-hook-form";

import './styles.css';
import Button from '../../../ui/Button/Button';
import Typography from '../../../ui/Typography/Typography';
import SelectUsers from '../../../ui/connected/SelectUsers/SelectUsers';
import { Paper, TextField } from '@mui/material';
import { addArcadeGame } from '../../../store/actions/game/arcadeGameActions';
import { addGameRoom } from '../../../store/actions/game/gameRoomInstanceActions';
import moment from 'moment';
import { generateUniqueId } from '../../../utils';
import './ExperienceInstanceForm.scss';
import Icon from '../../../ui/Icon/Icon';
import { EXPERIENCE_ROLE_AUDIENCE, roleToInterfaceData, EXPERIENCE_INSTANCE_DID } from '../../../constants';

function convertExperienceModelToLobbyInstance(experienceModel) {
  const lobbyInstance = {
    startTime: '',
    invitedUsers: [],
    roleUserMongoIds: Object.keys(experienceModel.roles).reduce((prev, next) => {
      prev[next] = []
      return prev
    }, {}),
    activitys: Object.keys(experienceModel.activitys).reduce((prev, next) => {
      const activity = experienceModel.activitys[next]
      prev[next] = {
        ...activity,
        currentView: activity.initialView,
      }
      return prev
    }, {}),
    experienceModel: experienceModel.id,
    currentActivity: experienceModel.initialActivity,
  }

  return lobbyInstance
}


const ExperienceInstanceForm = ({ 
  addLobby, onSubmit, 
  addArcadeGame, 
  addGameRoom, 
  experienceModel: { experienceModel }
}) => {

  const { handleSubmit, reset, control } = useForm({
    defaultValues: convertExperienceModelToLobbyInstance(experienceModel)
  });

  const submit = async (data) => {
    const gameResponse = await addArcadeGame({
      userMongoId: data.invitedUsers,
      stages: {},
      layers: {},
      entityModels: {},
      cutscenes: {},
      relations: {},
      collisions: {},
      importedArcadeGames: [],
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
    const experienceInstanceId = EXPERIENCE_INSTANCE_DID + generateUniqueId()
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
    <div className="ExperienceInstanceForm">
        <div>
          <Typography variant="h3" component="h3">{experienceModel.metadata.title}</Typography>
          {Object.keys(experienceModel.lobbys).map((lobbyId) => {
              const lobby = experienceModel.lobbys[lobbyId]
              return <Paper><div className="ExperienceInstanceForm__lobby">
                  <Icon icon="faDoorOpen" />
                  <Typography variant="subtitle2" component="subtitle2">{' ' + lobby.name}</Typography>
                  {Object.keys(lobby.roles).map((roleId) => {
                    const role = lobby.roles[roleId]
                    const roleData = roleToInterfaceData[role.roleCategory]
                    return <div className="ExperienceInstanceForm__role">
                      <Icon icon={roleData.icon} color={role.color}/>
                      <Typography variant="subtitle2" component="subtitle2">{role.name}</Typography>
                      {role.roleCategory === EXPERIENCE_ROLE_AUDIENCE && <Controller
                        name={`roleUserMongoIds.${roleId}`}
                        control={control}
                        render={({ field: { onChange, value } }) => {
                          return <SelectUsers
                            label={`${role.name} Users`}
                            usersSelected={value ? [value] : []} 
                            onSelect={(users) => {
                              onChange(users)
                            }}
                          />
                        }}
                      />}
                      {role.roleCategory !== EXPERIENCE_ROLE_AUDIENCE && <Controller
                        name={`roleUserMongoIds.${roleId}`}
                        control={control}
                        render={({ field: { onChange, value } }) => {
                          return <SelectUsers
                            label={`${role.name} Users`}
                            usersSelected={value ? [value] : []} 
                            onSelect={(users) => {
                              onChange(users[users.length-1])
                            }}
                          />
                        }}
                      />}
                    </div>
                  })}
          
                </div>
              </Paper>
            })}
            <Button type="submit" onClick={handleSubmit(submit)}>Add Experience Instance</Button>
          </div>
      </div>
  );
};

const mapStateToProps = (state) => ({
  experienceModel: state.experienceModel
});

export default connect(mapStateToProps, { addLobby, addArcadeGame, addGameRoom })(ExperienceInstanceForm);
