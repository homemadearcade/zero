"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateLobby = exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  Schema
} = _mongoose.default;
const lobbySchema = new Schema({
  participants: [{
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'User'
  }],
  participantId: {
    type: String // required: true,

  },
  game: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'Game'
  },
  gameHostId: {
    type: String // required: true,

  },
  // guideId: {
  //   type: String,
  //   required: true,
  // },
  startTime: {
    type: String // required: true,

  }
}, {
  timestamps: true
});

const validateLobby = lobby => {
  return true; //Joi.object().pattern(/^/, Joi.date().iso())
  // const schema = {
  //   hero: Joi.object({
  //     // spawnX: Joi.number().required(),
  //     // spawnY: Joi.number().required()
  //   }),
  //   world: Joi.object({
  //   }),
  //   metadata: Joi.object({
  //   }),
  //   objects: Joi.object(),
  //   classes: Joi.object(),
  //   brushes: Joi.object(),
  //   awsImages: Joi.object(),
  // };
  // return Joi.validate(game, schema, { allowUnknown: true });
};

exports.validateLobby = validateLobby;

lobbySchema.methods.toJSON = function () {
  var _this$game;

  return {
    id: this._id.toString(),
    startTime: this.startTime,
    participants: this.participants ? this.participants.map(user => {
      return user.toJSON();
    }) : [],
    game: (_this$game = this.game) === null || _this$game === void 0 ? void 0 : _this$game.toJSON(),
    gameHostId: this.gameHostId,
    participantId: this.participantId // guideId: this.guideId

  };
};

const Lobby = _mongoose.default.model('Lobby', lobbySchema);

var _default = Lobby;
exports.default = _default;
//# sourceMappingURL=Lobby.js.map