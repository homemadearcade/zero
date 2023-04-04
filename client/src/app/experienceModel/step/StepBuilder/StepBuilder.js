import React from 'react';
import { connect } from 'react-redux';
import Typography from '../../../../ui/Typography/Typography';
import VerticalLinearStepper from '../../../../ui/VerticalLinearStepper/VerticalLinearStepper';
import { editExperienceModel } from '../../../../store/actions/experience/experienceModelActions';
import './StepBuilder.scss';
import IconButton from '../../../../ui/IconButton/IconButton';
import StepTitle from '../StepTitle/StepTitle';
import StepEditBody from '../StepEditBody/StepEditBody';

const StepBuilder = ({  
  register, control, instructionId, 
  experienceModel: { experienceModel }, 
  editExperienceModel,
}) => {
  const instruction = experienceModel.instructions[instructionId]

  function renderSteps() {
    return instruction.stepOrder.map((stepId, index) => {
      const step = instruction.steps[stepId]
      
      return {
        title: <Typography variant="h5">
          <StepTitle step={step}/>
          <IconButton icon="faEdit" color="primary" onClick={() => {

          }}/>
        </Typography>,
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

export default connect(mapStateToProps, { editExperienceModel })(StepBuilder);
