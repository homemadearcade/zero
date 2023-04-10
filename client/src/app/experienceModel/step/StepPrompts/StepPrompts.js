import React from 'react';
import { connect } from 'react-redux';

import { editExperienceModel } from '../../../../store/actions/experience/experienceModelActions';
import './StepPrompts.scss';
import StepPrompt from '../StepPrompt/StepPrompt';

const StepPrompts = ({  
  instructionId, 
  experienceModel: { experienceModel }, 
  step
}) => {
  const instruction = experienceModel.instructions[instructionId]

  return <div className="StepPrompts">
    <div className="StepPrompts__prompts">{step.promptOrder.map((promptId, index) => {
      const prompt = instruction.prompts[promptId]
      return <StepPrompt prompt={prompt}> </StepPrompt>
    })}</div>
  </div>
};

const mapStateToProps = (state) => ({
  experienceModel: state.experienceModel,
});

export default connect(mapStateToProps, { editExperienceModel })(StepPrompts);
