/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { editLobby } from '../../../store/actions/experience/lobbyInstanceActions';

import './ActivityInstructions.scss';
import Typography from '../../../ui/Typography/Typography';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import Switch from '../../../ui/Switch/Switch';
import { VerticalLinearStepperControlled } from '../../../ui/VerticalLinearStepper/VerticalLinearStepper';
import { instructionSteps } from '../../instruction/instructionSteps/instructionSteps';
import { GAME_ROOM_ACTIVITY } from '../../../constants';
import { ON_GAME_INSTANCE_EVENT } from '../../../store/types';
import { runExperienceEffects } from '../../../store/actions/experience/experienceModelActions';
import { EVENT_GAME_ROOM_STEP_INITIALIZED } from '../../../game/constants';

const ActivityInstructions = ({
  editLobby,
  lobbyInstance: { lobbyInstance, myRoleId },
  gameRoomInstance: { gameRoomInstance },
  runExperienceEffects,
  activityId
}) => {  
  const [canSkipStep, setCanSkipStep] = useState()

  const activity = lobbyInstance.activitys[activityId]
  const instructionId = activity.instructionsByRoleId[myRoleId]
  if(!instructionId) return <div className="ActivityInstructions">No Instructions for Role for Activity: {activity.name}</div>
  const instruction = lobbyInstance.instructions[instructionId]

  const steps = [{
      stepId: activity.name+ 'Begins',
      title: <Typography component="h3" variant="h3">{activity.name+ ' begins'}</Typography>,
      break: true
  }].concat(instructionSteps({instruction}))

  return (
    <div className="ActivityInstructions">
      <div className="ActivityInstructions__stepper">
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
          currentStep={activity.instructionCurrentSteps[instructionId]}
          onStepChange={async (stepNumber, stepId) => {
            const step = instruction.steps[stepId]
            if(step) {
              await runExperienceEffects({
                experienceEffectIds: step.experienceEffectIds
              })
            }
            editLobby(lobbyInstance.id, {
              activitys: {
                [activityId]: {
                  instructionCurrentSteps: {
                   [instructionId]: stepNumber
                  }
                },
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
  gameRoomInstance: state.gameRoomInstance,
});

export default compose(
  connect(mapStateToProps, { editLobby, editGameModel, runExperienceEffects }),
)(ActivityInstructions);
