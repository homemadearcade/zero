import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { editLobby } from '../../../store/actions/lobbyActions';
import { VerticalLinearStepperBody } from '../../../ui/VerticalLinearStepper/VerticalLinearStepper';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';

function ActivityVerticalLinearStepper({steps, lobby: { lobby }, completed, editLobby, canSkipStep }) {
  function updateStep(step) {
    editLobby(lobby.id, {
      currentStep: step
    })
  }
  
  const activeStep = lobby.currentStep

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
  lobby: state.lobby
});

export default compose(
  connect(mapStateToProps, { editLobby }),
)(ActivityVerticalLinearStepper);
