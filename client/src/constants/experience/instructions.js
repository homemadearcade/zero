export const INSTRUCTION_GAME_ROOM = 'INSTRUCTION_GAME_ROOM'
export const INSTRUCTION_LOBBY = 'INSTRUCTION_LOBBY'
export const INSTRUCTION_DRAWING_ROOM = 'INSTRUCTION_DRAWING_ROOM'
export const INSTRUCTION_NEW_GAME = 'INSTRUCTION_NEW_GAME'

export const instructionToInterfaceData = {
  [INSTRUCTION_GAME_ROOM]: {
    displayName: 'Game',
    icon: 'faGamepad',
    // isCreateable: true,
  },
  // [INSTRUCTION_NEW_GAME]: {
  //   displayName: 'New Game',
  //   icon: 'faGamepad',
  //   isCreateable: false,
  // },
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

export const INSTRUCTION_ID_PREFIX = 'instruction-'

export const defaultInstructions = {
  name: null,
  steps: {},
  stepOrder: [],
  instructionId: null,
  instructionCategory: null,
  gameId: null,
  isRemoved: false
}
  // {
  //   name: {
  //     type: String,
  //     required: true,
  //     default: 'New Activity',
  //   },
  //   steps: {
  //     type: Object,
  //     required: true,
  //     default: {}
  //   },
  //   stepOrder: {
  //     type: Array,
  //     required: true,
  //     default: []
  //   },
  //   gameId: {
  //     type: String,
  //     required: false,
  //   },
  //   instructionShortId: {
  //     required: true,
  //     immuteable: true,
  //     type: String,
  //     unique: true,
  //   },
  //   instructionType: { type: String, required: true },