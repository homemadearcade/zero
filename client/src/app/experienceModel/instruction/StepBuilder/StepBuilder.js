import React from 'react';
import { Controller } from 'react-hook-form';
import { connect } from 'react-redux';
import { actionIdData, stepBehaviorToAction, STEP_EFFECT, STEP_OPEN_INTERFACE, STEP_UNLOCK_INTERFACE } from '../../../../constants';
import { getEffectShorthand, ON_STEP_BEGINS } from '../../../../game/constants';
import SelectEffect from '../../../../game/ui/SelectEffect/SelectEffect';

import Typography from '../../../../ui/Typography/Typography';
import VerticalLinearStepper from '../../../../ui/VerticalLinearStepper/VerticalLinearStepper';
import { RoleChip } from '../../role/RoleChip/RoleChip';
import PromptAddForm from '../PromptAddForm/PromptAddForm';
import { editExperienceModel } from '../../../../store/actions/experience/experienceModelActions';
import {  Paper } from '@mui/material';
import './StepBuilder.scss';
import IconButton from '../../../../ui/IconButton/IconButton';
import SelectInterface from '../../../../ui/SelectInterface/SelectInterface';
import SelectAction from '../../../../ui/SelectAction/SelectAction';
import { interfaceIdData } from '../../../../constants/interfaceIdData';

const StepBuilder = ({  
  register, control, instructionId, 
  experienceModel: { experienceModel }, 
  gameModel: { gameModel },
  editExperienceModel,
}) => {

  const instruction = experienceModel.instructions[instructionId]
  
  function renderStepBehaviorForm(step) {
    if(step.stepBehavior === STEP_EFFECT) {
      return <Controller
        {...register(`steps.${step.stepId}.effectIds`, {
          // required: true,
        })}
        name={`steps.${step.stepId}.effectIds`}
        control={control}
        render={({ field: { onChange, value } }) => {
          return <SelectEffect
            formLabel={"Effects to run when this step begins"}
            eventType={ON_STEP_BEGINS}
            value={value}
            onChange={(event, effectIds) => {
              onChange(effectIds)
              editExperienceModel(experienceModel.id, {
                instructions: {
                  [instructionId]: {
                    steps: {
                      [step.stepId]: {
                        effectIds
                      }
                    }
                  }
                }
              })
          }}/>
        }}
      />
    }
    if(step.stepBehavior === STEP_UNLOCK_INTERFACE) {
      return <>
        <RoleChip role={experienceModel.roles[step.actionRoleId]} suffix="'s Interface" />
        <Controller
          {...register(`steps.${step.stepId}.interfaceIds`, {
            // required: true,
          })}
          name={`steps.${step.stepId}.interfaceIds`}
          control={control}
          render={({ field: { onChange, value } }) => {
            return <SelectInterface
              formLabel={"Interface sections to UNLOCK when this step begins"}
              actionType={stepBehaviorToAction[step.stepBehavior]}
              value={value}
              onChange={(event, interfaceIds) => {
                onChange(interfaceIds)
                editExperienceModel(experienceModel.id, {
                  instructions: {
                    [instructionId]: {
                      steps: {
                        [step.stepId]: {
                          interfaceIds
                        }
                      }
                    }
                  }
                })
            }}/>
          }}
        />
      </>
    }

    if(step.stepBehavior === STEP_OPEN_INTERFACE) {
      return <>
        <RoleChip role={experienceModel.roles[step.actionRoleId]} suffix="'s Interface" />
        <Controller
          {...register(`steps.${step.stepId}.actionIds`, {
            // required: true,
          })}
          name={`steps.${step.stepId}.actionIds`}
          control={control}
          render={({ field: { onChange, value } }) => {
            return <SelectAction
              formLabel={"Interface sections to OPEN when this step begins"}
              actionType={stepBehaviorToAction[step.stepBehavior]}
              value={value}
              onChange={(event, actionIds) => {
                onChange(actionIds)
                editExperienceModel(experienceModel.id, {
                  instructions: {
                    [instructionId]: {
                      steps: {
                        [step.stepId]: {
                          actionIds
                        }
                      }
                    }
                  }
                })
            }}/>
          }}
        />
      </>
    }
  }

  function renderStepTitle(step) {
    if(step.stepBehavior === STEP_EFFECT) {
      if(!step.effectIds || step.effectIds.length === 0) return 'Game Effect'
      const effect = gameModel.effects[step.effectIds[0]]
      return getEffectShorthand(effect)
    } else if(step.stepBehavior === STEP_OPEN_INTERFACE) {
      if(!step.actionIds || step.actionIds.length === 0) return 'Open Interface'
      const actionData = actionIdData[step.actionIds[0]]
      return actionData.name
    } else if(step.stepBehavior === STEP_UNLOCK_INTERFACE) {
      if(!step.interfaceIds || step.interfaceIds.length === 0) return 'Unlock Interface'
      const interfaceData = interfaceIdData[step.interfaceIds[0]]
      return 'Unlock ' + (interfaceData.name || interfaceData.previewText)
    }
  }

  function renderStepBehavior(step) {
    return <div>
      {renderStepBehaviorForm(step)}
    </div>
  }

  function renderStepPrompts(step) {
    return <div className="StepBuilder__prompts">
        {step.promptOrder.map((promptId, index) => {
          const prompt = instruction.prompts[promptId]
          const role = experienceModel.roles[prompt.roleId]
          return <div className="StepBuilder__prompt" style={{
            border: '1px solid' + role.color
        }}>
          <Paper elevation={1}>
            {renderPromptButtons(step, prompt, index)}
            <RoleChip className="StepBuilder__prompt-role" role={role} />
            <Typography className="StepBuilder__prompt-text" variant="body1">{prompt.text}</Typography>
          </Paper>
        </div>
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
  }

  function renderStepButtons(step, index) {
    return <div className='StepBuilder__step-buttons'>
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
  
  function renderSteps() {
    return instruction.stepOrder.map((stepId, index) => {
      const step = instruction.steps[stepId]

      // const title = step.title

      const body = <div className="StepBuilder__step-body">
        {renderStepButtons(step, index)}
        {renderStepBehavior(step)}
        {renderStepPrompts(step)}
      </div>
      return {
        title: <Typography variant="h5">{renderStepTitle(step)}</Typography>,
        nextButtonText: (index !== (instruction.stepOrder.length - 1)) &&  ('Run ' + renderStepTitle(instruction.steps[instruction.stepOrder[index+1]])),
        stepId,
        body
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
  gameModel: state.gameModel
});

export default connect(mapStateToProps, { editExperienceModel })(StepBuilder);
