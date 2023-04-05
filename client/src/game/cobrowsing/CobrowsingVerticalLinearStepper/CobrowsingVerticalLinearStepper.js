import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { VerticalLinearStepperBody } from '../../../ui/VerticalLinearStepper/VerticalLinearStepper';
import { updateVerticalLinearStepper } from '../../../store/actions/game/gameSelectorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';

function CobrowsingVerticalLinearStepper({interfaceId, steps, updateVerticalLinearStepper, gameSelector, completed}) {
  if(!gameSelector.verticalLinearSteppers) return 

  const activeStep = gameSelector.verticalLinearSteppers[interfaceId]

  const handleNext = () => {
    updateVerticalLinearStepper(interfaceId, activeStep + 1);
  };

  const handlePrev = () => {
    updateVerticalLinearStepper(interfaceId, activeStep - 1);
  };

  const handleReset = () => {
    updateVerticalLinearStepper(interfaceId, 0);
  };

  return <VerticalLinearStepperBody steps={steps} completed={completed} activeStep={activeStep} onClickNext={handleNext} onClickPrev={handlePrev} onClickReset={handleReset} onChangeStep={(step) => {
    updateVerticalLinearStepper(interfaceId, step);
  }} />
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameSelector: state.gameSelector,
});

export default compose(
  connect(mapStateToProps, { updateVerticalLinearStepper }),
)(CobrowsingVerticalLinearStepper);
