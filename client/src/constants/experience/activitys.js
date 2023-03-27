  // {
  //   initialView: { type: String, required: true },
  //   name: {
  //     type: String,
  //     required: true,
  //     default: 'New Activity',
  //   },
  //   gameRoomId: { type: mongoose.Schema.Types.ObjectId, ref: 'GameRoom' },
  //   drawingRoomId: { type: mongoose.Schema.Types.ObjectId, ref: 'DrawingRoom' },

  //   iframes: {
  //     type: Object,
  //     required: true,
  //     default: {}
  //   },
  //   instructionsByRoleId: {
  //     type: Object,
  //     required: true,
  //     default: {}
  //   },
  //   instructions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Instruction' }],
  //   activityId: {
  //     required: true,
  //     immuteable: true,
  //     type: String,
  //     unique: true,
  //   },
  //   activityType: { type: String, required: true },
  //   isRemoved: Boolean,
  //   owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // },

  export const defaultActivity = {
    activityCategory: null,
    activityId: null,
    instructionsByRoleId: {},
    instructions: {},
    name: null,
    gameRoom: {},
    drawingRoom: {},
    iframes: {},
    initialView: {}
  }