// import { connect } from "react-redux";
// import { compose } from "redux";
import ActivityChip from "../../../app/experienceModel/activity/ActivityChip/ActivityChip";
import { RoleChip } from "../../../app/experienceModel/role/RoleChip/RoleChip";
import StepPrompts from "../../../app/experienceModel/step/StepPrompts/StepPrompts";
import StepTitle from "../../../app/experienceModel/step/StepTitle/StepTitle";
import SelectExperienceEffect from "../../../ui/connected/SelectExperienceEffect/SelectExperienceEffect";
import Divider from "../../../ui/Divider/Divider";
import Typography from "../../../ui/Typography/Typography";

export function instructionSteps({ instruction, lobbyInstance, myRoleId, gameModel }) {
  let steps = []

  instruction.stepOrder.forEach((stepId, index) => {
    const step = instruction.steps[stepId]

    steps.push({
      stepId,
      title: <Typography variant="h5"><StepTitle instructionId={instruction.instructionId} step={step}/></Typography>,
      body: <div className="LobbyInstructions">
        <RoleChip role={lobbyInstance.roles[step.cobrowsingRoleId]} />
        {step.activityId && <>
          <Divider/>
          <ActivityChip activity={lobbyInstance.activitys[step.activityId]} />
        </>}
        <Divider/>
        <StepPrompts instructionId={instruction.instructionId} step={step} />
      </div>,
      nextButtonText: (index !== (instruction.stepOrder.length - 1)) &&  <StepTitle step={instruction.steps[instruction.stepOrder[index+1]]}/>,
    })

    if(step.activityId) {
      const activity = lobbyInstance.activitys[step.activityId]      
      const instructionId = activity.instructionsByRoleId[myRoleId]

      if(instructionId) {
        const instruction = lobbyInstance.instructions[instructionId]

        if(instruction.stepOrder.length === 0) return

        steps.push({
          stepId: activity.name+ 'Begins',
          title: <Typography component="h3" variant="h3">{activity.name+ ' begins'}</Typography>,
          shouldContinueBeDisabledCheck: () => {
            if(gameModel?.id !== instruction.arcadeGameMongoId) {
              return <>
                Game is loading..
              </>
            }
          },
        })

        instruction.stepOrder.forEach((stepId, index) => {
          const step = instruction.steps[stepId]

          steps.push({
            stepId,
            title: <Typography variant="h5"><StepTitle instructionId={instruction.instructionId} step={step}/></Typography>,
            body: <div className="LobbyInstructions">
              <RoleChip role={lobbyInstance.roles[step.cobrowsingRoleId]} />
              <Divider/>
              <ActivityChip activity={activity} />
              <Divider/>
              {gameModel?.id === instruction.arcadeGameMongoId && <SelectExperienceEffect
                instructionCategory={instruction.instructionCategory}
                arcadeGameMongoId={instruction.arcadeGameMongoId}
                disabled
                formLabel="These changes occured when this step was loaded" value={step.experienceEffectIds} />}
              <Divider/>
              <StepPrompts instructionId={instruction.instructionId} step={step} />
            </div>,
            nextButtonText: (index !== (instruction.stepOrder.length - 1)) && <StepTitle step={instruction.steps[instruction.stepOrder[index+1]]}/>,
          })
        })

        
        steps.push({
          stepId: activity.name+ ' Ends',
          title: <Typography component="h3" variant="h3">{activity.name+ ' ends'}</Typography>,
        })
      }

  
    }
  })

  return steps 
}

// const mapStateToProps = (state) => ({

// });

// export default compose(
//   connect(mapStateToProps, {  }),
// )(InstructionSteps);
