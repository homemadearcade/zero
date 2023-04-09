/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { editLobby } from '../../../store/actions/experience/lobbyInstanceActions';

import './LobbyInstructions.scss';
import Typography from '../../../ui/Typography/Typography';
import LobbyChecklist from '../LobbyChecklist/LobbyChecklist';
import Switch from '../../../ui/Switch/Switch';
import { VerticalLinearStepperControlled } from '../../../ui/VerticalLinearStepper/VerticalLinearStepper';
import { updateArcadeGameCharacter } from '../../../store/actions/game/arcadeGameActions';
import { EXPERIENCE_ROLE_PARTICIPANT } from '../../../constants';

const LobbyInstructions = ({
  editLobby,
  updateArcadeGameCharacter,
  lobbyInstance: { lobbyInstance, myRoleId },
}) => {  
  const [canSkipStep, setCanSkipStep] = useState()

  const instructionId = lobbyInstance.instructionsByRoleId[myRoleId]
  if(!instructionId) return <div className="LobbyInstructions">No Instructions for Role</div>

  const instruction = lobbyInstance.instructions[instructionId]

  const defaultSteps = [
        {
          stepId: 'Share Participant Links',
          title: <Typography component="h5" variant="h5">Share Participant link</Typography>,
          body: <>
            The participant will automatically have recieved this link in the email for their ticket. You may also manually share this link with them if needed
            <input readOnly style={{width: '100%'}} value={window.location.origin + '/lobbyInstance/' + lobbyInstance.id}></input>
            The Chatlog will show you if they have joined
          </>
        },
        {
          stepId: 'UI - Lock All',
          title: <Typography component="h5" variant="h5">UI - Lock All</Typography>,
          body: <>
            This will set the participants UI to not see any thing including the Game View
          </>,

          onClickNext: () => {
            Object.keys(lobbyInstance.roleIdToUserMongoIds).forEach((roleId) => {
              const userMongoIds = lobbyInstance.roleIdToUserMongoIds[roleId]
              const role = lobbyInstance.roles[roleId]
              if(role.roleCategory === EXPERIENCE_ROLE_PARTICIPANT) {
                userMongoIds.forEach((userMongoId) => {
                  updateArcadeGameCharacter({
                    userMongoId,
                    unlockableInterfaceIds: {}
                  })
                })
              }
            })
          },
          nextButtonText: 'Lock All'
        },
        {
          stepId: 'Review Launch Checklist',
          title: <Typography component="h5" variant="h5">Review Launch Checklist </Typography>,
          body: <>
            <LobbyChecklist/>
          </>,
          // shouldContinueBeDisabledCheck: () => {
          //   return !window.lobbyInstance?.isAllRequiredPassing
          // }
        }
  ]

  const steps = defaultSteps.concat(instruction.stepOrder.map((stepId) => {
    return instruction.steps[stepId]
  }))

  return (
    <div className="LobbyInstructions">
      <div className="LobbyInstructions__stepper">
      <Switch
        labels={['Steps In Order', 'Can Skip Steps']}
          size="small"
          onChange={(e) => {
            setCanSkipStep(e.target.checked)
          }}
          checked={canSkipStep}
      ></Switch>
      <VerticalLinearStepperControlled
      canSkipStep={canSkipStep}
      currentStep={lobbyInstance.instructionCurrentSteps[instructionId]}
      onStepChange={(stepNumber) => {
        editLobby(lobbyInstance.id, {
          instructionCurrentSteps: {
            [instructionId]: stepNumber
          }
        })
      }}
      steps={steps}
      completed={<>
          <Typography component="h5" variant="h5">Great job!</Typography>
        </>}
      />
    </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobbyInstance: state.lobbyInstance,
});

export default compose(
  connect(mapStateToProps, { editLobby, updateArcadeGameCharacter  }),
)(LobbyInstructions);
