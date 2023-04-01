
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import IconTree from '../../../../ui/IconTree/IconTree';
import Icon from '../../../../ui/Icon/Icon';
import ActivityAddForm from '../../activity/ActivityAddForm/ActivityAddForm';
import { editExperienceModel } from '../../../../store/actions/experience/experienceModelActions';
import { activityToInterfaceData, instructionToInterfaceData, roleToInterfaceData } from '../../../../constants';
import LobbyAddForm from '../../lobby/LobbyAddForm/LobbyAddForm';
import RoleAddForm from '../../role/RoleAddForm/RoleAddForm';
import InstructionAddForm from '../../instruction/InstructionAddForm/InstructionAddForm';
import GameRoomAddForm from '../../gameRoom/GameRoomAddForm/GameRoomAddForm';

function isTruthy(item) {
  return !!item
}

const ExperienceCreatorMenu = ({
  experienceModel: { experienceModel },
  editExperienceModel,
  onNodeSelect
}) => {
  const notRemovedLobbies = Object.keys(experienceModel.lobbys).filter((lobbyId) => {
    const lobby = experienceModel.lobbys[lobbyId]
    return !lobby.isRemoved || lobby.isNotRemoveable
  })
  const lobbyNodes = notRemovedLobbies.map((lobbyId, index) => {
    const lobby = experienceModel.lobbys[lobbyId]
    if(lobby.isRemoved && !lobby.isNotRemoveable) return null
    const activityNodes = Object.keys(lobby.activitys).map((activityId) => {
      const activity = experienceModel.activitys[activityId]
      if(activity.isRemoved && !activity.isNotRemoveable) return null
      return {
        icon: <Icon icon={activityToInterfaceData[activity.activityCategory].icon}></Icon>,
        label: activity.name,
        id: activityId,
      }
    }).filter(isTruthy)

    return {
      id: lobbyId,
      label: lobby.name,
      icon: <Icon icon='faDoorOpen'></Icon>,
      button: index === (notRemovedLobbies.length-1) && <LobbyAddForm key={'lobbyAdd'}  onSubmit={(lobby) => {
          editExperienceModel(experienceModel.id, {
            lobbys: {
              [lobby.lobbyId]: lobby
            }
          })
          onNodeSelect(lobby.lobbyId)
        }}
      />,
      children: activityNodes,
      childrenButton: <ActivityAddForm key={'activity-add' + lobbyId} onSubmit={(activity) => {
        const experienceModelUpdate = {
          lobbys: {
            [lobbyId]: {
              activitys: {
                [activity.activityId]: {
                  activityId: activity.activityId,
                }
              }
            }
          },
          activitys: { 
            [activity.activityId]: activity
          },
        }
        editExperienceModel(experienceModel.id, experienceModelUpdate)
        onNodeSelect(activity.activityId)
      }}/>
    }
  }).filter(isTruthy)

  const roleChildren = Object.keys(experienceModel.roles).map((roleId) => {
    const role = experienceModel.roles[roleId]
    if(role.isRemoved && !role.isNotRemoveable) return null
    return {
      id: roleId,
      icon: <Icon icon={roleToInterfaceData[role.roleCategory].icon} color={role.color}></Icon>,
      label: role.name,
    }
  }).filter(isTruthy)

  const roleNode = {
    id: 'roles',
    label: 'Roles',
    icon: <Icon icon='faUser'></Icon>,
    children: roleChildren,
    childrenButton: <RoleAddForm key={'role-add'} onSubmit={(role) => {
      editExperienceModel(experienceModel.id, {
        roles: {
          [role.roleId]: role
        }
      })
      onNodeSelect(role.roleId)
    }}/>
  }

  const instructionChildren = Object.keys(experienceModel.instructions).map((instructionId) => {
    const instruction = experienceModel.instructions[instructionId]
    if(instruction.isRemoved && !instruction.isNotRemoveable) return null
    return {
      id: instructionId,
        icon: <Icon icon={instructionToInterfaceData[instruction.instructionCategory].icon}></Icon>,
      label: experienceModel.instructions[instructionId].name,
    }
  }).filter(isTruthy)

  const instructionNode = {
    id: 'instructions',
    label: 'Instructions',
    icon: <Icon icon='faListOl'></Icon>,
    children: instructionChildren,
    childrenButton: <InstructionAddForm key={'instruction-add'} onSubmit={(instruction) => {
      editExperienceModel(experienceModel.id, {
        instructions: {
          [instruction.instructionId]: instruction
        }
      })
      onNodeSelect(instruction.instructionId)
    }}/>
  }


  const gameChildren = Object.keys(experienceModel.gameRooms).map((gameRoomId) => {
    const game = experienceModel.gameRooms[gameRoomId]
    if(game.isRemoved && !game.isNotRemoveable) return null
    return {
      id: gameRoomId,
      label: experienceModel.gameRooms[gameRoomId].name,
    }
  }).filter(isTruthy)

  const gameNode = {
    id: 'gamerooms',
    label: 'Game Rooms',
    icon: <Icon icon='faGamepad'></Icon>,
    children: gameChildren,
    childrenButton: <GameRoomAddForm key={'game-add'} onSubmit={(game) => {
      editExperienceModel(experienceModel.id, {
        gameRooms: {
          [game.gameRoomId]: game
        }
      })
      onNodeSelect(game.gameRoomId)
    }}/>
  }


  const nodes = [instructionNode, gameNode, roleNode, ...lobbyNodes]

  return (
    <div className="ExperienceCreatorMenu">
      <IconTree nodes={nodes} onNodeSelect={(e, nodeId) => {
        onNodeSelect(nodeId)
      }}>
      </IconTree>
    </div>
  );
};

const mapStateToProps = (state) => ({
  experienceModel: state.experienceModel,
});

export default compose(
  connect(mapStateToProps, { editExperienceModel }),
)(ExperienceCreatorMenu);
