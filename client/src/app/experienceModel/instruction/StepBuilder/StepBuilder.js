import React from 'react';
import { Controller } from 'react-hook-form';
import { connect } from 'react-redux';
import { stepBehaviorToDisplayName, STEP_EFFECT } from '../../../../constants';
import { getEffectShorthand, ON_STEP_BEGINS } from '../../../../game/constants';
import SelectEffect from '../../../../game/ui/SelectEffect/SelectEffect';

import Typography from '../../../../ui/Typography/Typography';
import VerticalLinearStepper from '../../../../ui/VerticalLinearStepper/VerticalLinearStepper';
import { RoleChip } from '../../role/RoleChip/RoleChip';
import PromptAddForm from '../PromptAddForm/PromptAddForm';
import { editExperienceModel } from '../../../../store/actions/experience/experienceModelActions';

const StepBuilder = ({  
  register, control, instructionId, 
  experienceModel: { experienceModel }, 
  gameModel: { gameModel },
  editExperienceModel
}) => {

  const instruction = experienceModel.instructions[instructionId]
  
  function renderStepBehaviorForm(step) {
    if(step.stepBehavior === STEP_EFFECT) {
      return <Controller
        {...register(`steps.${step.stepId}.effectIds`, {
          required: true,
        })}
        name={`steps.${step.stepId}.effectIds`}
        control={control}
        render={({ field: { onChange, value } }) => {
          return <SelectEffect
            formLabel={"Effects"}
            eventType={ON_STEP_BEGINS}
            value={value}
            onChange={(event, effectIds) => {
              onChange(effectIds)
          }}/>
        }}
      />
    }
  }

  function renderStepTitle(step) {
    if(step.stepBehavior === STEP_EFFECT) {
      if(!step.effectIds || step.effectIds.length === 0) return 'Game Effect'
      const effect = gameModel.effects[step.effectIds[0]]
      return getEffectShorthand(effect)
    }
  }

  function renderStepBehavior(step) {
    return <div>
      <Typography variant="h4">{stepBehaviorToDisplayName[step.stepBehavior]}</Typography>
      {renderStepBehaviorForm(step)}
    </div>
  }

  function renderStepPrompts(step) {
    return <>
      {step.promptOrder.map((promptId) => {
        const prompt = instruction.prompts[promptId]
        console.log(prompt)
        return <div>
          <RoleChip role={experienceModel.roles[prompt.roleId]} />
          {prompt.text}
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
    </>
  }
        
  
  function renderSteps() {
    return instruction.stepOrder.map((stepId, index) => {
      const step = instruction.steps[stepId]
      console.log('latest step', step)

      // const title = step.title

      const body = <div>
        {renderStepBehavior(step)}
        {renderStepPrompts(step)}
      </div>

      return {
        title: <Typography variant="h5">{renderStepTitle(step)}</Typography>,
        stepId,
        body
      }
    })
  }

  return (
    <div className="StepBuilder">
        <VerticalLinearStepper canSkipStep steps={renderSteps(instruction.steps)} />
    </div>
  )
};

const mapStateToProps = (state) => ({
  experienceModel: state.experienceModel,
  gameModel: state.gameModel
});

export default connect(mapStateToProps, { editExperienceModel })(StepBuilder);
