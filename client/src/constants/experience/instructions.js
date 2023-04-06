export const INSTRUCTION_GAME_ROOM = 'INSTRUCTION_GAME_ROOM'
export const INSTRUCTION_LOBBY = 'INSTRUCTION_LOBBY'
export const INSTRUCTION_DRAWING_ROOM = 'INSTRUCTION_DRAWING_ROOM'

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

export const INSTRUCTION_DID = 'instruction-'

export const defaultInstructions = {
  name: null,
  steps: {},
  prompts: {},
  stepOrder: [],
  instructionId: null,
  instructionCategory: null,
  arcadeGameMongoId: null,
  isRemoved: false
}