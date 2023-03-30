import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { editLobby } from '../../../store/actions/experience/lobbyInstanceActions';
import { VerticalLinearStepperBody } from '../../../ui/VerticalLinearStepper/VerticalLinearStepper';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';

function ActivityVerticalLinearStepper({steps, lobbyInstance: { lobbyInstance }, completed, editLobby, canSkipStep }) {
  function updateStep(step) {
    editLobby(lobbyInstance.id, {
      currentStep: step
    })
  }
  
  const activeStep = lobbyInstance.currentStep

  const handleNext = () => {
    updateStep(activeStep + 1);
  };

  const handlePrev = () => {
    updateStep(activeStep - 1);
  };

  const handleReset = () => {
    updateStep(0);
  };

  return <VerticalLinearStepperBody steps={steps} completed={completed} activeStep={activeStep} onClickNext={handleNext} onClickPrev={handlePrev} onClickReset={handleReset} canSkipStep={canSkipStep} onChangeStep={(step) => {
    updateStep(step);
  }} />
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  lobbyInstance: state.lobbyInstance
});

export default compose(
  connect(mapStateToProps, { editLobby }),
)(ActivityVerticalLinearStepper);
