/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { editLobby } from '../../../store/actions/experience/lobbyInstanceActions';

import './ActivityInstructions.scss';
import Typography from '../../../ui/Typography/Typography';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import Switch from '../../../ui/Switch/Switch';
import VerticalLinearStepper from '../../../ui/VerticalLinearStepper/VerticalLinearStepper';

const ActivityInstructions = ({
  editLobby,
  lobbyInstance: { lobbyInstance, myRoleId },
  myTracks,
  userTracks,
  activityId
}) => {  
  const [canSkipStep, setCanSkipStep] = useState()

  const activity = lobbyInstance.activities[activityId]
  const instructionId = activity.instructionsByRoleId[myRoleId]
  if(!instructionId) return <div className="ActivityInstructions">No Instructions for Role</div>
  const instruction = lobbyInstance.instructions[instructionId]
  const steps = instruction.stepOrder.map((stepId) => {
    return instruction.steps[stepId]
  })

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
        <VerticalLinearStepper
          canSkipStep={canSkipStep}
          currentStep={activity.instructionCurrentSteps[instructionId]}
          onStepChange={(stepNumber) => {
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
  gameModel: state.gameModel,
  cobrowsing: state.cobrowsing,
});

export default compose(
  connect(mapStateToProps, { editLobby, editGameModel }),
)(ActivityInstructions);
