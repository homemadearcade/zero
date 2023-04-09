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
import { addArcadeGame, copyArcadeGameToUser } from '../../../store/actions/game/arcadeGameActions';
import { addGameRoom } from '../../../store/actions/game/gameRoomInstanceActions';
import moment from 'moment';
import { generateUniqueId } from '../../../utils';
import './ExperienceInstanceForm.scss';
import Icon from '../../../ui/Icon/Icon';
import { EXPERIENCE_ROLE_AUDIENCE, roleToInterfaceData, EXPERIENCE_INSTANCE_DID, GAME_ROOM_ACTIVITY, VIDEO_ACTIVITY } from '../../../constants';

// function convertExperienceModelToLobbyInstance(experienceModel) {
//   const lobbyInstance = {
//     roleIdToUserMongoIds: Object.keys(experienceModel.roles).reduce((prev, next) => {
//       prev[next] = []
//       return prev
//     }, {}),
//   }

//   return lobbyInstance
// }

const ExperienceInstanceForm = ({ 
  addLobby, onSubmit, 
  addGameRoom, 
  copyArcadeGameToUser,
  experienceModel: { experienceModel }
}) => {

  const { handleSubmit, reset, control, formState: { isValid }, register } = useForm({
    defaultValues: {}// convertExperienceModelToLobbyInstance(experienceModel)
  });

  const submit = async (data) => {
    const experienceInstanceId = EXPERIENCE_INSTANCE_DID + generateUniqueId()

    const lobbyIds = Object.keys(experienceModel.lobbys)
    for(let i = 0; i < lobbyIds.length; i++) {
      const lobbyId = lobbyIds[i]
      const lobby = experienceModel.lobbys[lobbyId]
      if(lobby.isRemoved) continue;
      const lobbyInstance = data.lobbyInstances[lobbyId]
      const gameRoomInstanceMongoIds = []
      const activitys = {}
      const invitedUsers = Object.keys(lobbyInstance.roleIdToUserMongoIds).reduce((prev, next) => {
        const userMongoIds = lobbyInstance.roleIdToUserMongoIds[next]
        return prev.concat(userMongoIds)
      }, []).filter((userId) => !!userId)
      
      const activityIds = Object.keys(experienceModel.activitys)
      for(let i = 0; i < activityIds.length; i++) {
        const activityId = activityIds[i]
        const activity = experienceModel.activitys[activityId]
        if(activity.isRemoved) continue;
        if(activity.activityCategory === GAME_ROOM_ACTIVITY) {
          const gameRoom = experienceModel.gameRooms[activity.gameRoom.gameRoomId]

          const hostUserMongoId = lobbyInstance.roleIdToUserMongoIds[gameRoom.hostRoleId][0]

          let arcadeGameMongoId = gameRoom.arcadeGameMongoId

          if(gameRoom.copyGame) {
            const arcadeGameResponse = await copyArcadeGameToUser({
              userMongoId: hostUserMongoId,
              arcadeGameMongoId: gameRoom.arcadeGameMongoId,
            })

            arcadeGameMongoId = arcadeGameResponse.data.game.id
          }

          const gameRoomInstance = {
            invitedUsers: invitedUsers,
            isNetworked: true,
            isEdit: true,
            isAutosaveDisabled: gameRoom.isAutosaveDisabled,
            experienceInstanceId,
            arcadeGameMongoId,
            hostUserMongoId,
            name: gameRoom.name,
          }

          const gameRoomInstanceResponse = await addGameRoom(gameRoomInstance);
          const gameRoomInstanceMongoId = gameRoomInstanceResponse.data.gameRoomInstance.id
          gameRoomInstanceMongoIds.push(gameRoomInstanceMongoId)

          activitys[activityId] = {
            activityId,
            name: activity.name,
            currentViewCategory: activity.initialViewCategory,
            gameRoomInstanceMongoId: gameRoomInstanceMongoId,
            activityCategory: activity.activityCategory,
            instructionsByRoleId: activity.instructionsByRoleId,
            instructionCurrentSteps: Object.keys(activity.instructionsByRoleId).reduce((prev, roleId) => {
              const instructionId = activity.instructionsByRoleId[roleId]
              prev[instructionId] = 0
              return prev
            }, {})
          }
        } else {
          activitys[activityId] = {
            activityId,
            name: activity.name,
            currentViewCategory: activity.initialViewCategory,
            activityCategory: activity.activityCategory,
            instructionsByRoleId: activity.instructionsByRoleId,
            instructionCurrentSteps: Object.keys(activity.instructionsByRoleId).reduce((prev, roleId) => {
              const instructionId = activity.instructionsByRoleId[roleId]
              prev[instructionId] = 0
              return prev
            }, {})
          }
        }
      }

      const hostUserMongoId = lobbyInstance.roleIdToUserMongoIds[lobby.hostRoleId][0]
      const completeLobbyInstance = {
        instructionsByRoleId: lobby.instructionsByRoleId,
        invitedUsers,
        hostUserMongoId,
        activitys,
        roleIdToUserMongoIds: lobbyInstance.roleIdToUserMongoIds,
        instructions: experienceModel.instructions,
        experienceInstanceId,
        roles: experienceModel.roles,
        experienceModel: experienceModel.id,
        currentActivityId: lobby.initialActivityId,
        gameRoomInstances: gameRoomInstanceMongoIds,
        instructionCurrentSteps: Object.keys(lobby.instructionsByRoleId).reduce((prev, roleId) => {
          const instructionId = lobby.instructionsByRoleId[roleId]
          prev[instructionId] = 0
          return prev
        }, {})
      }
      await addLobby(completeLobbyInstance)
    }
   
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
                  <div className="ExperienceInstanceForm__roles">{Object.keys(experienceModel.roles).map((roleId) => {
                    const role = experienceModel.roles[roleId]
                    const roleData = roleToInterfaceData[role.roleCategory]
                    return <div className="ExperienceInstanceForm__role">
                      <Icon icon={roleData.icon} color={role.color}/>
                      <Typography variant="subtitle2" component="subtitle2">{role.name}</Typography>
                      {role.roleCategory === EXPERIENCE_ROLE_AUDIENCE && <Controller
                        name={`lobbyInstances.${lobbyId}.roleIdToUserMongoIds.${roleId}`}
                        control={control}
                        render={({ field: { onChange, value } }) => {
                          return <SelectUsers
                            usersSelected={value} 
                            onSelect={(users) => {
                              onChange(users)
                            }}
                          />
                        }}
                      />}
                      {role.roleCategory !== EXPERIENCE_ROLE_AUDIENCE && <Controller
                        {...register(`lobbyInstances.${lobbyId}.roleIdToUserMongoIds.${roleId}`, {
                          required: true
                        })}
                        name={`lobbyInstances.${lobbyId}.roleIdToUserMongoIds.${roleId}`}
                        control={control}
                        render={({ field: { onChange, value } }) => {
                          return <SelectUsers
                            usersSelected={value} 
                            onSelect={(users) => {
                              onChange([users[users.length-1]])
                            }}
                          />
                        }}
                      />}
                    </div>
                  })}</div>
          
                </div>
              </Paper>
            })}
            <Button disabled={!isValid} type="submit" onClick={handleSubmit(submit)}>Add Experience Instance</Button>
          </div>
      </div>
  );
};

const mapStateToProps = (state) => ({
  experienceModel: state.experienceModel
});

export default connect(mapStateToProps, { addLobby, addGameRoom, copyArcadeGameToUser })(ExperienceInstanceForm);
