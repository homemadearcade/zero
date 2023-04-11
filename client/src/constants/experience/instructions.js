import { INSTRUCTION_GAME_ROOM, INSTRUCTION_LOBBY } from "./constants/instructions"


export const instructionToInterfaceData = {
  [INSTRUCTION_GAME_ROOM]: {
    displayName: 'Game',
    icon: 'faGamepad',
    // isCreateable: true,
  },
  [INSTRUCTION_LOBBY]: {
    displayName: 'Lobby',
    icon: 'faDoorOpen',
    // isCreateable: true,
  },
  // [INSTRUCTION_DRAWING_ROOM]: {
  //   displayName: 'Drawing',
  //   icon: 'faPaintbrush',
  // },
}


export const defaultInstructions = {
  name: null,
  steps: {},
  prompts: {},
  stepOrder: [],
  instructionId: null,
  instructionCategory: null,
  arcadeGameMongoId: null,
  activityId: null,
  isRemoved: false
}