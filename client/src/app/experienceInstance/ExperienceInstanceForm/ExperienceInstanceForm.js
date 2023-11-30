import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { addLobby } from '../../../store/actions/experience/lobbyInstanceActions';
// import { lobbyInstanceFormSchema } from './validation';
import { Controller, useForm, useWatch } from "react-hook-form";

import './styles.css';
import Button from '../../../ui/Button/Button';
import Typography from '../../../ui/Typography/Typography';
import SelectUsers from '../../../ui/connected/SelectUsers/SelectUsers';
import { Paper } from '@mui/material';
import { copyArcadeGameToUser, editArcadeGame } from '../../../store/actions/game/arcadeGameActions';
import { addGameRoom } from '../../../store/actions/game/gameRoomInstanceActions';
import { generateUniqueId, isLobbyInstanceUserAlreadyAssignedRoles } from '../../../utils';
import './ExperienceInstanceForm.scss';
import Icon from '../../../ui/Icon/Icon';
import { EXPERIENCE_ROLE_AUDIENCE, EXPERIENCE_INSTANCE_DID, GAME_ROOM_ACTIVITY, VIDEO_ACTIVITY, defaultParticipantRoleId } from '../../../constants';
import { RoleChip } from '../../experienceModel/role/RoleChip/RoleChip';
import _ from 'lodash';
import { EDIT_GAME_SCOPE_EXPERIENCE_INSTANCE, GAME_INSTANCE_DID, PLAY_GAME_SCOPE_EXPERIENCE_INSTANCE } from '../../../game/constants';

function convertExperienceModelToLobbyInstance(experienceModel) {
  return {
    lobbyInstances: Object.keys(experienceModel.lobbys).reduce((prev, lobbyId) => {    
      const lobbyInstance = {
          roleIdToUserMongoIds: Object.keys(experienceModel.roles).reduce((prev, next) => {
            prev[next] = []
            return prev
          }, {}),
        }

        prev[lobbyId] = lobbyInstance
        return prev
    }, {})
  }
}

