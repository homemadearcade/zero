import { INSTRUCTION_GAME_ROOM, INSTRUCTION_LOBBY } from "../instructions";
import { STEP_CHANGE_ACTIVITY, STEP_EFFECT, STEP_GAME_INSTANCE_EVENT, STEP_LOBBY_EVENT } from "../steps";

export const instructionCategoryToStepBehaviors = {
  [INSTRUCTION_GAME_ROOM]: [STEP_EFFECT, STEP_GAME_INSTANCE_EVENT],
  [INSTRUCTION_LOBBY]: [STEP_CHANGE_ACTIVITY, STEP_LOBBY_EVENT],
}

export const stepBehaviorToDisplayName = {
  [STEP_EFFECT]: 'Game Effect',
  [STEP_GAME_INSTANCE_EVENT]: 'Game Animation',
  [STEP_LOBBY_EVENT]: 'Lobby Animation',
  [STEP_CHANGE_ACTIVITY]: 'Change Activity',
}
