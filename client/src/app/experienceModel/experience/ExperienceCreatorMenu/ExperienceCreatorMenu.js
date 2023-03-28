
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import IconTree from '../../../../ui/IconTree/IconTree';
import Icon from '../../../../ui/Icon/Icon';
import ActivityAddForm from '../../activity/ActivityAddForm/ActivityAddForm';
import { editExperienceModel } from '../../../../store/actions/experienceModelActions';
import { activityToInterfaceData, instructionToInterfaceData } from '../../../../constants';
import LobbyAddForm from '../../lobby/LobbyAddForm/LobbyAddForm';
import RoleAddForm from '../../role/RoleAddForm/RoleAddForm';
import InstructionAddForm from '../../instruction/InstructionAddForm/InstructionAddForm';

const ExperienceCreatorMenu = ({
  experienceModel: { experienceModel },
  editExperienceModel,
  onNodeSelect
}) => {
  const lobbyNodes = Object.keys(experienceModel.lobbys).map((lobbyId, index) => {
    const lobby = experienceModel.lobbys[lobbyId]
    const activityNodes = Object.keys(lobby.activitys).map((activityId) => {
      const activity = experienceModel.activitys[activityId]
      return {
        icon: <Icon icon={activityToInterfaceData[activity.activityCategory].icon}></Icon>,
        label: activity.name,
        id: activityId,
      }
    })

    return {
      id: lobbyId,
      label: lobby.name,
      icon: <Icon icon='faDoorOpen'></Icon>,
      button: index === (Object.keys(experienceModel.lobbys).length-1) && <LobbyAddForm key={'lobbyAdd'}  onSubmit={(lobby) => {
        editExperienceModel(experienceModel.id, {
            lobbys: {
              [lobby.lobbyId]: lobby
            }
          })
        }}
      />,
      children: activityNodes,
      childrenButton: <ActivityAddForm key={'activity-add' + lobbyId} onSubmit={(activity) => {
        editExperienceModel(experienceModel.id, {
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
          }
        })
      }}/>
    }
  })

  const roleChildren = Object.keys(experienceModel.roles).map((roleId) => {
    const role = experienceModel.roles[roleId]
    return {
      id: roleId,
      icon: <Icon icon='faCircle' color={role.color}></Icon>,
      label: role.name,
    }
  })

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
    }}/>
  }

  const instructionChildren = Object.keys(experienceModel.instructions).map((instructionId) => {
    const instruction = experienceModel.instructions[instructionId]
    return {
      id: instructionId,
        icon: <Icon icon={instructionToInterfaceData[instruction.instructionCategory].icon}></Icon>,
      label: experienceModel.instructions[instructionId].name,
    }
  })

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
    }}/>
  }

  const nodes = [...lobbyNodes, roleNode, instructionNode]

  return (
    <div className="ExperienceCreatorMenu">
      <IconTree nodes={nodes} onNodeSelect={onNodeSelect}>
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
