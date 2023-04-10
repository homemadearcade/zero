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
import { EXPERIENCE_EFFECT_GAME_ACTION, EXPERIENCE_ROLE_PARTICIPANT } from '../../../constants';
import StepPrompts from '../../../app/experienceModel/step/StepPrompts/StepPrompts';
import StepTitle from '../../../app/experienceModel/step/StepTitle/StepTitle';
import { ANIMATION_CONFETTI, EFFECT_INTERFACE_ACTION, EFFECT_INTERFACE_UNLOCK, EVENT_LOBBY_STEP_INITIALIZED, RUN_GAME_INSTANCE_ACTION } from '../../../game/constants';
import { ON_GAME_INSTANCE_EVENT, ON_LOBBY_INSTANCE_EVENT } from '../../../store/types';
import SelectExperienceEffect from '../../../ui/connected/SelectExperienceEffect/SelectExperienceEffect';
import { instructionSteps } from '../../instruction/instructionSteps/instructionSteps';
import { runExperienceEffects } from '../../../store/actions/experience/experienceModelActions';
import store from '../../../store';

const LobbyInstructions = ({
  editLobby,
  updateArcadeGameCharacter,
  runExperienceEffects,
  experienceModel: { experienceModel },
  gameRoomInstance: { gameRoomInstance },
  gameModel: { gameModel },
  lobbyInstance: { lobbyInstance, myRoleId },
}) => {  
  const [canSkipStep, setCanSkipStep] = useState()

  const instructionId = lobbyInstance.instructionsByRoleId[myRoleId]
  if(!instructionId) return <div className="LobbyInstructions">No Instructions for Role</div>

  const instruction = lobbyInstance.instructions[instructionId]

  const allSteps = {}
  Object.keys(lobbyInstance.instructions).forEach((instructionId) => {
    const instruction = lobbyInstance.instructions[instructionId]
    Object.keys(instruction.steps).forEach((stepId) => {
      const step = instruction.steps[stepId]
      allSteps[step.stepId] = step
    })
  })

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

  let steps = beginningSteps.concat(instructionSteps({instruction, lobbyInstance, myRoleId, gameModel}))

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
        onStepChange={async (stepNumber, stepId) => {
      
          const step = allSteps[stepId]
          if(step) {
            const updatedLobby = {}
            if(step.activityId) updatedLobby.currentActivityId = step.activityId
            if(step.cobrowsingRoleId) {
              const cobrowsingUserMongoId = lobbyInstance.roleIdToUserMongoIds[step.cobrowsingRoleId][0]
              updatedLobby.cobrowsingUserMongoId = cobrowsingUserMongoId
              await editLobby(lobbyInstance.id, updatedLobby)
              window.socket.emit(ON_LOBBY_INSTANCE_EVENT, { lobbyInstanceMongoId: lobbyInstance.id, lobbyInstanceEventType: EVENT_LOBBY_STEP_INITIALIZED, data: { instructionId, stepId, stepNumber, cobrowsingUserMongoId }})
            }
          }

          await editLobby(lobbyInstance.id, {
            instructionCurrentSteps: {
              [instructionId]: stepNumber
            }
          })

          if(step && step.experienceEffectIds?.length) {
            const experienceEffectIds = step.experienceEffectIds
            const experienceEffects = experienceEffectIds.map(experienceEffectId => experienceModel.experienceEffects[experienceEffectId])

            // const lobbyInstanceMongoId = getState().lobbyInstance.lobbyInstance?.id
            experienceEffects.forEach(experienceEffect => {

              if(experienceEffect.experienceEffectBehavior === EXPERIENCE_EFFECT_GAME_ACTION) {
                const gameRoomInstanceMongoId = gameRoomInstance?.id
                const effectId = experienceEffect.effectId
                const effect = gameModel.effects[effectId]

                if(effect.effectBehavior === EFFECT_INTERFACE_ACTION) {
                  effect.onClick(store.dispatch, gameModel, store.getState)
                } else if(effect.effectBehavior === EFFECT_INTERFACE_UNLOCK) {
                  store.dispatch(updateArcadeGameCharacter({
                    userMongoId: lobbyInstance.cobrowsingUserMongoId,
                    unlockableInterfaceIds: {
                      [effect.interfaceId]: true
                    },
                    merge: true,
                    experienceModelMongoId: experienceModel.id,
                  }))
                } else {
                  window.socket.emit(ON_GAME_INSTANCE_EVENT, { gameRoomInstanceMongoId, gameRoomInstanceEventType: RUN_GAME_INSTANCE_ACTION, data: { effectId } , hostOnly: true })
                }

              }
            })
          }
          
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
  gameRoomInstance: state.gameRoomInstance,
  gameModel: state.gameModel,
});

export default compose(
  connect(mapStateToProps, { editLobby, updateArcadeGameCharacter, runExperienceEffects }),
)(LobbyInstructions);