const ExperienceInstanceForm = ({ 
  addLobby, onSubmit, 
  addGameRoom, 
  copyArcadeGameToUser,
  editArcadeGame,
  experienceModel,
}) => {
  const { handleSubmit, reset, control, formState: { isValid }, register } = useForm({
    defaultValues: convertExperienceModelToLobbyInstance(experienceModel)
  });

  const lobbyInstances = useWatch({
    control,
    name: 'lobbyInstances'
  })

  const [isLoading, setIsLoading] = useState()

  const submit = async (data) => {
    setIsLoading(true)
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
      const instructions = _.cloneDeep(experienceModel.instructions)
      for(let i = 0; i < activityIds.length; i++) {
        const activityId = activityIds[i]
        const activity = experienceModel.activitys[activityId]
        if(activity.isRemoved) continue;
        if(activity.activityCategory === GAME_ROOM_ACTIVITY) {
          const gameRoom = experienceModel.gameRooms[activity.gameRoom.gameRoomId]

          const hostUserMongoId = lobbyInstance.roleIdToUserMongoIds[gameRoom.hostRoleId][0]

          let arcadeGameMongoId = gameRoom.arcadeGameMongoId

          if(!gameRoom.doNotCopy) {
            const arcadeGameResponse = await copyArcadeGameToUser({
              userMongoId: hostUserMongoId,
              arcadeGameMongoId: gameRoom.arcadeGameMongoId,
              gameDataUpdate: {
                playScope: PLAY_GAME_SCOPE_EXPERIENCE_INSTANCE,
              }
            })

            arcadeGameMongoId = arcadeGameResponse.data.game.id
            Object.keys(instructions).forEach((instructionId) => {
              const instruction = instructions[instructionId]
              if(instruction.activityId === activityId) {
                instruction.arcadeGameMongoId = arcadeGameMongoId
              }
            })
          }

          const gameRoomInstance = {
            invitedUsers: invitedUsers,
            isOnlineMultiplayer: true,
            isEdit: true,
            isAutosaveDisabled: gameRoom.isAutosaveDisabled,
            experienceInstanceId,
            arcadeGameMongoId,
            gameInstanceIds : {
              [arcadeGameMongoId]: GAME_INSTANCE_DID + generateUniqueId()
            },
            hostUserMongoId,
            name: gameRoom.name,
          }

          const gameRoomInstanceResponse = await addGameRoom(gameRoomInstance);
          const gameRoomInstanceMongoId = gameRoomInstanceResponse.data.gameRoomInstance.id
          gameRoomInstanceMongoIds.push(gameRoomInstanceMongoId)

          await editArcadeGame(arcadeGameMongoId, {
            editScope: EDIT_GAME_SCOPE_EXPERIENCE_INSTANCE,
            appLocation: {
              lastUpdateDate: new Date().getTime(),
              experienceInstanceId,
              gameRoomInstanceMongoId,
            }
          })

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
      const cobrowsingUserMongoId = lobbyInstance.roleIdToUserMongoIds[defaultParticipantRoleId][0]
      const completeLobbyInstance = {
        lobbyId,
        introArcadeGameMongoId: lobby.introArcadeGameMongoId,
        instructionsByRoleId: lobby.instructionsByRoleId,
        usersMustWaitInLine: lobby.usersMustWaitInLine,
        invitedUsers,
        hostUserMongoId,
        activitys,
        roleIdToUserMongoIds: lobbyInstance.roleIdToUserMongoIds,
        instructions,
        experienceInstanceId,
        roles: experienceModel.roles,
        experienceModelMongoId: experienceModel.id,
        currentActivityId: lobby.initialActivityId,
        cobrowsingUserMongoId,
        gameRoomInstances: gameRoomInstanceMongoIds,
        instructionCurrentSteps: Object.keys(lobby.instructionsByRoleId).reduce((prev, roleId) => {
          const instructionId = lobby.instructionsByRoleId[roleId]
          prev[instructionId] = 0
          return prev
        }, {})
      }
      await addLobby(completeLobbyInstance)
    }
   
    setIsLoading(false)
    reset();
    onSubmit()
  }

  return (
    <div className="ExperienceInstanceForm">
        <div>
          <Typography variant="h3" component="h3">{experienceModel.metadata.title}</Typography>
          {Object.keys(experienceModel.lobbys).map((lobbyId) => {
              const lobby = experienceModel.lobbys[lobbyId]
              return <Paper key={lobby.id}><div className="ExperienceInstanceForm__lobby">
                  <Icon icon="faDoorOpen" />
                  <Typography variant="subtitle1" component="span">{' ' + lobby.name}</Typography>
                  <div className="ExperienceInstanceForm__roles">{Object.keys(experienceModel.roles).map((roleId) => {
                    const role = experienceModel.roles[roleId]
                    return <div key={roleId} className="ExperienceInstanceForm__role">
                      <RoleChip role={role} />
                      {role.roleCategory === EXPERIENCE_ROLE_AUDIENCE && <Controller
                        name={`lobbyInstances.${lobbyId}.roleIdToUserMongoIds.${roleId}`}
                        control={control}
                        render={({ field: { onChange, value } }) => {
                          return <SelectUsers
                            usersSelected={value ? value : []} 
                            onSelect={(users) => {
                              const lobbyInstance = lobbyInstances[lobbyId]
                              if(isLobbyInstanceUserAlreadyAssignedRoles(lobbyInstance, roleId, users[users.length-1])) return alert('this user is already assigned a role')
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
                            usersSelected={value ? value : []} 
                            onSelect={(users) => {
                              if(users.length) {
                                const lobbyInstance = lobbyInstances[lobbyId]
                                if(isLobbyInstanceUserAlreadyAssignedRoles(lobbyInstance, roleId, users[users.length-1])) return alert('this user is already assigned a role')
                                onChange([users[users.length-1]])
                              } else {
                                onChange([])
                              }
                            }}
                          />
                        }}
                      />}
                    </div>
                  })}</div>
          
                </div>
              </Paper>
            })}
            <Button disabled={!isValid || isLoading} type="submit" onClick={handleSubmit(submit)}>Add Experience Instance</Button>
          </div>
      </div>
  );
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, { addLobby, editArcadeGame, addGameRoom, copyArcadeGameToUser })(ExperienceInstanceForm);
