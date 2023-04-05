import React from 'react';
import { connect } from 'react-redux';

import { editExperienceModel } from '../../../../store/actions/experience/experienceModelActions';
import './StepEditPrompts.scss';
import IconButton from '../../../../ui/IconButton/IconButton';
import StepPrompt from '../StepPrompt/StepPrompt';
import PromptAddForm from '../PromptAddForm/PromptAddForm';

const StepEditPrompts = ({  
  instructionId, 
  experienceModel: { experienceModel }, 
  editExperienceModel,
  step
}) => {
  const instruction = experienceModel.instructions[instructionId]

  function renderPromptButtons(step, prompt, index) {
    return <div className='StepEditPrompts__buttons'>
      {index !== 0 && <IconButton size="small" icon="faArrowUp" color="primary" onClick={() => {
        // reorder step to one index higher
        const promptIndex = step.promptOrder.indexOf(prompt.promptId)
        if(promptIndex === 0) return
        const newPromptOrder = [...step.promptOrder]
        newPromptOrder[promptIndex] = newPromptOrder[promptIndex - 1]
        newPromptOrder[promptIndex - 1] = prompt.promptId

        editExperienceModel(experienceModel.id, {
          instructions: {
            [instructionId]: {
              steps: {
                  [step.stepId]: {
                    promptOrder: newPromptOrder
                  }
              },
            }
          }
        })
      }}/>}
      {index !== step.promptOrder.length - 1 && <IconButton size="small" icon="faArrowDown" color="primary" onClick={() => {
        // reorder prompt to one index lower
        const promptIndex = step.promptOrder.indexOf(prompt.promptId)
        if(promptIndex === step.promptOrder.length - 1) return
        const newPromptOrder = [...step.promptOrder]
        newPromptOrder[promptIndex] = newPromptOrder[promptIndex + 1]
        newPromptOrder[promptIndex + 1] = prompt.promptId

        editExperienceModel(experienceModel.id, {
          instructions: {
            [instructionId]: {
              steps: {
                [step.stepId]: {
                  promptOrder: newPromptOrder
                }
              },
            }
          }
        })
      }}/>}
      
      <IconButton size="small" icon="faClose" color="primary" onClick={() => {
        const newPromptOrder = step.promptOrder.filter((promptId) => promptId !== prompt.promptId)
        editExperienceModel(experienceModel.id, {
          instructions: {
            [instructionId]: {
              steps: {
                [step.stepId]: {
                  promptOrder: newPromptOrder
                },
              },
              prompts: {
                [prompt.promptId]: null
              }
            }
          }
        })
      }}/>
    </div>  
  }
    
  return <div className="StepEditPrompts">
    {step.promptOrder.map((promptId, index) => {
      const prompt = instruction.prompts[promptId]
      return <StepPrompt prompt={prompt}>
          {renderPromptButtons(step, prompt, index)}
        </StepPrompt>
    })}
    <PromptAddForm onSubmit={(prompt) => {
      editExperienceModel(experienceModel.id, {
          instructions: {
            [instructionId]: {
              prompts: {
                [prompt.promptId]: prompt
              },
              steps: {
                [step.stepId]: {
                  promptOrder: [...step.promptOrder, prompt.promptId]
                }
              }
            }
          },
        })
    }}/>
  </div>
};

const mapStateToProps = (state) => ({
  experienceModel: state.experienceModel,
});

export default connect(mapStateToProps, { editExperienceModel })(StepEditPrompts);
