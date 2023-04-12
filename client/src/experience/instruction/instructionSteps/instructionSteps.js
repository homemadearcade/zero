// import { connect } from "react-redux";
// import { compose } from "redux";
import ActivityChip from "../../../app/experienceModel/activity/ActivityChip/ActivityChip";
import { RoleChip } from "../../../app/experienceModel/role/RoleChip/RoleChip";
import StepPrompts from "../../../app/experienceModel/step/StepPrompts/StepPrompts";
import StepTitle from "../../../app/experienceModel/step/StepTitle/StepTitle";
import { GAME_ROOM_ACTIVITY } from "../../../constants";
import SelectGameInstanceEffect from "../../../game/ui/SelectGameInstanceEffect/SelectGameInstanceEffect";
import { editGameRoom } from "../../../store/actions/game/gameRoomInstanceActions";
import Button from "../../../ui/Button/Button";
import Divider from "../../../ui/Divider/Divider";
import Typography from "../../../ui/Typography/Typography";

export function instructionSteps({ instruction, lobbyInstance, myRoleId, gameModel, gameRoomInstance }) {
  let steps = []

  instruction.stepOrder.forEach((stepId, index) => {
    const step = instruction.steps[stepId]

    if(step.activityId) {
      const activity = lobbyInstance.activitys[step.activityId]      
      const instructionId = activity.instructionsByRoleId[myRoleId]

      if(activity.activityCategory === GAME_ROOM_ACTIVITY && instructionId) {
        const instruction = lobbyInstance.instructions[instructionId]

        if(instruction.stepOrder.length === 0) return

        const playerInstancesById = gameRoomInstance.members.reduce((prev, next) => {
          prev[next.userMongoId] = next
          return prev
        }, {})
        const hostPlayer = playerInstancesById[gameRoomInstance.hostUserMongoId]

        const shouldContinueBeDisabledCheck = () => {

          if(!gameModel || !gameModel?.id) {
            return <>
              Game is loading..
            </>
          }
          if(gameRoomInstance?.arcadeGameMongoId !== instruction.arcadeGameMongoId) {
            return <>
              Incorrect game loaded!
              <Button onClick={async () => {
                await editGameRoom(gameRoomInstance.id, {
                  arcadeGameMongoId: instruction.arcadeGameMongoId,
                })
              }}>Load Correct Game</Button>
            </>
          }
          if(!hostPlayer?.loadedGameMongoId) {
            return <>
              Game Host is not present or is still loading Game
            </>
          }
          if(hostPlayer?.loadedGameMongoId !== gameModel?.id) {
            return <>
              Game Host has incorrect game loaded
            </>
          }
        }

        steps.push({
          stepId: step.stepId,
          title: <Typography component="h5" variant="h5">
            <Divider/>
            Start
            <ActivityChip activity={activity}/>
            </Typography>,
            shouldContinueBeDisabledCheck,
            break: true
          })

        instruction.stepOrder.forEach((stepId, index) => {
          const step = instruction.steps[stepId]

          steps.push({
            stepId,
            title: <Typography variant="h5"><StepTitle instructionId={instruction.instructionId} step={step}/></Typography>,
            body: <div className="LobbyInstructions">
              <RoleChip role={lobbyInstance.roles[step.cobrowsingRoleId]} />
              {gameModel?.id === instruction.arcadeGameMongoId && <>
                <Divider/>
                  <SelectGameInstanceEffect
                    disabled
                    formLabel="These changes occured when this step was loaded" value={step.effectIds} />
                <Divider/>
              </>}
              <StepPrompts instructionId={instruction.instructionId} step={step} />
            </div>,
            shouldContinueBeDisabledCheck,
            nextButtonText: (index !== (instruction.stepOrder.length - 1)) && <StepTitle step={instruction.steps[instruction.stepOrder[index+1]]}/>,
          })
        })

        steps.push({
          stepId: activity.name+ ' Ends',
          title: <Typography component="h5" variant="h5">
            <ActivityChip activity={activity}/>
            Complete 
            <Divider/>
          </Typography>,
          break: true
        })
      } else {
        const activity = lobbyInstance.activitys[step.activityId]
        steps.push({
          stepId,
          title: <div>
              <Typography component="h5" variant="h5">
                <ActivityChip activity={activity}/>
              </Typography>
          </div>,
          body: <div className="LobbyInstructions">
            <RoleChip role={lobbyInstance.roles[step.cobrowsingRoleId]} />
            <Divider/>
            <StepPrompts instructionId={instruction.instructionId} step={step} />
          </div>,
          nextButtonText: (index !== (instruction.stepOrder.length - 1)) &&  <StepTitle step={instruction.steps[instruction.stepOrder[index+1]]}/>,
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
