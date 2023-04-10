// import { connect } from "react-redux";
// import { compose } from "redux";
import StepPrompts from "../../../app/experienceModel/step/StepPrompts/StepPrompts";
import StepTitle from "../../../app/experienceModel/step/StepTitle/StepTitle";
import SelectExperienceEffect from "../../../ui/connected/SelectExperienceEffect/SelectExperienceEffect";
import Typography from "../../../ui/Typography/Typography";

export function instructionSteps({ instruction }) {
  return instruction.stepOrder.map((stepId, index) => {
    const step = instruction.steps[stepId]
    return {
      stepId,
      title: <Typography variant="h5"><StepTitle instructionId={instruction.instructionId} step={step}/></Typography>,
      body: <div className="LobbyInstructions">
        <SelectExperienceEffect
          instructionCategory={instruction.instructionCategory}
          arcadeGameMongoId={instruction.arcadeGameMongoId}
          disabled
          formLabel="These changes occured when this step was loaded" value={step.experienceEffectIds} />
        <StepPrompts instructionId={instruction.instructionId} step={step} />
      </div>,
      nextButtonText: (index !== (instruction.stepOrder.length - 1)) &&  <StepTitle step={instruction.steps[instruction.stepOrder[index+1]]}/>,
    }
  })
}

// const mapStateToProps = (state) => ({

// });

// export default compose(
//   connect(mapStateToProps, {  }),
// )(InstructionSteps);
