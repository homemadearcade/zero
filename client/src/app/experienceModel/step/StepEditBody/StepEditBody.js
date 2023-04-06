import React from 'react';
import { Controller } from 'react-hook-form';
import { connect } from 'react-redux';
import { ON_STEP_BEGINS } from '../../../../game/constants';

import { editExperienceModel } from '../../../../store/actions/experience/experienceModelActions';
import './StepEditBody.scss';
import IconButton from '../../../../ui/IconButton/IconButton';
import StepEditPrompts from '../StepEditPrompts/StepEditPrompts';
import SelectExperienceEffect from '../../../../ui/connected/SelectExperienceEffect/SelectExperienceEffect';

const StepEditBody = ({  
  register, control, instructionId, 
  experienceModel: { experienceModel }, 
  editExperienceModel,
  step, index,
}) => {
  const instruction = experienceModel.instructions[instructionId]
  
  function renderStepBehaviorForm(step) {
    return <Controller
      {...register(`steps.${step.stepId}.experienceEffectIds`, {
        // required: true,
      })}
      name={`steps.${step.stepId}.experienceEffectIds`}
      control={control}
      render={({ field: { onChange, value } }) => {
        return <SelectExperienceEffect
          formLabel={"Changes that occur when this step begins"}
          eventType={ON_STEP_BEGINS}
          value={value}
          instructionCategory={instruction.instructionCategory}
          onChange={(experienceEffectIds) => {
            onChange(experienceEffectIds)
            editExperienceModel(experienceModel.id, {
              instructions: {
                [instructionId]: {
                  steps: {
                    [step.stepId]: {
                      experienceEffectIds
                    }
                  }
                }
              }
            })
        }}/>
      }}
    />
  }

  function renderStepButtons(step, index) {
    return <div className='StepEditBody__buttons'>
      {index !== 0 && <IconButton icon="faArrowUp" color="primary" onClick={() => {
        // reorder step to one index higher
        const stepIndex = instruction.stepOrder.indexOf(step.stepId)
        if(stepIndex === 0) return
        const newStepOrder = [...instruction.stepOrder]
        newStepOrder[stepIndex] = newStepOrder[stepIndex - 1]
        newStepOrder[stepIndex - 1] = step.stepId

        editExperienceModel(experienceModel.id, {
          instructions: {
            [instructionId]: {
              stepOrder: newStepOrder
            }
          },
        })
      }}/>}
      {index !== instruction.stepOrder.length - 1 && <IconButton icon="faArrowDown" color="primary" onClick={() => {
        // reorder step to one index lower
        const stepIndex = instruction.stepOrder.indexOf(step.stepId)
        if(stepIndex === instruction.stepOrder.length - 1) return
        const newStepOrder = [...instruction.stepOrder]
        newStepOrder[stepIndex] = newStepOrder[stepIndex + 1]
        newStepOrder[stepIndex + 1] = step.stepId

        editExperienceModel(experienceModel.id, {
          instructions: {
            [instructionId]: {
              stepOrder: newStepOrder
            }
          },
        })
      }}/>}
        <IconButton icon="faClose" color="primary" onClick={() => {
          const newStepOrder = instruction.stepOrder.filter((stepId) => stepId !== step.stepId)
          editExperienceModel(experienceModel.id, {
            instructions: {
              [instructionId]: {
                stepOrder:newStepOrder,
                steps: {
                  [step.stepId]: null
                }
              },
            },
          })
      }}/>
    </div>      
  }   


  function renderPromptButtons(step, prompt, index) {
    return <div className='StepBuilder__prompt-buttons'>
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

  return<div className="StepEditBody">
    {renderStepButtons(step, index)}
    {renderStepBehaviorForm(step)}
    <StepEditPrompts instructionId={instructionId} step={step}/>
  </div>
};

const mapStateToProps = (state) => ({
  experienceModel: state.experienceModel,
});

export default connect(mapStateToProps, { editExperienceModel })(StepEditBody);
