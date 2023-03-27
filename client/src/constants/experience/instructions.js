export const INSTRUCTION_CATEGORY_GAME_INSTANCE = 'INSTRUCTION_CATEGORY_GAME_INSTANCE'
export const INSTRUCTION_CATEGORY_LOBBY = 'INSTRUCTION_CATEGORY_LOBBY'
export const INSTRUCTION_CATEGORY_GAME_ROOM = 'INSTRUCTION_CATEGORY_GAME_ROOM'

export const defaultInstructions = {
  name: null,
  steps: {},
  stepOrder: [],
  instructionId: null,
  instructionCategory: null
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