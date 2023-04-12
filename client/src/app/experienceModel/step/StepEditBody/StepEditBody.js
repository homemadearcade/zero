import React from 'react';
import { Controller } from 'react-hook-form';
import { connect } from 'react-redux';
import { ON_STEP_BEGINS } from '../../../../game/constants';

import { editExperienceModel } from '../../../../store/actions/experience/experienceModelActions';
import './StepEditBody.scss';
import IconButton from '../../../../ui/IconButton/IconButton';
import StepEditPrompts from '../StepEditPrompts/StepEditPrompts';
import SelectRole from '../../../../ui/connected/SelectRole/SelectRole';
import Divider from '../../../../ui/Divider/Divider';
import { activityToInterfaceData, INSTRUCTION_GAME_ROOM, INSTRUCTION_LOBBY } from '../../../../constants';
import Icon from '../../../../ui/Icon/Icon';
import FormLabel from '../../../../ui/FormLabel/FormLabel';
import { Paper } from '@mui/material';
import ActivityChip from '../../activity/ActivityChip/ActivityChip';
import SelectGameInstanceEffect from '../../../../game/ui/SelectGameInstanceEffect/SelectGameInstanceEffect';

const StepEditBody = ({  
  register, control, instructionId, 
  experienceModel: { experienceModel }, 
  editExperienceModel,
  step, index,
}) => {
  const instruction = experienceModel.instructions[instructionId]
  const activity = experienceModel.activitys[step.activityId]
  
  function renderStepBehaviorForm(step) {
    return <Controller
      {...register(`steps.${step.stepId}.effectIds`, {
        // required: true,
      })}
      name={`steps.${step.stepId}.effectIds`}
      control={control}
      render={({ field: { onChange, value } }) => {
        return <SelectGameInstanceEffect
          formLabel={"Changes that occur when this step begins"}
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

  return<div className="StepEditBody">
    {renderStepButtons(step, index)}
    <Divider/>
    <Controller
      {...register(`steps.${step.stepId}.cobrowsingRoleId`, {
        required: true,
      })}
      name={`steps.${step.stepId}.cobrowsingRoleId`}
      control={control}
      render={({ field: { onChange, value } }) => (
        <SelectRole
        formLabel="Browsing Role:"
        onSelect={(roleIds) => {
          if(!roleIds || roleIds.length === 0) return
          const roleId = roleIds[roleIds.length - 1]
          onChange(roleId)
          editExperienceModel(experienceModel.id, {
            instructions: {
              [instructionId]: {
                steps: {
                  [step.stepId]: {
                    cobrowsingRoleId: roleId
                  }
                }
              }
            }
          })
        }} value={value ? [value] : []} />
      )}
    />
    {instruction.instructionCategory === INSTRUCTION_LOBBY && activity && <>
      <Divider/>
      <FormLabel>Activity</FormLabel>
      <ActivityChip activity={activity} />
    </>}
    {instruction.instructionCategory === INSTRUCTION_GAME_ROOM && <>
      <Divider/>
      {renderStepBehaviorForm(step)}
    </>}
    <Divider/>
    <StepEditPrompts instructionId={instructionId} step={step}/>
    <Divider/>
  </div>
};

const mapStateToProps = (state) => ({
  experienceModel: state.experienceModel,
});

export default connect(mapStateToProps, { editExperienceModel })(StepEditBody);
