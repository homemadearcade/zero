import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { VerticalLinearStepperBody } from '../../../ui/VerticalLinearStepper/VerticalLinearStepper';
import { updateVerticalLinearStepper } from '../../../store/actions/gameSelectorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';

function CobrowsingVerticalLinearStepper({stepperId, steps, updateVerticalLinearStepper, gameSelector, completed}) {
  if(!gameSelector.verticalLinearSteppers) return 

  const activeStep = gameSelector.verticalLinearSteppers[stepperId]

  const handleNext = () => {
    updateVerticalLinearStepper(stepperId, activeStep + 1);
  };

  const handlePrev = () => {
    updateVerticalLinearStepper(stepperId, activeStep - 1);
  };

  const handleReset = () => {
    updateVerticalLinearStepper(stepperId, 0);
  };

  return <VerticalLinearStepperBody steps={steps} completed={completed} activeStep={activeStep} onClickNext={handleNext} onClickPrev={handlePrev} onClickReset={handleReset} onChangeStep={(step) => {
    updateVerticalLinearStepper(stepperId, step);
  }} />
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameSelector: state.gameSelector,
});

export default compose(
  connect(mapStateToProps, { updateVerticalLinearStepper }),
)(CobrowsingVerticalLinearStepper);
