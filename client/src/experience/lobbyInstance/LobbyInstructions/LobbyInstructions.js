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
import StepPrompts from '../../../app/experienceModel/step/StepPrompts/StepPrompts';
import StepTitle from '../../../app/experienceModel/step/StepTitle/StepTitle';
import { ANIMATION_CONFETTI, EVENT_LOBBY_STEP_INITIALIZED } from '../../../game/constants';
import { ON_LOBBY_INSTANCE_EVENT } from '../../../store/types';
import SelectExperienceEffect from '../../../ui/connected/SelectExperienceEffect/SelectExperienceEffect';
import { instructionSteps } from '../../instruction/instructionSteps/instructionSteps';
import { runExperienceEffects } from '../../../store/actions/experience/experienceModelActions';

const LobbyInstructions = ({
  editLobby,
  updateArcadeGameCharacter,
  runExperienceEffects,
  experienceModel: { experienceModel },
  lobbyInstance: { lobbyInstance, myRoleId },
}) => {  
  const [canSkipStep, setCanSkipStep] = useState()

  const instructionId = lobbyInstance.instructionsByRoleId[myRoleId]
  if(!instructionId) return <div className="LobbyInstructions">No Instructions for Role</div>

  const instruction = lobbyInstance.instructions[instructionId]

  const beginningSteps = [
    {
      stepId: 'Share Participant Links',
      title: <Typography component="h5" variant="h5">Share Participant link</Typography>,
      body: <>
        The participant will automatically have recieved this link in the email for their ticket. You may also manually share this link with them if needed
        <input readOnly style={{width: '100%'}} value={window.location.origin + '/lobby/' + lobbyInstance.id}></input>
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
                experienceModelMongoId: lobbyInstance.experienceModelMongoId,
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
    },
    {
      stepId: experienceModel.metadata.title + 'begings',
      title: <Typography component="h3" variant="h3">{experienceModel.metadata.title + ' Begins'}</Typography>,
      break: true
    }
  ]

  let steps = beginningSteps.concat(instructionSteps({instruction}))

  const endingSteps = [
    {
      stepId: experienceModel.metadata.title + 'ends',
      title: <Typography component="h3" variant="h3">{experienceModel.metadata.title + ' Ends'}</Typography>,
      break: true
    },
    {
      stepId: 'Congrats!',
      title: <Typography component="h5" variant="h5">Congrats!</Typography>,
      body: <>
        {experienceModel.metadata.title + ' is complete!'} Congrats!
      </>,
      onClickNext: () => {
        window.socket.emit(ON_LOBBY_INSTANCE_EVENT, { lobbyInstanceMongoId: lobbyInstance.id, lobbyInstanceEventType: ANIMATION_CONFETTI, data: {}})
      },
      nextButtonText: 'Blow Confetti'
    },
    {
      stepId: 'End Video Call',
      title: <Typography component="h5" variant="h5">End Video Call</Typography>,
      onClickNext: () => {
        // setCutVideo(true)
        // setCutAudio(true)
        // setCutVideo(true, true)
        // setCutAudio(true, true)
      },
      nextButtonText: 'End Video Call'
    },
  ]

  steps = steps.concat(endingSteps)

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
        onStepChange={(stepNumber, stepId) => {
          window.socket.emit(ON_LOBBY_INSTANCE_EVENT, { lobbyInstanceMongoId: lobbyInstance.id, lobbyInstanceEventType: EVENT_LOBBY_STEP_INITIALIZED, data: { instructionId, stepId, stepNumber } , hostOnly: true })
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
  experienceModel: state.experienceModel,
});

export default compose(
  connect(mapStateToProps, { editLobby, updateArcadeGameCharacter, runExperienceEffects }),
)(LobbyInstructions);
