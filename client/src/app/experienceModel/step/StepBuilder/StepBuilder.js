import React from 'react';
import { connect } from 'react-redux';
import Typography from '../../../../ui/Typography/Typography';
import VerticalLinearStepper from '../../../../ui/VerticalLinearStepper/VerticalLinearStepper';
import './StepBuilder.scss';
import StepTitle from '../StepTitle/StepTitle';
import StepEditBody from '../StepEditBody/StepEditBody';
import StepEditTitle from '../StepEditTitle/StepEditTitle';

const StepBuilder = ({
  register, control, instructionId, 
  experienceModel: { experienceModel }, 
}) => {
  const instruction = experienceModel.instructions[instructionId]

  function renderSteps() {
    return instruction.stepOrder.map((stepId, index) => {
      const step = instruction.steps[stepId]
      return {
        title: <StepEditTitle instructionId={instructionId} step={step}/>,
        nextButtonText: (index !== (instruction.stepOrder.length - 1)) &&  <StepTitle prefix="Run " step={instruction.steps[instruction.stepOrder[index+1]]}/>,
        stepId,
        body: <StepEditBody step={step} index={index} instructionId={instructionId} register={register} control={control} />,
      }
    })
  }

  return (
    <div className="StepBuilder">
      {instruction.stepOrder.length === 0 && <Typography variant="h5">No steps yet</Typography>}
      {instruction.stepOrder.length > 0 && <VerticalLinearStepper canSkipStep steps={renderSteps(instruction.steps)} />}
    </div>
  )
};

const mapStateToProps = (state) => ({
  experienceModel: state.experienceModel,
});

export default connect(mapStateToProps, { })(StepBuilder);
